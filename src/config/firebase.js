// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAwQhE9GyUssLXZlZTf2zxfOndZwy54pxI',
	authDomain: 'solarladder-assignment.firebaseapp.com',
	projectId: 'solarladder-assignment',
	databaseURL:
		'https://solarladder-assignment-default-rtdb.asia-southeast1.firebasedatabase.app/',
	storageBucket: 'solarladder-assignment.firebasestorage.app',
	messagingSenderId: '106362729419',
	appId: '1:106362729419:web:72c57b3ba429fbbddefc4e',
	measurementId: 'G-SLYBXKX4KF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
