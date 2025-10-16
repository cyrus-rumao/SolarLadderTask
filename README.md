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

---

## Key Implementation Details

### `CanvasBoard.jsx`

This component contains the core logic for the canvas.

#### 1\. Object Boundary Constraint

Object movement and scaling are restricted to the visible canvas area using event listeners for consistency:

```javascript
canvas.on('object:moving', limitObjectBounds);
canvas.on('object:scaling', limitObjectBounds);
```

#### 2\. Text Cursor and Drag Fix

To ensure the mouse cursor resets from the I-beam and the drag operation doesn't stick after editing text, a global `mouse:down` listener is used:

```javascript
// Forces IText out of editing mode and resets the cursor on any click
canvas.on('mouse:down', handleCanvasMouseDown);
```

#### 3\. Keyboard Deletion

Selected items can be deleted using the keyboard via a global listener on the window:

```javascript
window.addEventListener('keydown', handleWindowKeyDown); // Checks for 'Delete' or 'Backspace'
```

#### 4\. Firebase Data Cleaning

To avoid Firebase validation errors (`value argument contains undefined`), the JSON object is recursively cleaned before every save operation:

```javascript
const cleanedJson = cleanUndefined(json);
set(ref(db, ...), cleanedJson)
```
