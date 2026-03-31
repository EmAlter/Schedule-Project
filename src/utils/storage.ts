import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { type Block } from '../types';

export interface Schedule {
    id: string;
    date?: string | number | Date;
    subtitle?: string;
    blocks?: Block[];
    updatedAt: string;
    [key: string]: any;
}

// Storage mode: 'local', 'supabase', 'firebase'
const isDesktop = '__TAURI__' in window;
const STORAGE_MODE = isDesktop ? 'local' : (import.meta.env.VITE_STORAGE_MODE || 'local');

// ---------------------------------------------------------
// CLOUD CONFIGURATION
// ---------------------------------------------------------

// 1. Supabase
let supabase: any = null;
if (STORAGE_MODE === 'supabase') {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error("Warning: Supabase mode is enabled but missing keys in .env");
    } else {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
}

// 2. Firebase
let db: any = null;
if (STORAGE_MODE === 'firebase') {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };
    
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("Warning: Firebase mode is enabled but missing keys in .env");
    } else {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    }
}

// ---------------------------------------------------------
// STORAGE API
// ---------------------------------------------------------

export const storageAPI = {
    async getSchedules(): Promise<Schedule[]> {
        if (STORAGE_MODE === 'local') {
            const data = localStorage.getItem('schedules');
            return data ? JSON.parse(data) : [];
        }

        if (STORAGE_MODE === 'supabase' && supabase) {
            const { data, error } = await supabase
                .from('schedules')
                .select('*')
                .order('updatedAt', { ascending: false }); 
            
            if (error) {
                console.error("Error loading from Supabase:", error);
                return [];
            }
            return data as Schedule[];
        }

        if (STORAGE_MODE === 'firebase' && db) {
            try {
                const querySnapshot = await getDocs(collection(db, 'schedules'));
                const schedules: Schedule[] = querySnapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                } as Schedule));
                const getDateMs = (value: any) => (value ? new Date(value).getTime() : 0);
                return schedules.sort((a, b) => getDateMs(b.updatedAt) - getDateMs(a.updatedAt));
            } catch (error) {
                console.error("Error loading from Firebase:", error);
                return [];
            }
        }

        return [];
    },

    async getSchedule(id: string): Promise<Schedule | null> {
        if (STORAGE_MODE === 'local') {
            const data = localStorage.getItem('schedules');
            if (!data) return null;
            const schedules: Schedule[] = JSON.parse(data);
            return schedules.find(s => s.id === id) || null;
        }

        if (STORAGE_MODE === 'supabase' && supabase) {
            const { data, error } = await supabase
                .from('schedules')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) {
                console.error("Error loading single schedule (Supabase):", error);
                return null;
            }
            return data as Schedule;
        }

        if (STORAGE_MODE === 'firebase' && db) {
            try {
                const docRef = doc(db, 'schedules', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    return { id: docSnap.id, ...docSnap.data() } as Schedule;
                }
            } catch (error) {
                console.error("Error loading single schedule (Firebase):", error);
            }
            return null;
        }

        return null;
    },

    async saveSchedule(schedule: Schedule): Promise<void> {
        if (STORAGE_MODE === 'local') {
            const data = localStorage.getItem('schedules');
            let schedules: Schedule[] = data ? JSON.parse(data) : [];
            
            const index = schedules.findIndex(s => s.id === schedule.id);
            if (index >= 0) {
                schedules[index] = schedule; 
            } else {
                schedules.push(schedule); 
            }
            
            localStorage.setItem('schedules', JSON.stringify(schedules));
            return;
        }

        if (STORAGE_MODE === 'supabase' && supabase) {
            const { error } = await supabase
                .from('schedules')
                .upsert(schedule);
                
            if (error) {
                console.error("Error saving to Supabase:", error);
                throw error;
            }
            return;
        }

        if (STORAGE_MODE === 'firebase' && db) {
            try {
                const { id, ...dataToSave } = schedule;
                await setDoc(doc(db, 'schedules', id), dataToSave);
            } catch (error) {
                console.error("Error saving to Firebase:", error);
                throw error;
            }
            return;
        }
    },

    async deleteSchedule(id: string): Promise<void> {
        if (STORAGE_MODE === 'local') {
            const data = localStorage.getItem('schedules');
            if (!data) return;
            let schedules: Schedule[] = JSON.parse(data);
            schedules = schedules.filter(s => s.id !== id);
            localStorage.setItem('schedules', JSON.stringify(schedules));
            return;
        }

        if (STORAGE_MODE === 'supabase' && supabase) {
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('id', id);
                
            if (error) {
                console.error("Error deleting from Supabase:", error);
                throw error;
            }
            return;
        }

        if (STORAGE_MODE === 'firebase' && db) {
            try {
                await deleteDoc(doc(db, 'schedules', id));
            } catch (error) {
                console.error("Error deleting from Firebase:", error);
                throw error;
            }
            return;
        }
    }
};