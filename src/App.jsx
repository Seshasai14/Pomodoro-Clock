import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, RefreshCcw, PauseCircle, PlayCircle } from 'react-feather';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [audio] = useState(new Audio('https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'));

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      audio.play();
      setIsSession(!isSession);
      setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isSession, breakLength, sessionLength, audio]);

  useEffect(() => {
    if (isRunning) {
      toast.success('Timer is running!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.info('Timer is paused', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isRunning]);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleLengthChange = (type, change) => {
    if (isRunning) return;
    if (type === 'break') {
      setBreakLength(prev => Math.max(1, Math.min(60, prev + change)));
    } else {
      setSessionLength(prev => Math.max(1, Math.min(60, prev + change)));
      setTimeLeft((Math.max(1, Math.min(60, sessionLength + change))) * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    audio.pause();
    audio.currentTime = 0;
    toast.info('Timer has been reset', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  return (
    <>
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-sky-400 p-5">
        25+5 Clock
      </h1>
      <div className='flex flex-col items-center mx-auto'>
        <div className='flex m-5'>
          <span onClick={() => handleLengthChange('break', 1)} className='cursor-pointer p-5'><PlusCircle /></span>
          Break Length
          <span onClick={() => handleLengthChange('break', -1)} className='cursor-pointer p-5'><MinusCircle /></span>
        </div>
        {breakLength}
        <div className='flex m-5'>
          <span onClick={() => handleLengthChange('session', 1)} className='cursor-pointer p-5'><PlusCircle /></span>
          Session Length
          <span onClick={() => handleLengthChange('session', -1)} className='cursor-pointer p-5'><MinusCircle /></span>
        </div>
        {sessionLength}
      </div>
      <div>
        <div className='flex flex-col items-center mx-auto'>
          <div className='flex flex-col border-solid border-4 border-sky-500 rounded w-1/6 text-center mb-5'>
            <h2>{isSession ? 'Session' : 'Break'}</h2>
            <h2>{formatTime(timeLeft)}</h2>
          </div>
          <div className='flex'>
            <span className='p-5 cursor-pointer' onClick={handleReset}><RefreshCcw /></span>
            <span className='p-5 cursor-pointer' onClick={handlePlayPause}>
              {isRunning ? <PauseCircle /> : <PlayCircle />}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;