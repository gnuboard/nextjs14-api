'use client';

import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const MOVE_INTERVAL = 200;

const FRUITS = {
  APPLE: { emoji: '🍎', score: 1 },
  ORANGE: { emoji: '🍊', score: 5 },
  WATERMELON: { emoji: '🍉', score: 10 },
  PINEAPPLE: { emoji: '🍍', score: 50 },
};

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 200, y: 200 }]);
  const [food, setFood] = useState({});
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [applesEaten, setApplesEaten] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  const lastDirectionRef = useRef('right');
  const gameLoopRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(ctx);
    if (food.x !== undefined) {
      drawFood(ctx);
    }
  }, [snake, food]);

  useEffect(() => {
    createFood();
  }, []);

  useEffect(() => {
    if (gameRunning && !gamePaused) {
      gameLoopRef.current = setTimeout(gameLoop, MOVE_INTERVAL);
    }
    return () => clearTimeout(gameLoopRef.current);
  }, [gameRunning, gamePaused, snake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 's' && !gameRunning) {
        startGame();
        e.preventDefault();
      } else if (e.key === ' ' && gameRunning) {
        pauseGame();
        e.preventDefault();
      } else if (gameRunning && !gamePaused) {
        switch (e.key) {
          case 'ArrowUp': if (direction !== 'down') setDirection('up'); break;
          case 'ArrowDown': if (direction !== 'up') setDirection('down'); break;
          case 'ArrowLeft': if (direction !== 'right') setDirection('left'); break;
          case 'ArrowRight': if (direction !== 'left') setDirection('right'); break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning, gamePaused, direction]);

  const createFood = () => {
    let fruitType = FRUITS.APPLE;
    if (applesEaten % 20 === 0 && applesEaten !== 0) {
      fruitType = FRUITS.PINEAPPLE;
    } else if (applesEaten % 10 === 0 && applesEaten !== 0) {
      fruitType = FRUITS.WATERMELON;
    } else if (applesEaten % 5 === 0 && applesEaten !== 0) {
      fruitType = FRUITS.ORANGE;
    }

    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
      type: fruitType,
    };

    setFood(newFood);
  };

  const drawSnake = (ctx) => {
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'darkgreen' : 'green';
      ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });
  };

  const drawFood = (ctx) => {
    ctx.font = `${GRID_SIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.type.emoji, food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2);
  };

  const moveSnake = () => {
    const head = { ...snake[0] };
    switch (direction) {
      case 'up': head.y -= GRID_SIZE; break;
      case 'down': head.y += GRID_SIZE; break;
      case 'left': head.x -= GRID_SIZE; break;
      case 'right': head.x += GRID_SIZE; break;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + food.type.score);
      setApplesEaten((prev) => prev + 1);
      createFood();
    } else {
      newSnake.pop();
    }

    setScore((prev) => prev + 0.012345);
    if (direction !== lastDirectionRef.current) {
      setScore((prev) => prev + 0.0054321);
      lastDirectionRef.current = direction;
    }

    setSnake(newSnake);
  };

  const checkCollision = () => {
    const head = snake[0];
    if (
      head.x < 0 || head.x >= CANVAS_SIZE ||
      head.y < 0 || head.y >= CANVAS_SIZE ||
      snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    moveSnake();
    if (checkCollision()) {
      endGame();
    }
  };

  const startGame = () => {
    if (!gameRunning) {
      setGameRunning(true);
      setGamePaused(false);
    }
  };

  const pauseGame = () => {
    if (gameRunning) {
      setGamePaused((prev) => !prev);
    }
  };

  const endGame = () => {
    alert(`게임 오버! 최종 점수: ${score.toFixed(6)}\n먹은 과일: ${applesEaten}`);
    resetGame();
  };

  const resetGame = () => {
    setSnake([{ x: 200, y: 200 }]);
    setDirection('right');
    lastDirectionRef.current = 'right';
    setScore(0);
    setApplesEaten(0);
    setGameRunning(false);
    setGamePaused(false);
    createFood();
  };

  return (
    <div className="container">
      <h1 className="title">스네이크 게임</h1>
      <div className="gameContainer">
        <div className="scoreBoard">
          <span>점수: {score.toFixed(6)}</span>
          <span>🍎: {applesEaten}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="gameCanvas"
        />
        <div>
          <button
            onClick={startGame}
            disabled={gameRunning}
            className="button"
          >
            시작(s)
          </button>
          <button
            onClick={pauseGame}
            disabled={!gameRunning}
            className="button"
          >
            {gamePaused ? '재개(space)' : '일시정지(space)'}
          </button>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        .gameContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gameCanvas {
          border: 1px solid black;
        }
        .scoreBoard {
          display: flex;
          justify-content: space-between;
          width: 400px;
          margin-top: 10px;
          margin-bottom: 10px;
          font-size: 20px;
        }
        .button {
          margin-top: 10px;
          font-size: 16px;
          padding: 5px 10px;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}