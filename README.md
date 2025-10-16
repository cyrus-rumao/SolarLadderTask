## Canvas Board README

This is a real-time, collaborative whiteboard application built using **React**, **Fabric.js**, and **Firebase Realtime Database**.

---

## Features

- **Real-time Synchronization:** Canvas state is synchronized across multiple users via Firebase.
- **Drawing & Shapes:** Supports Pen drawing, Rectangles, Circles, and editable Text (`IText`).
- **Boundary Enforcement:** Objects cannot be moved, dragged, or scaled outside the visible bounds of the canvas.
- **Object Control:** Delete selected objects using the "Delete" or "Backspace" key, or the on-screen button.
- **IText Stability:** Includes fixes for persistent cursor/drag issues associated with `IText` objects in Fabric.js.
- **Data Integrity:** Cleans Fabric.js JSON output to remove `undefined` values, preventing Firebase Realtime Database errors.
- **Export:** Allows the canvas content to be exported as a PNG image.

---

## Technology Stack

- **Frontend:** React
- **Canvas Library:** Fabric.js
- **Database:** Firebase Realtime Database

---

## Setup and Installation

### Prerequisites

1.  Node.js and npm/yarn.
2.  A Firebase Project with the Realtime Database enabled.

### Steps

1.  Install project dependencies:
    ```bash
    npm install fabric firebase react
    ```
2.  Configure your **Firebase credentials** (usually in a `config/firebase.js` file and/or `.env` variables).
3.  Run the application:
    ```bash
    npm start
    ```
