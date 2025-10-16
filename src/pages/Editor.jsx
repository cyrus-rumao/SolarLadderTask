// src/pages/Editor.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';
import CanvasBoard from '../components/CanvasBoard';

const Editor = () => {
	const { id } = useParams();
	//   console.log(id)
	const navigate = useNavigate();
	const [canvasData, setCanvasData] = useState(null);

	useEffect(() => {
		const canvasRef = ref(db, `canvas/${id}`);
		onValue(canvasRef, (snapshot) => {
			const data = snapshot.val();
			if (data) setCanvasData(data);
		});
	}, [id]);

	const handleSave = (jsonData) => {
		set(ref(db, `canvas/${id}/json`), jsonData);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex items-center justify-between bg-gray-900 text-white p-4">
				<h1 className="text-lg font-semibold">
					{canvasData?.name || 'Untitled Canvas'}
				</h1>
				<button
					onClick={() => navigate('/')}
					className="bg-blue-500 px-3 py-1 rounded-md">
					⬅️ Back to Home
				</button>
			</div>

			<CanvasBoard
				savedData={canvasData?.json}
				canvasId={id}
				onSave={handleSave}
			/>
		</div>
	);
};

export default Editor;
