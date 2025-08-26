import { useEffect, useRef, useState } from 'react';

interface GameState {
  isPlaying: boolean;
  score: number;
  gameOver: boolean;
}

const RunningGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uiState, setUiState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    gameOver: false
  });

  // Game constants
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 50;
  const GROUND_HEIGHT = 20;
  const JUMP_FORCE = 15;
  const GRAVITY = 0.8;
  const BOOK_WIDTH = 30;
  const BOOK_HEIGHT = 40;
  const GAME_SPEED = 5;
  const SCHOOL_WIDTH = 100;
  const SCHOOL_HEIGHT = 100;
  const MIN_BOOK_SPACING = 300; // Minimum pixels between books
  const BASE_BOOK_INTERVAL = 2000; // Base milliseconds between books
  const BOOK_INTERVAL_VARIATION = 500; // Random variation in milliseconds
  const BOOK_HEIGHT_VARIATION = 20; // Random variation in book height

  // Game variables
  const gameRef = useRef({
    player: {
      x: 50,
      y: 0,
      velocityY: 0,
      isJumping: false
    },
    books: [] as { x: number; y: number; height: number }[],
    schoolPosition: { x: 800, y: 0 },
    animationFrame: 0,
    lastTimestamp: 0,
    isPlaying: false,
    score: 0,
    gameOver: false,
    lastBookTime: 0
  });

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial player position
    gameRef.current.player.y = canvas.height - PLAYER_HEIGHT - GROUND_HEIGHT;

    // Draw initial state
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#64ffda';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

    // Draw player
    ctx.fillStyle = '#e6f1ff';
    ctx.fillRect(
      gameRef.current.player.x,
      gameRef.current.player.y,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );

    // Draw school
    ctx.fillStyle = '#233554';
    ctx.fillRect(
      gameRef.current.schoolPosition.x,
      canvas.height - SCHOOL_HEIGHT - GROUND_HEIGHT,
      SCHOOL_WIDTH,
      SCHOOL_HEIGHT
    );
    
    // Draw "BYU" text
    ctx.fillStyle = '#64ffda';
    ctx.font = '20px "Fira Code"';
    ctx.fillText(
      'BYU',
      gameRef.current.schoolPosition.x + SCHOOL_WIDTH/2 - 20,
      canvas.height - SCHOOL_HEIGHT - GROUND_HEIGHT + 30
    );
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameRef.current.player.isJumping) {
      gameRef.current.player.velocityY = -JUMP_FORCE;
      gameRef.current.player.isJumping = true;
    }
  };

  const gameLoop = (timestamp: number) => {
    if (!canvasRef.current || !gameRef.current.isPlaying) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Calculate delta time
    const deltaTime = timestamp - gameRef.current.lastTimestamp || 0;
    gameRef.current.lastTimestamp = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw background mountains
    ctx.fillStyle = '#233554';
    // First mountain range (back)
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height - GROUND_HEIGHT - 100);
    ctx.lineTo(200, canvasRef.current.height - GROUND_HEIGHT - 150);
    ctx.lineTo(400, canvasRef.current.height - GROUND_HEIGHT - 100);
    ctx.closePath();
    ctx.fill();
    
    // Second mountain range (middle)
    ctx.beginPath();
    ctx.moveTo(100, canvasRef.current.height - GROUND_HEIGHT - 80);
    ctx.lineTo(300, canvasRef.current.height - GROUND_HEIGHT - 130);
    ctx.lineTo(500, canvasRef.current.height - GROUND_HEIGHT - 80);
    ctx.closePath();
    ctx.fill();
    
    // Third mountain range (front)
    ctx.beginPath();
    ctx.moveTo(200, canvasRef.current.height - GROUND_HEIGHT - 60);
    ctx.lineTo(400, canvasRef.current.height - GROUND_HEIGHT - 110);
    ctx.lineTo(600, canvasRef.current.height - GROUND_HEIGHT - 60);
    ctx.closePath();
    ctx.fill();
    
    // Fourth mountain range (far right)
    ctx.beginPath();
    ctx.moveTo(300, canvasRef.current.height - GROUND_HEIGHT - 90);
    ctx.lineTo(500, canvasRef.current.height - GROUND_HEIGHT - 140);
    ctx.lineTo(700, canvasRef.current.height - GROUND_HEIGHT - 90);
    ctx.closePath();
    ctx.fill();
    
    // Fifth mountain range (far right)
    ctx.beginPath();
    ctx.moveTo(400, canvasRef.current.height - GROUND_HEIGHT - 70);
    ctx.lineTo(600, canvasRef.current.height - GROUND_HEIGHT - 120);
    ctx.lineTo(800, canvasRef.current.height - GROUND_HEIGHT - 70);
    ctx.closePath();
    ctx.fill();

    // Update player
    const player = gameRef.current.player;
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Ground collision
    if (player.y > canvasRef.current.height - PLAYER_HEIGHT - GROUND_HEIGHT) {
      player.y = canvasRef.current.height - PLAYER_HEIGHT - GROUND_HEIGHT;
      player.velocityY = 0;
      player.isJumping = false;
    }

    // Generate books with timing and spacing
    const currentTime = Date.now();
    const timeSinceLastBook = currentTime - gameRef.current.lastBookTime;
    const randomInterval = BASE_BOOK_INTERVAL + (Math.random() * BOOK_INTERVAL_VARIATION * 2 - BOOK_INTERVAL_VARIATION);
    
    if (timeSinceLastBook >= randomInterval) {
      const lastBook = gameRef.current.books[gameRef.current.books.length - 1];
      const canGenerateNewBook = !lastBook || 
        (canvasRef.current.width - lastBook.x >= MIN_BOOK_SPACING);

      if (canGenerateNewBook) {
        console.log('Generating new book');
        const heightVariation = Math.random() * BOOK_HEIGHT_VARIATION * 2 - BOOK_HEIGHT_VARIATION;
        const newBook = {
          x: canvasRef.current.width,
          y: canvasRef.current.height - (BOOK_HEIGHT + heightVariation) - GROUND_HEIGHT,
          height: BOOK_HEIGHT + heightVariation
        };
        gameRef.current.books.push(newBook);
        gameRef.current.lastBookTime = currentTime;
      }
    }

    // Update and draw books
    const updatedBooks = [];
    for (const book of gameRef.current.books) {
      book.x -= GAME_SPEED;
      
      // Check collision
      if (
        player.x < book.x + BOOK_WIDTH &&
        player.x + PLAYER_WIDTH > book.x &&
        player.y + PLAYER_HEIGHT > book.y
      ) {
        console.log('Collision detected!');
        gameRef.current.isPlaying = false;
        gameRef.current.gameOver = true;
        setUiState(prev => ({ ...prev, isPlaying: false, gameOver: true }));
        return;
      }

      if (book.x > -BOOK_WIDTH) {
        updatedBooks.push(book);
        // Draw book
        ctx.fillStyle = '#8892b0';
        ctx.fillRect(book.x, book.y, BOOK_WIDTH, book.height);
      }
    }
    gameRef.current.books = updatedBooks;

    // Draw ground
    ctx.fillStyle = '#64ffda';
    ctx.fillRect(0, canvasRef.current.height - GROUND_HEIGHT, canvasRef.current.width, GROUND_HEIGHT);

    // Draw player
    ctx.fillStyle = '#e6f1ff';
    ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw school
    ctx.fillStyle = '#233554';
    ctx.fillRect(
      gameRef.current.schoolPosition.x,
      canvasRef.current.height - SCHOOL_HEIGHT - GROUND_HEIGHT,
      SCHOOL_WIDTH,
      SCHOOL_HEIGHT
    );
    
    // Draw "BYU" text
    ctx.fillStyle = '#64ffda';
    ctx.font = '20px "Fira Code"';
    ctx.fillText(
      'BYU',
      gameRef.current.schoolPosition.x + SCHOOL_WIDTH/2 - 20,
      canvasRef.current.height - SCHOOL_HEIGHT - GROUND_HEIGHT + 30
    );

    // Update score
    gameRef.current.score += 1;
    setUiState(prev => ({ ...prev, score: gameRef.current.score }));

    // Continue game loop
    requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    if (!gameRef.current.isPlaying) {
      console.log('Starting game...');
      gameRef.current.isPlaying = true;
      gameRef.current.score = 0;
      gameRef.current.gameOver = false;
      gameRef.current.lastBookTime = Date.now();
      setUiState({ isPlaying: true, score: 0, gameOver: false });
      
      gameRef.current = {
        ...gameRef.current,
        books: [],
        lastTimestamp: 0,
        player: {
          ...gameRef.current.player,
          y: canvasRef.current ? canvasRef.current.height - PLAYER_HEIGHT - GROUND_HEIGHT : 0,
          velocityY: 0,
          isJumping: false
        }
      };
      requestAnimationFrame(gameLoop);
    }
  };

  // Initialize canvas when component mounts
  useEffect(() => {
    initializeCanvas();
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Reset game when component unmounts
  useEffect(() => {
    return () => {
      gameRef.current.isPlaying = false;
      setUiState(prev => ({ ...prev, isPlaying: false }));
    };
  }, []);

  return (
    <div className="game-card">
      <div className="game-content">
        <h2>Running to BYU</h2>
        <p>Help me jump over books on my way to school! Press Space or Up Arrow to jump.</p>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={900}
            height={300}
            onClick={() => !gameRef.current.isPlaying && startGame()}
            style={{ cursor: gameRef.current.isPlaying ? 'default' : 'pointer' }}
          />
          {!gameRef.current.isPlaying && (
            <div className="game-overlay">
              {gameRef.current.gameOver ? (
                <>
                  <p>Game Over! Score: {uiState.score}</p>
                  <button className="generate-button" onClick={startGame}>
                    Try Again
                  </button>
                </>
              ) : (
                <button className="generate-button" onClick={startGame}>
                  Start Game
                </button>
              )}
            </div>
          )}
          {gameRef.current.isPlaying && (
            <div className="score">Score: {uiState.score}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunningGame; 