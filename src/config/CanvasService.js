import { db } from './firebase';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';

// Create new canvas doc
export async function createCanvasDoc() {
	const docRef = await addDoc(collection(db, 'canvas'), {
		data: null,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});
	return docRef.id;
}

// Save JSON data to Firestore
export async function saveCanvas(id, jsonData) {
	const docRef = doc(db, 'canvas', id);
	await setDoc(
		docRef,
		{
			data: jsonData, // ✅ save JSON object directly
			updatedAt: new Date().toISOString(),
		},
		{ merge: true }
	);
	alert('Canvas saved successfully!');
}

// Load JSON data from Firestore
export async function loadCanvas(id) {
	const docRef = doc(db, 'canvas', id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data().data; // ✅ returns JSON
	} else {
		console.warn('No canvas found');
		return null;
	}
}
