import React from "react";
import "./GameBoard.css";

function HighScores({ highScores }) {
	return (
		<div>
			<h2>Top Scores</h2>
			<ol>
				{highScores.map((player, index) => (
					<li key={index}>
						{player.playerName}: {player.score}
					</li>
				))}
			</ol>
		</div>
	);
}

export default HighScores;
