import React, { useEffect, useRef, useState, useCallback } from "react";
import "./GameBoard.css";

const unitSize = 25;
const gameWidth = 500;
const gameHeight = 500;
const snakeSpeed = 100; // Adjust the speed as needed

function GameBoard({ onGameOver }) {
	const [playerName, setPlayerName] = useState("");
	const [running, setRunning] = useState(false);
	const [score, setScore] = useState(0);
	const [snake, setSnake] = useState([{ x: unitSize, y: 0 }]);
	const [food, setFood] = useState({ x: 0, y: 0 });
	const [xVelocity, setXVelocity] = useState(unitSize);
	const [yVelocity, setYVelocity] = useState(0);
	const [lastTime, setLastTime] = useState(0); // Track last update time
	const [gameOver, setGameOver] = useState(false); // Add gameOver state
	const canvasRef = useRef(null);

	// Function to get a random coordinate that is not on the snake's body
	const getRandomCoordinate = useCallback((snake) => {
		let x, y;
		const snakeSet = new Set(snake.map((part) => `${part.x},${part.y}`));
		do {
			x =
				Math.floor((Math.random() * (gameWidth - unitSize)) / unitSize) *
				unitSize;
			y =
				Math.floor((Math.random() * (gameHeight - unitSize)) / unitSize) *
				unitSize;
		} while (snakeSet.has(`${x},${y}`)); // Ensure food is not on the snake

		return { x, y };
	}, []);

	const clearBoard = useCallback((ctx) => {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, gameWidth, gameHeight);
	}, []);

	const drawFood = useCallback(
		(ctx) => {
			ctx.fillStyle = "red";
			ctx.fillRect(food.x, food.y, unitSize, unitSize);
		},
		[food]
	);

	const moveSnake = useCallback(
		(ctx) => {
			const newSnake = [...snake];
			const head = {
				x: newSnake[0].x + xVelocity,
				y: newSnake[0].y + yVelocity,
			};
			newSnake.unshift(head);

			if (head.x === food.x && head.y === food.y) {
				setScore((prevScore) => prevScore + 1);
				setFood(getRandomCoordinate(newSnake)); // Set new food position
			} else {
				newSnake.pop();
			}

			setSnake(newSnake);
		},
		[food, snake, xVelocity, yVelocity, getRandomCoordinate]
	);

	const drawSnake = useCallback(
		(ctx) => {
			ctx.fillStyle = `#00ff00`;
			ctx.strokeStyle = "black";
			snake.forEach((part) => {
				ctx.fillRect(part.x, part.y, unitSize, unitSize);
				ctx.strokeRect(part.x, part.y, unitSize, unitSize);
			});
		},
		[snake]
	);

	const drawGameOver = useCallback((ctx) => {
		ctx.fillStyle = "white";
		ctx.font = "32px 'Press Start 2P'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Game Over", gameWidth / 2, gameHeight / 2);
	}, []);

	const checkGameOver = useCallback(() => {
		const head = snake[0];
		if (
			head.x < 0 ||
			head.x >= gameWidth ||
			head.y < 0 ||
			head.y >= gameHeight ||
			snake.slice(1).some((part) => part.x === head.x && part.y === head.y) // Snake collision with itself
		) {
			setRunning(false);
			setGameOver(true); // Set gameOver to true
			onGameOver(score, playerName); // Pass playerName here
		}
	}, [snake, score, onGameOver, playerName]);

	const handleKeyDown = useCallback(
		(event) => {
			switch (event.key) {
				case "ArrowUp":
					if (yVelocity === 0) {
						setXVelocity(0);
						setYVelocity(-unitSize);
					}
					break;
				case "ArrowDown":
					if (yVelocity === 0) {
						setXVelocity(0);
						setYVelocity(unitSize);
					}
					break;
				case "ArrowLeft":
					if (xVelocity === 0) {
						setXVelocity(-unitSize);
						setYVelocity(0);
					}
					break;
				case "ArrowRight":
					if (xVelocity === 0) {
						setXVelocity(unitSize);
						setYVelocity(0);
					}
					break;
				default:
					break;
			}
		},
		[xVelocity, yVelocity]
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		const gameLoop = (currentTime) => {
			if (running) {
				if (currentTime - lastTime >= snakeSpeed) {
					clearBoard(ctx);
					drawFood(ctx);
					moveSnake(ctx);
					drawSnake(ctx);
					checkGameOver();
					setLastTime(currentTime); // Update lastTime
				}
				animationFrameId = requestAnimationFrame(gameLoop);
			} else {
				if (gameOver) {
					drawGameOver(ctx); // Draw "Game Over" message if game is over
				}
				cancelAnimationFrame(animationFrameId);
			}
		};

		animationFrameId = requestAnimationFrame(gameLoop);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [
		running,
		clearBoard,
		drawFood,
		moveSnake,
		drawSnake,
		checkGameOver,
		drawGameOver,
		lastTime,
		gameOver,
	]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const startGame = () => {
		if (!playerName.trim()) {
			alert("Please enter your player name to start the game.");
			return;
		}
		setRunning(true);
		setGameOver(false); // Reset gameOver when starting a new game
		setScore(0);
		setSnake([{ x: unitSize, y: 0 }]);
		setFood(getRandomCoordinate([])); // Set initial food position
		setXVelocity(unitSize);
		setYVelocity(0);
		setLastTime(0); // Reset lastTime when starting the game
	};

	return (
		<div className="game-container">
			<canvas ref={canvasRef} width={gameWidth} height={gameHeight} />
			<div className="game-info">
				<p>Score: {score}</p>
				<input
					type="text"
					placeholder="Enter your name"
					value={playerName}
					onChange={(e) => setPlayerName(e.target.value)}
				/>
				<button onClick={startGame}>Start Game</button>
			</div>
		</div>
	);
}

export default GameBoard;
