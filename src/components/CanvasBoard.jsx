import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { db } from '../config/firebase';
import { ref, set, onValue } from 'firebase/database';

const cleanUndefined = (obj) => {
	if (Array.isArray(obj)) {
		// Handle arrays
		return obj.map(cleanUndefined).filter((item) => item !== undefined);
	}
	if (typeof obj === 'object' && obj !== null) {
		// Handle objects
		const cleaned = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];
				// Recursively clean the value
				const cleanedValue = cleanUndefined(value);
				// Only keep the property if the cleaned value is not undefined
				if (cleanedValue !== undefined) {
					cleaned[key] = cleanedValue;
				}
			}
		}
		return cleaned;
	}
	// Return primitives directly, unless it is undefined
	return obj !== undefined ? obj : undefined;
};

const CanvasBoard = ({ canvasId }) => {
	const canvasRef = useRef(null);
	const [canvas, setCanvas] = useState(null);
	const [tool, setTool] = useState('select');
	const [color, setColor] = useState('#000000');
	const [textValue, setTextValue] = useState('');

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

	// Load data from Firebase and fix path properties
	useEffect(() => {
		if (!canvas || !canvasId) return;
		const canvasRefDb = ref(db, `canvas/${canvasId}/json`);
		onValue(
			canvasRefDb,
			(snapshot) => {
				console.log('Snapshot', snapshot.val());
				const data = snapshot.val();
				if (data) {
					canvas.loadFromJSON(data, () => {
						// Iterate through all objects
						canvas.getObjects().forEach((obj) => {
							if (obj.type === 'path') {
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

	useEffect(() => {
		if (!canvas || !canvasId) return;

		const saveToFirebase = () => {
			if (!canvas || !canvasId) return;
			canvas.renderAll();

			const json = canvas.toJSON(['selectable', 'stroke']);
			const cleanedJson = cleanUndefined(json);

			set(ref(db, `canvas/${canvasId}/json`), cleanedJson)
				.then(() => console.log('Canvas auto-saved'))
				.catch((err) => console.error('Firebase save error:', err));
		};

		canvas.on('object:added', saveToFirebase);
		canvas.on('object:modified', saveToFirebase);
		canvas.on('object:removed', saveToFirebase);

		return () => {
			canvas.off('object:added', saveToFirebase);
			canvas.off('object:modified', saveToFirebase);
			canvas.off('object:removed', saveToFirebase);
		};
	}, [canvas, canvasId]);

	useEffect(() => {
		if (!canvas) return;
		canvas.isDrawingMode = tool === 'pen';
		if (tool === 'pen') {
			canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
			canvas.freeDrawingBrush.color = color;
			canvas.freeDrawingBrush.width = 3;
		}
	}, [tool, color, canvas]);

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

	const addText = (textValue) => {
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
		// text.exitEditing();
		canvas.renderAll();
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

	const saveCanvasManually = () => {
		if (!canvas || !canvasId) return alert('Canvas or canvasId missing');
		canvas.discardActiveObject();
		canvas.renderAll();

		const json = canvas.toJSON(['selectable', 'stroke']);
		const cleanedJson = cleanUndefined(json);

		set(ref(db, `canvas/${canvasId}/json`), cleanedJson)
			.then(() => alert('Canvas manually saved!'))
			.catch((err) => console.error('Firebase save error:', err));
	};

	return (
		<div className="flex flex-col items-center gap-4 p-6">
			<div className="flex flex-wrap gap-3 justify-center mb-4">
				<button
					onClick={() => setTool('select')}
					className={`px-4 py-2 rounded-md ${
						tool === 'select' ? 'bg-gray-600 text-white' : 'bg-gray-200'
					}`}>
					Select / Move
				</button>
				<button
					onClick={() => setTool('pen')}
					className={`px-4 py-2 rounded-md ${
						tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'
					}`}>
					Pen
				</button>
				<button
					onClick={addRect}
					className="px-4 py-2 bg-green-500 text-white rounded-md">
					Rectangle
				</button>
				<button
					onClick={addCircle}
					className="px-4 py-2 bg-blue-500 text-white rounded-md">
					Circle
				</button>
				<button
					onClick={addText}
					className="px-4 py-2 bg-yellow-500 text-white rounded-md">
					Text
				</button>
				<button
					onClick={deleteSelected}
					className="px-4 py-2 bg-red-500 text-white rounded-md">
					Delete
				</button>
				<button
					onClick={changeColor}
					className="px-4 py-2 bg-purple-500 text-white rounded-md">
					Apply Color
				</button>
				<button
					onClick={saveCanvasManually}
					className="px-4 py-2 bg-green-700 text-white rounded-md">
					Save Canvas
				</button>
				<button
					onClick={exportPNG}
					className="px-4 py-2 bg-pink-500 text-white rounded-md">
					Export PNG
				</button>
				<button
					onClick={clearCanvas}
					className="px-4 py-2 bg-gray-500 text-white rounded-md">
					Clear
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
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							addText(textValue);
							setTextValue('');
						}
					}}
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
