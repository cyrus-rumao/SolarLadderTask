````markdown
# ✍️ Canvas Board

This is a **real-time, collaborative whiteboard application** built using **React**, **Fabric.js**, and **Firebase Realtime Database**. It allows multiple users to draw and interact on the same canvas simultaneously.

---

## ✨ Features

- **Real-time Synchronization:** Canvas state is synchronized instantly across all connected users via Firebase Realtime Database.
- **Drawing & Shapes:** Supports various tools including **Pen drawing**, **Rectangles**, **Circles**, and **editable Text** (`IText`).
- **Data Integrity:** Includes logic to clean Fabric.js JSON output by removing problematic `undefined` values, ensuring stable synchronization with Firebase.
- **Export:** Allows the final canvas content to be easily exported as a **PNG image**.

---

## 🛠 Technology Stack

- **Frontend:** React
- **Canvas Library:** Fabric.js
- **Database:** Firebase Realtime Database

---

## 🚀 Setup and Installation

### Prerequisites

1.  **Node.js** and **npm/yarn** installed.
2.  A **Firebase Project** with **Realtime Database** enabled.

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd canvas-board
```
````

### Step 2: Install Dependencies

Install the necessary project dependencies:

```bash
npm install fabric firebase react
# or
yarn add fabric firebase react
```

### Step 3: Configure Environment Variables

For connecting to your Firebase project, you must set up environment variables.

1.  **Create a file** named **`.env.local`** in the root directory of the project (e.g., alongside `package.json`).
2.  **Paste your Firebase configuration** details into this file, matching the `import.meta.env` variables used in your code.

**Your `.env.local` file should look like this:**

```text
# Replace the placeholder values with your actual Firebase configuration
VITE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_DATABASE_URL="YOUR_FIREBASE_DATABASE_URL"
VITE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_APP_ID="YOUR_FIREBASE_APP_ID"
VITE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
```

> ⚠️ **Note:** In frameworks like **Vite** (which uses `import.meta.env`), environment variables must be prefixed with **`VITE_`** to be exposed to the public frontend code. The `.env.local` file is automatically ignored by Git if you use a standard `.gitignore` file, helping to keep your secrets private.

### Step 4: Run the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application should now be running locally and connected to your Firebase Realtime Database for real-time synchronization\!

```
---

### Summary of `.env.local` Instructions

The key is for the user to:
1.  **Create** a file named **`.env.local`** in the root directory.
2.  **Populate** it with the **Firebase config keys**, ensuring they are all prefixed with **`VITE_`** to be accessible in a modern React setup (like one using Vite, which is implied by `import.meta.env`). This file contains the sensitive connection details, which is why it's typically named with `.local` and is ignored by Git by default.
```

Demo Video: https://drive.google.com/file/d/1A1NKztuI8pDSyyLN8vSWNEz4St_iE3MU/view?usp=sharing
