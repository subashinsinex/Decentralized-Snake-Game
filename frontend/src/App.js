import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./components/GameBoard";
import HighScores from "./components/HighScores";

const serverUrl = "http://localhost:3001";

function App() {
	const [highScores, setHighScores] = useState([]);

	// Fetch high scores from the backend on load
	useEffect(() => {
		fetchHighScores();
	}, []);

	const fetchHighScores = async () => {
		try {
			const res = await axios.get(`${serverUrl}/api/getHighScores`);
			setHighScores(res.data);
		} catch (error) {
			console.error("Error fetching high scores:", error);
		}
	};

	const handleGameOver = async (score, playerName) => {
		try {
			await axios.post(`${serverUrl}/api/updateHighScores`, {
				playerName, // Include playerName here
				score,
			});
			fetchHighScores();
		} catch (error) {
			console.error("Error updating high score:", error);
		}
	};

	return (
		<div className="App">
			<h1>Snake Game</h1>
			<div className="layout-container">
				{/* Center */}
				<div className="center">
					<GameBoard onGameOver={handleGameOver} />
				</div>

				{/* Right Side */}
				<div className="right-side">
					<HighScores highScores={highScores} />
				</div>
			</div>
		</div>
	);
}

export default App;
