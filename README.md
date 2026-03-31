# Liturgical Schedule 📖

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?logo=vite)
![Tauri](https://img.shields.io/badge/Tauri-2-FFC131.svg?logo=tauri)

[![Buy Me A Coffee](https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=emalter&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/emalter)

A modern, lightweight, and open-source application for creating and managing schedules for liturgical services and community gatherings. 

Built with **React** and **Vite**, this project is designed to be completely **database-agnostic**. It can run as a Web application hosted on a server (connected to cloud databases like Supabase or Firebase) or as a native, offline Desktop application (powered by Tauri).

---

## ✨ Features

- **Intuitive Interface:** Clean and responsive UI built with Material-UI (MUI).
- **Modular Management:** Easily organize songs, readings, prayers, and Bible verses.
- **Multi-Database Support:** Choose exactly where to store your data (Local, Supabase, or Firebase).
- **Desktop Version:** Run the app offline directly on your PC/Mac with the standalone executable.
- **Auto-save:** Never lose your progress with the built-in debounce saving system.

---

## 🚀 Quick Start (Web / Self-Hosted)

If you want to host the application on your own server or test it in the browser, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/scaletta-opensource.git](https://github.com/your-username/scaletta-opensource.git)
cd scaletta-opensource
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Copy the example configuration file and rename it:
```bash
cp .env.example .env
```
Open the `.env` file and set your desired storage engine under `VITE_STORAGE_MODE` (`local`, `supabase`, or `firebase`). Insert your specific API keys if you chose a cloud provider.

### 4. Start the development server
```bash
npm run dev
```

---

## 🗄️ Database Configuration (Cloud)

If you configured a Cloud database in your `.env` file, you must prepare the database schema on your chosen platform.

### Option A: Supabase (Recommended)
Supabase is an open-source Firebase alternative. Create your project on [Supabase](https://supabase.com), go to the SQL Editor, and run this query:

```sql
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  date text,
  subtitle text,
  blocks jsonb,
  "updatedAt" text
);

-- Note: Disable Row Level Security (RLS) ONLY if using the app in a closed/trusted network.
-- Otherwise, properly configure RLS policies to manage protected access.
alter table public.schedules disable row level security;
```

### Option B: Firebase
Create a project on the [Firebase Console](https://console.firebase.google.com/), enable **Firestore Database**, and ensure you update the Security Rules according to your access requirements.

---

## 💻 Desktop Version (Offline)

The project includes a native engine based on **Tauri** that converts the Web app into a lightweight executable for Windows, macOS, or Linux. The Desktop version automatically forces data to be saved locally on your hard drive, bypassing any cloud configurations.

### Prerequisites
You must have **Rust** installed on your system. Check the [Official Rust Documentation](https://www.rust-lang.org/tools/install) for instructions.

### Run in Development
To open the application in its native desktop window:
```bash
npm run tauri dev
```

### Build Executable
To generate the final standalone installation file (e.g., `.exe`, `.dmg`, or `.AppImage`) for distribution:
```bash
npm run tauri build
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! 
Feel free to check the [issues page](https://github.com/your-username/scaletta-opensource/issues) if you want to contribute to the code.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the **MIT** License. You are free to use, modify, and distribute it, both for personal and commercial purposes. See the `LICENSE` file for full details.