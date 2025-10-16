// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, push, set } from "firebase/database";

const Home = () => {
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState([]);

  useEffect(() => {
    const canvasesRef = ref(db, "canvas");
    onValue(canvasesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      setCanvases(list);
    });
    console.log(canvases)
  }, []);

  const createNewCanvas = async () => {
    const newCanvasRef = push(ref(db, "canvas"));
    await set(newCanvasRef, {
      name: `Canvas ${new Date().toLocaleString()}`,
      json: "{}",
      createdAt: Date.now(),
    });
    navigate(`/canvas/${newCanvasRef.key}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">🎨 My Canvases</h1>

      <button
        onClick={createNewCanvas}
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ➕ Create New Canvas
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {canvases.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/canvas/${c.id}`)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
