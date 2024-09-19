const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (no need for useNewUrlParser and useUnifiedTopology)
mongoose
	.connect("mongodb://localhost:27017/snakeGame")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB...", err));

// Player and score model
const playerSchema = new mongoose.Schema({
	playerName: String,
	score: Number,
});

const Player = mongoose.model("Player", playerSchema);

// Route to get all high scores
app.get("/api/getHighScores", async (req, res) => {
	const players = await Player.find().sort({ score: -1 }).limit(5);
	res.json(players);
});

// Route to update a player's score
app.post("/api/updateHighScores", async (req, res) => {
	const { playerName, score } = req.body;
	let player = await Player.findOne({ playerName });
	if (!player) {
		player = new Player({ playerName, score });
	} else if (score > player.score) {
		player.score = score;
	}
	await player.save();
	res.sendStatus(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
