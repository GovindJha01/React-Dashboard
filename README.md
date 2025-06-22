# 🧠 News & Blog Dashboard

A responsive admin dashboard built with **React + Vite**, powered by **Firebase Auth**, **Guardian News API**, and **Material UI**. This app provides Google & email login, article filtering/search, payout tracking, CSV/PDF export, and mobile responsiveness.

---

## 🚀 Features

### 🔐 Authentication
- Email/password login
- Firebase Auth integration
- Admin user (`admin@gmail.com`) has elevated access (can edit payout rates)

### 📰 Article Integration
- Fetched from **Guardian Open Platform**
- Combines both `news` and `commentisfree` (blogs)
- Displays title, author, publication date, type

### 🔎 Filtering & Search
- Filter articles by:
  - Author
  - Type (News / Blog)
  - Date range (From / To)
- Keyword search bar
- Responsive, compact UI with MUI inputs

### 📊 Dashboard + Analytics
- Responsive cards for total articles, users, etc.
- Chart analytics using `recharts`
- Payout calculation for each author

### 💰 Payout System (Admin-only)
- Editable payout rates for News & Blog
- Article count per author
- Export to:
  - CSV (using `papaparse`)
  - PDF (using `jsPDF` + `autoTable`)

### 🧭 Sidebar Navigation
- Responsive Material UI `Drawer`
- Route-based navigation
  

### 🌗 Responsive Design
- Fully mobile and desktop friendly
- Conditional layout using MUI breakpoints

---

## 📦 Tech Stack

- ⚛️ **React** + **Vite**
- 🔐 **Firebase Auth**
- 📡 **Guardian News API**
- 💄 **Material UI**
- 📊 **Recharts**, `jsPDF`, `papaparse`
- 📁 **React Router**, `useContext`

---

## 🔑 Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GUARDIAN_API_KEY=your_guardian_api_key
```

##🧪 Run Locally
```
cd client
npm install
npm run dev
```

