import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Howl } from 'howler';

const TimerApp = () => {
  const [mainTimer, setMainTimer] = useState(320); // 600 seconds = 10 minutes
  const [isMainRunning, setIsMainRunning] = useState(false);
  const [subTimer, setSubTimer] = useState(15);
  const [isSubRunning, setIsSubRunning] = useState(false);

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  // State to track if the sub timer has already been set to 10 seconds after reaching 5 minutes
  const [isSubTimerSet, setIsSubTimerSet] = useState(false);

  // Store the Howl instances in refs
  const sound10Seconds = useRef(new Howl({ src: ['/images/lastseconds.mp3'] })).current;
  const sound5Minutes = useRef(new Howl({ src: ['/images/secondshotclock.mp3'] })).current;
  const soundSub = useRef(new Howl({ src: ['/images/timersoundeffect.mp3'] })).current;

  useEffect(() => {
    let mainInterval;
    if (isMainRunning) {
      mainInterval = setInterval(() => {
        setMainTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(mainInterval);
  }, [isMainRunning]);

  useEffect(() => {
    let subInterval;
    if (isSubRunning) {
      subInterval = setInterval(() => {
        setSubTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(subInterval);
  }, [isSubRunning]);

  useEffect(() => {
    if (mainTimer <= 300 && !isSubTimerSet) {
      setSubTimer(10);  // Set sub timer to 10 seconds once main timer hits 5 minutes
      setIsSubTimerSet(true);  // Mark that the sub timer has been set
    }
  }, [mainTimer, isSubTimerSet]);

  useEffect(() => {
    // Play sound when the sub timer hits 5 seconds
    if (isSubRunning && subTimer === 5 && !soundSub.playing()) {
      soundSub.play();
    } else if (!isSubRunning) {
      soundSub.stop(); // Stop sound when paused or reset
    }

    // Play sound when the main timer reaches 10 seconds
    if (mainTimer === 10 && !sound10Seconds.playing()) {
      sound10Seconds.play();
    }

    // Play sound when the main timer reaches 5 minutes (300 seconds)
    if (mainTimer === 300 && !sound5Minutes.playing()) {
      sound5Minutes.play();
    }
  }, [mainTimer, subTimer, isSubRunning]);

  const resetSubTimer = () => {
    setSubTimer(15);
    setIsSubRunning(false);
    setIsSubTimerSet(false);  // Reset the flag when the sub timer is reset
    soundSub.stop(); // Stop the sound when resetting the sub timer
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const addPoints = (points) => {
    if (currentPlayer === 1) setPlayer1Score((prev) => prev + points);
    else setPlayer2Score((prev) => prev + points);
  };

  const toggleSubTimer = () => {
    setIsSubRunning((prev) => {
      // If we're resuming the timer, check if we need to play the sound
      if (!prev && subTimer === 5 && !soundSub.playing()) {
        soundSub.play();
      }
      return !prev;
    });
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundImage: 'url(images/snookerbackg.jpg)', backgroundSize: 'cover', backgroundColor: 'rgba(245, 245, 245, 0.5)', backgroundBlendMode: 'overlay', textAlign: 'center' }}>
      <div className="overlay">
        {/* Main Timer */}
        <h1 className="timer-text">{formatTime(mainTimer)}</h1>
        <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button className="button" onClick={() => setIsMainRunning((prev) => !prev)}>
            {isMainRunning ? 'Pause' : 'Start'}
          </button>
          <button className="button" onClick={() => { setMainTimer(600); setIsMainRunning(false); }}>
            Reset
          </button>
        </div>

        {/* Sub Timer */}
        <h1 className="timer-text" style={{ marginTop: '40px' }}>{formatTime(subTimer)}</h1>
        <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button className="button" onClick={toggleSubTimer}>
            {isSubRunning ? 'Pause' : 'Start'}
          </button>
          <button className="button" onClick={resetSubTimer}>
            Reset
          </button>
        </div>

        {/* Snooker Scoreboard */}
        <div className="scoreboard">
          <h2>Snooker Scoreboard</h2>
          <div className="player-selector" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <input className="player-name" value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} />
            <button className={`player-button ${currentPlayer === 1 ? 'active' : ''}`} onClick={() => setCurrentPlayer(1)}>Select</button>
            <span>VS</span>
            <button className={`player-button ${currentPlayer === 2 ? 'active' : ''}`} onClick={() => setCurrentPlayer(2)}>Select</button>
            <input className="player-name" value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} />
          </div>
          <div className="score-container">
            <h1>{player1Name}: {player1Score}</h1>
            <h1>{player2Name}: {player2Score}</h1>
          </div>
          <div className="score-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            {[{points: 1, color: 'red'}, {points: 2, color: 'yellow'}, {points: 3, color: 'green'}, {points: 4, color: 'brown'}, {points: 5, color: 'blue'}, {points: 6, color: 'pink'}, {points: 7, color: 'black'}].map(({points, color}) => (
              <button key={points} className="circle-button" style={{ backgroundColor: color, borderRadius: '50%', width: '30px', height: '30px', border: '2px solid white', fontSize: '12px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => addPoints(points)}>
                {points}
              </button>
            ))}
          </div>
          <button className="reset-button" onClick={() => { setPlayer1Score(0); setPlayer2Score(0); }}>Reset Scores</button>
        </div>
      </div>
    </div>
  );
};

export default TimerApp;
