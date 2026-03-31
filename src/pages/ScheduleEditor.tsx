import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, CircularProgress, Chip, IconButton } from '@mui/material';
import { Document, Page, Text, View, PDFDownloadLink } from '@react-pdf/renderer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { storageAPI } from '../utils/storage';

import ScheduleList from '../components/ScheduleList';
import type { Block } from '../types';
import { generateDefaultSchedule } from '../utils/constants';
import './ScheduleEditor.css';

const ScheduleDocument = ({ blocks, title, date }: { blocks: Block[]; title: string; date?: string }) => {
    const totalBlocks = blocks.length;

    const titleFontSize = totalBlocks <= 4 ? 24 : totalBlocks <= 8 ? 22 : totalBlocks <= 12 ? 20 : totalBlocks <= 18 ? 18 : 16;
    const baseFontSizeStage = totalBlocks <= 4 ? 14 : totalBlocks <= 8 ? 13 : totalBlocks <= 12 ? 12 : totalBlocks <= 18 ? 11 : 10;

    const hasLongDetails = blocks.some(b => (b.details || '').length > 120);
    const detailReducer = hasLongDetails ? 2 : 0;

    const totalContentLength = blocks.reduce((sum, b) => {
        const versesLength = b.verseReferences?.reduce((s, v) => s + `${v.book}${v.chapter}${v.verses}`.length, 0) ?? 0;
        const readersLength = b.readers?.reduce((s, r) => s + `${r.languageLabel}${r.name}`.length, 0) ?? 0;
        return sum + (b.title?.length ?? 0) + (b.details?.length ?? 0) + versesLength + readersLength;
    }, 0);

    const contentReducer = Math.min(4, Math.floor(totalContentLength / 1200));

    const baseFontSize = Math.min(14, Math.max(7, baseFontSizeStage - detailReducer - contentReducer));
    const spacing = totalBlocks <= 8 ? 14 : totalBlocks <= 12 ? 10 : totalBlocks <= 18 ? 8 : 6;
    const typeFontSize = Math.max(7, baseFontSize - 3);
    const verseFontSize = Math.max(7, baseFontSize - 1);

    const availableHeightPoints = 780;
    const blockHeight = Math.max(22, Math.floor(availableHeightPoints / Math.max(1, totalBlocks)));


    const formatDate = (isoDate?: string) => {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-');
        return d && m && y ? `${d}/${m}/${y}` : isoDate;
    };

    const headerTitle = `${title || 'Schedule'}${date ? ` ${formatDate(date)}` : ''}`;

    return (
        <Document>
            <Page
                size="A4"
                wrap
                style={{ padding: 10, fontFamily: 'Times-Roman', backgroundColor: '#ffffff', minHeight: '29.7cm', width: '21cm' }}
            >
                <Text
                    style={{
                        fontSize: titleFontSize,
                        fontFamily: 'Times-Bold',
                        textAlign: 'center',
                        marginBottom: 10,
                        borderBottomWidth: 1,
                        paddingBottom: 6,
                    }}
                >
                    {headerTitle}
                </Text>

                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                    {blocks.map((block) => {
                        const isCanto = block.type === 'song';
                        const isVersetto = block.type === 'verse';
                        const blockTitle = block.title || (isCanto ? 'Song' : isVersetto ? 'Bible Reading' : 'Event');
                        const blockDetails = block.details || '';

                        const verseRefs = block.verseReferences?.map(v => `${v.book} ${v.chapter}:${v.verses}`) ?? [];
                        const readers = block.readers?.map(r => `${r.languageLabel} ${r.name}`) ?? [];

                        return (
                            <View
                                key={block.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    paddingBottom: spacing / 2,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#eeeeee',
                                    minHeight: blockHeight,
                                    flexShrink: 0,
                                }}
                            >
                                <View style={{ width: '15%', minWidth: 50, marginRight: 8 }}>
                                    <Text style={{ fontSize: typeFontSize, color: '#666666', fontFamily: isCanto ? 'Times-Italic' : 'Times-Roman' }}>
                                        {block.time || ''}
                                    </Text>
                                </View>

                                <View style={{ width: '30%', minWidth: 120, marginRight: 8 }}>
                                    <Text style={{ fontSize: baseFontSize, color: '#000000', fontFamily: isCanto ? 'Times-Italic' : 'Times-Bold' }}>
                                        {blockTitle}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    {blockDetails ? (
                                        <Text style={{ fontSize: verseFontSize, color: '#333333', marginBottom: 2, fontFamily: isCanto ? 'Times-Italic' : 'Times-Roman' }}>
                                            {blockDetails}
                                        </Text>
                                    ) : null}

                                    {isVersetto && verseRefs.length > 0 && (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: readers.length > 0 ? 2 : 0 }}>
                                            {verseRefs.map((ref, index) => (
                                                <Text key={`v-${index}`} style={{ fontSize: verseFontSize - 2, color: '#333333', marginRight: 8, fontFamily: isCanto ? 'Times-Italic' : 'Times-Roman' }}>
                                                    {ref}
                                                </Text>
                                            ))}
                                        </View>
                                    )}

                                    {isVersetto && readers.length > 0 && (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                                            {readers.map((reader, index) => (
                                                <Text key={`r-${index}`} style={{ fontSize: verseFontSize - 2, color: '#333333', marginRight: 8, fontFamily: isCanto ? 'Times-Italic' : 'Times-Roman' }}>
                                                    {reader}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                <Text style={{ fontSize: 9, textAlign: 'center', marginTop: 10, color: '#666666' }}>
                    Generated on {new Date().toLocaleDateString('en-US')}
                </Text>
            </Page>
        </Document>
    );
};


export default function ScheduleEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const templateType = queryParams.get('template');

    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleSubtitle, setScheduleSubtitle] = useState('');
    const [blocks, setBlocks] = useState<Block[]>([]);

    const [loading, setLoading] = useState(true);

    // Autosave state
    const [isReadyForAutosave, setIsReadyForAutosave] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'modified' | 'saving' | 'error'>('saved');

    // 1. FIRST LOAD
    useEffect(() => {
        const loadData = async () => {
            if (id === 'new') {
                if (templateType === 'empty') {
                    setBlocks([]);
                } else {
                    setBlocks(generateDefaultSchedule());
                }
                setLoading(false);
                setTimeout(() => setIsReadyForAutosave(true), 500);
                return;
            }

            if (id) {
                try {
                    const data = await storageAPI.getSchedule(id);

                    if (data) {
                        setScheduleDate(data.date as string || '');
                        setScheduleSubtitle(data.subtitle || '');
                        setBlocks(data.blocks || []);
                    } else {
                        alert("Schedule not found in local database!");
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Error loading schedule:", error);
                } finally {
                    setLoading(false);
                    setTimeout(() => setIsReadyForAutosave(true), 500);
                }
            }
        };

        loadData();
    }, [id, templateType, navigate]);

    // 2. AUTOSAVE WITH DEBOUNCE
    useEffect(() => {
        if (!isReadyForAutosave) return;

        setSaveStatus('modified');

        // Debounce: save only if user stopped typing for 1.5 seconds
        const delayDebounceFn = setTimeout(async () => {
            setSaveStatus('saving');

            try {
                const scheduleId = id === 'new' ? crypto.randomUUID() : id!;

                await storageAPI.saveSchedule({
                    id: scheduleId,
                    date: scheduleDate,
                    subtitle: scheduleSubtitle,
                    blocks: blocks,
                    updatedAt: new Date().toISOString()
                });

                setSaveStatus('saved');

                // If it was a new schedule, replace URL for following saves
                if (id === 'new') {
                    navigate(`/editor/${scheduleId}`, { replace: true });
                }

            } catch (error) {
                console.error("Error during autosave:", error);
                setSaveStatus('error');
            }
        }, 1500);

        // Cleanup: if user types again before 1.5s, reset the timer
        return () => clearTimeout(delayDebounceFn);

    }, [blocks, scheduleDate, scheduleSubtitle, isReadyForAutosave, id, navigate]);

    // 3. STATUS INDICATOR
    const getStatusIndicator = () => {
        switch (saveStatus) {
            case 'saving': return <Chip icon={<CircularProgress size={16} />} label="Saving..." color="warning" size="small" variant="outlined" />;
            case 'modified': return <Chip label="Unsaved changes" color="default" size="small" variant="outlined" sx={{ fontStyle: 'italic' }} />;
            case 'error': return <Chip icon={<ErrorOutlineIcon />} label="Network error" color="error" size="small" variant="outlined" />;
            case 'saved': default: return <Chip icon={<CloudDoneIcon />} label="Saved" color="success" size="small" variant="outlined" />;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" className="schedule-editor-container">

            <Box className="schedule-editor-toolbar">

                <Box className="schedule-editor-meta">
                    <Box className="schedule-editor-title-row">
                        <IconButton onClick={() => navigate('/')} color="primary" sx={{ bgcolor: 'grey.200' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Schedule</Typography>
                        <TextField
                            type="date"
                            variant="standard"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="schedule-editor-date-input"
                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                    </Box>

                    <Box sx={{ mt: 1, mb: 1 }}>
                        <TextField
                            variant="standard"
                            fullWidth
                            label="Subtitle (optional)"
                            value={scheduleSubtitle}
                            onChange={(e) => setScheduleSubtitle(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ disableUnderline: true }}
                            sx={{ fontStyle: 'italic' }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box>
                        {getStatusIndicator()}
                    </Box>

                    <PDFDownloadLink
                        document={<ScheduleDocument blocks={blocks} title="Schedule" date={scheduleDate} />}
                        fileName={`Schedule_${scheduleDate || new Date().toISOString().slice(0, 10)}.pdf`}
                        style={{ textDecoration: 'none' }}
                    >
                        {({ loading }) => (
                            <Button variant="contained" disabled={loading} sx={{ mb: { xs: 1, sm: 0 } }}>
                                {loading ? 'Generating...' : 'Download PDF (Native)'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </Box>
            </Box>

            <ScheduleList blocks={blocks} setBlocks={setBlocks} />

        </Container>
    );
}
