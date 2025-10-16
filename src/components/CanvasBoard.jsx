import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { db } from '../config/firebase';
import { ref, set, onValue } from 'firebase/database';

const CanvasBoard = ({ canvasId }) => {
	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [tool, setTool] = useState('select');
	const [color, setColor] = useState('#000000');
	const [textValue, setTextValue] = useState('Enter text');

	// Initialize canvas
	useEffect(() => {
		console.log(canvasId);
		const c = new fabric.Canvas(canvasRef.current, {
			backgroundColor: '#f8fafc',
			selection: true,
		});
		c.setDimensions({
			width: window.innerWidth - 100,
			height: window.innerHeight - 150,
		});

		setCanvas(c);

		const handleResize = () => {
			c.setDimensions({
				width: window.innerWidth - 100,
				height: window.innerHeight - 150,
			});
			c.renderAll();
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			c.dispose();
		};
	}, []);

	// 🔴 FIX #3: Load data from Firebase and fix path properties
	useEffect(() => {
		if (!canvas || !canvasId) return;
		const canvasRefDb = ref(db, `canvas/${canvasId}/json`);
		onValue(
			canvasRefDb,
			(snapshot) => {
				const data = snapshot.val();
				if (data) {
					canvas.loadFromJSON(data, () => {
						// Iterate through all objects and apply fixes
						canvas.getObjects().forEach((obj) => {
							if (obj.type === 'path') {
								// CRITICAL LOAD FIX: Force fill to transparent to prevent blob
								// Also ensure 'paintFirst' is set to 'stroke' for correct rendering
								obj.set({
									fill: 'transparent',
									paintFirst: 'stroke',
								});
							}
						});
						canvas.renderAll();
					});
				}
			},
			{ onlyOnce: true }
		);
	}, [canvas, canvasId]);

	// 🔴 FIX #1 & #2: Auto-save on any change, including pen strokes, and fix path on creation
	useEffect(() => {
		if (!canvas || !canvasId) return;

		const saveToFirebase = () => {
			if (!canvas || !canvasId) return;
			canvas.renderAll();
			// 🔴 CRITICAL SAVE FIX: Include 'stroke' property in serialization for paths to retain color
			const json = canvas.toJSON(['selectable', 'stroke']);
			set(ref(db, `canvas/${canvasId}/json`), json)
				.then(() => console.log('Canvas auto-saved'))
				.catch((err) => console.error('Firebase save error:', err));
		};

		const handlePathCreated = (e) => {
			if (e.path) {
				// 🔴 CRITICAL CREATION FIX: Set fill to transparent on creation to prevent the solid blob.
				// This ensures correct saving from the start.
				e.path.set({ fill: 'transparent' });
			}
			saveToFirebase();
		};

		// Attach the new handler for path creation
		canvas.on('object:added', saveToFirebase);
		canvas.on('object:modified', saveToFirebase);
		canvas.on('object:removed', saveToFirebase);
		canvas.on('path:created', handlePathCreated); // Use the new handler

		return () => {
			canvas.off('object:added', saveToFirebase);
			canvas.off('object:modified', saveToFirebase);
			canvas.off('object:removed', saveToFirebase);
			canvas.off('path:created', handlePathCreated);
		};
	}, [canvas, canvasId]);

	// Tool handling (No changes needed here for the save/load fix)
	useEffect(() => {
		if (!canvas) return;
		canvas.isDrawingMode = tool === 'pen';
		if (tool === 'pen') {
			canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
			canvas.freeDrawingBrush.color = color;
			canvas.freeDrawingBrush.width = 3;
		}
	}, [tool, color, canvas]);

	// Canvas actions (No changes needed here for the save/load fix)
	const addRect = () => {
		if (!canvas) return;
		const rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: color,
			width: 120,
			height: 80,
			selectable: true,
		});
		canvas.add(rect);
		canvas.setActiveObject(rect);
	};

	const addCircle = () => {
		if (!canvas) return;
		const circle = new fabric.Circle({
			left: 150,
			top: 150,
			radius: 50,
			fill: color,
			selectable: true,
		});
		canvas.add(circle);
		canvas.setActiveObject(circle);
	};

	const addText = () => {
		if (!canvas) return;
		const text = new fabric.IText(textValue, {
			left: 200,
			top: 200,
			fontSize: 24,
			fill: color,
			editable: true,
		});
		canvas.add(text);
		canvas.setActiveObject(text);
	};

	const deleteSelected = () => {
		if (!canvas) return;
		const active = canvas.getActiveObjects();
		active.forEach((obj) => canvas.remove(obj));
		canvas.discardActiveObject();
		canvas.requestRenderAll();
	};

	const changeColor = () => {
		if (!canvas) return;
		const active = canvas.getActiveObject();
		if (active) {
			active.set('fill', color);
			// Also update stroke for path objects if selected
			if (active.type === 'path') {
				active.set('stroke', color);
			}
			canvas.requestRenderAll();
		}
	};

	const exportPNG = () => {
		if (!canvas) return;
		const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
		const a = document.createElement('a');
		a.href = dataURL;
		a.download = 'canvas.png';
		a.click();
	};

	const clearCanvas = () => {
		if (!canvas) return;
		canvas.clear();
		canvas.backgroundColor = '#f8fafc';
		canvas.renderAll();
	};

	// 🔴 FIX #2: Manual save also needs to include 'stroke'
	const saveCanvasManually = () => {
		if (!canvas || !canvasId) return alert('Canvas or canvasId missing');
		canvas.discardActiveObject();
		canvas.renderAll();
		// 🔴 CRITICAL SAVE FIX: Include 'stroke' property in serialization
		const json = canvas.toJSON(['selectable', 'stroke']);
		set(ref(db, `canvas/${canvasId}/json`), json)
			.then(() => alert('Canvas manually saved!'))
			.catch((err) => console.error('Firebase save error:', err));
	};

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			{/* Toolbar */}
			<div className="flex flex-wrap gap-3 justify-center mb-4">
				<button
					onClick={() => setTool('select')}
					className={`px-4 py-2 rounded-md ${
						tool === 'select' ? 'bg-gray-600 text-white' : 'bg-gray-200'
					}`}>
					🖱️ Select / Move
				</button>
				<button
					onClick={() => setTool('pen')}
					className={`px-4 py-2 rounded-md ${
						tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
					}`}>
					✏️ Pen
				</button>
				<button
					onClick={addRect}
					className="px-4 py-2 bg-green-500 text-white rounded-md">
					⬛ Rectangle
				</button>
				<button
					onClick={addCircle}
					className="px-4 py-2 bg-blue-500 text-white rounded-md">
					⚪ Circle
				</button>
				<button
					onClick={addText}
					className="px-4 py-2 bg-yellow-500 text-white rounded-md">
					🅰️ Text
				</button>
				<button
					onClick={deleteSelected}
					className="px-4 py-2 bg-red-500 text-white rounded-md">
					❌ Delete
				</button>
				<button
					onClick={changeColor}
					className="px-4 py-2 bg-purple-500 text-white rounded-md">
					🎨 Apply Color
				</button>
				<button
					onClick={saveCanvasManually}
					className="px-4 py-2 bg-green-700 text-white rounded-md">
					💾 Save Canvas
				</button>
				<button
					onClick={exportPNG}
					className="px-4 py-2 bg-pink-500 text-white rounded-md">
					📸 Export PNG
				</button>
				<button
					onClick={clearCanvas}
					className="px-4 py-2 bg-gray-500 text-white rounded-md">
					🗑️ Clear
				</button>
			</div>

			{/* Inputs */}
			<div className="flex items-center gap-3 mb-4">
				<input
					type="color"
					value={color}
					onChange={(e) => setColor(e.target.value)}
					className="w-10 h-10 border rounded-md cursor-pointer"
				/>
				<input
					type="text"
					value={textValue}
					onChange={(e) => setTextValue(e.target.value)}
					placeholder="Text to add"
					className="border px-3 py-2 rounded-md"
				/>
			</div>

			{/* Canvas */}
			<canvas
				ref={canvasRef}
				className="border border-gray-300 rounded-lg shadow-lg"
			/>
		</div>
	);
};

export default CanvasBoard;
