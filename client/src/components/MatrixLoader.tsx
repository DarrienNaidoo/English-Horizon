import { useEffect, useRef, useState } from 'react';

interface MatrixLoaderProps {
  isLoading: boolean;
  message?: string;
  fullscreen?: boolean;
  duration?: number;
}

export function MatrixLoader({ 
  isLoading, 
  message = "LOADING...", 
  fullscreen = false,
  duration = 2000 
}: MatrixLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      if (fullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Matrix characters
    const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリィギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレェゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Animation
    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix green text
      ctx.fillStyle = '#00FF00';
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Varying opacity for depth effect
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        ctx.fillText(char, x, y);

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Progress animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    const animationId = setInterval(draw, 50);

    return () => {
      clearInterval(animationId);
      clearInterval(progressInterval);
      window.removeEventListener('resize', updateSize);
    };
  }, [isLoading, fullscreen, duration]);

  if (!isLoading) return null;

  const containerClass = fullscreen 
    ? "fixed inset-0 z-50 bg-black flex items-center justify-center"
    : "absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center rounded";

  return (
    <div className={containerClass}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      <div className="relative z-10 text-center space-y-6">
        {/* Loading message */}
        <div className="text-2xl font-mono text-green-400 tracking-wider animate-pulse">
          {message}
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-black border border-green-400 relative overflow-hidden">
          <div 
            className="h-full bg-green-400 transition-all duration-100 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-green-300 animate-pulse opacity-50" />
          </div>
        </div>
        
        {/* Progress percentage */}
        <div className="text-sm font-mono text-green-300">
          {Math.round(progress)}% COMPLETE
        </div>
        
        {/* Matrix-style status messages */}
        <div className="text-xs font-mono text-green-500 space-y-1 opacity-70">
          <div>{'>'} INITIALIZING NEURAL PATHWAYS...</div>
          <div>{'>'} ESTABLISHING MATRIX CONNECTION...</div>
          <div>{'>'} SYNCHRONIZING DATA STREAMS...</div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing loading states
export function useMatrixLoader(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [message, setMessage] = useState("LOADING...");

  const startLoading = (loadingMessage?: string, duration?: number) => {
    if (loadingMessage) setMessage(loadingMessage);
    setIsLoading(true);
    
    if (duration) {
      setTimeout(() => {
        setIsLoading(false);
      }, duration);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    setMessage
  };
}