import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Device Icons as SVG Components
const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const TabletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

const WhackAMinionGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [deviceType, setDeviceType] = useState('desktop');
  const [molePositions, setMolePositions] = useState(
    Array(9).fill({ visible: false, height: 0 })
  );
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const moleTimerRef = useRef(null);

  // Responsive Grid Configuration
  const getGridConfig = () => {
    switch(deviceType) {
      case 'mobile':
        return {
          gridCols: 2,
          holeSize: 'h-20 w-20', // Increased size for better touch targets
          moleScale: 1,
          perspective: 'perspective-500',
          moleSpeed: 1500
        };
      case 'tablet':
        return {
          gridCols: 3,
          holeSize: 'h-24 w-24',
          moleScale: 1.1,
          perspective: 'perspective-700',
          moleSpeed: 1800
        };
      default:
        return {
          gridCols: 3,
          holeSize: 'h-28 w-28 md:h-32 md:w-32 lg:h-40 lg:w-40',
          moleScale: 1.2,
          perspective: 'perspective-1000',
          moleSpeed: 2000
        };
    }
  };

  const gridConfig = getGridConfig();

  // Detect Device Type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    startTimer();
    moveMoles();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          clearInterval(moleTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveMoles = () => {
    moleTimerRef.current = setInterval(() => {
      const holesCount = deviceType === 'mobile' ? 4 : 9;
      
      const newPositions = Array(holesCount).fill({ 
        visible: false, 
        height: 0 
      });
      
      const randomHoles = [...Array(Math.ceil(holesCount / 3))]
        .map(() => Math.floor(Math.random() * holesCount));
      
      randomHoles.forEach(hole => {
        newPositions[hole] = { 
          visible: true, 
          height: 100 
        };
      });

      setMolePositions(newPositions);
    }, 1200);
  };

  const whackMole = (index) => {
    if (molePositions[index].visible) {
      const newPositions = [...molePositions];
      newPositions[index] = { visible: false, height: 0 };
      setMolePositions(newPositions);
      setScore(prev => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(moleTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Whack the Minions</h1>
      </header>

      {/* Main game content */}
      <div className={`flex-grow flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden ${gridConfig.perspective}`}>
        {/* Device Type Indicator */}
        <div className="fixed top-4 right-4 flex gap-2 text-white opacity-50">
          {deviceType === 'mobile' && <MobileIcon />}
          {deviceType === 'tablet' && <TabletIcon />}
          {deviceType === 'desktop' && <MonitorIcon />}
        </div>

        <div className="w-full max-w-4xl relative z-10 bg-gray-800/70 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-lg">
          {/* Score and Timer */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2">
            <div className="text-cyan-400 flex items-center gap-2 text-base sm:text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-1.02 1.24a4 4 0 0 0-1.74 1.58"/>
                <path d="M14 14.66V17c0 .55.47.98 1.02 1.24a4 4 0 0 1 1.74 1.58"/>
              </svg>
              <span className="font-bold">Score: {score}</span>
            </div>
            <div className="text-red-400 font-bold text-base sm:text-lg">
              Time: {timeLeft}s
            </div>
          </div>

          {/* Game Grid */}
          <div 
            className={`grid grid-cols-${gridConfig.gridCols} gap-2 sm:gap-4 mb-4 sm:mb-6 justify-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto`}
            style={{ 
              perspective: '1000px',
              transformStyle: 'preserve-3d' 
            }}
          >
            {molePositions.map((mole, index) => (
              <div 
                key={index}
                className={`bg-gray-700 ${gridConfig.holeSize} rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden`}
                onClick={() => whackMole(index)}
              >
                {/* Hole Backdrop */}
                <div className="absolute bottom-0 w-full h-4 bg-gray-900 transform -translate-y-1/2 rounded-full opacity-50" />

                {/* 3D Minion Container */}
                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
                  animate={{ 
                    translateY: mole.visible ? `-${mole.height}%` : '0%',
                    scale: mole.visible ? gridConfig.moleScale : 1,
                    rotateX: mole.visible ? -30 : 0
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200,
                    damping: 20,
                    duration: gridConfig.moleSpeed / 1000
                  }}
                >
                  {mole.visible && (
                    <img 
                      src="/placeholder.svg?height=100&width=100" 
                      alt="Minion" 
                      className="w-full h-full object-cover transform-style-3d origin-bottom"
                    />
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Game Over / Start Game */}
          {gameOver && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center text-white bg-red-600/80 p-3 sm:p-4 rounded-lg text-sm sm:text-base"
              >
                Game Over! Final Score: {score}
              </motion.div>
            </AnimatePresence>
          )}

          {!gameOver && timeLeft === 30 && (
            <motion.button 
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-cyan-500 text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-cyan-600 transition-colors text-base sm:text-lg"
            >
              Start Game
            </motion.button>
          )}
        </div>

        {/* Responsive 3D Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(deviceType === 'mobile' ? 10 : 20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0.5
              }}
              animate={{ 
                opacity: [0, 0.5, 0],
                x: [
                  Math.random() * window.innerWidth, 
                  Math.random() * window.innerWidth, 
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight, 
                  Math.random() * window.innerHeight, 
                  Math.random() * window.innerHeight
                ],
                scale: [0.5, 1, 0.5],
                rotateX: [0, 360, 0],
                rotateY: [0, 360, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className="absolute w-2 sm:w-4 h-2 sm:h-4 bg-cyan-500/30 rounded-full blur-sm"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        <p>&copy; 2024 Khushi Kumari. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WhackAMinionGame;

