// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor.jsx';

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/canvas/:id"
					element={<Editor />}
				/>
				<Route
					path="*"
					element={<h1>404 Not Found</h1>}
				/>
			</Routes>
		</Router>
	);
}

export default App;
