import { useState, useEffect } from 'react';
import { loadingMessages } from '../../constants'; 
import './LoadingIndicator.scss'; 

const LoadingIndicator = () => {
  const [dots, setDots] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  // update dots every 750ms
  useEffect(() => {
    const updateDots = () => {
        setDots(prevDots => {
            if (prevDots === '...') {
                return '';
            } else {
                return prevDots + '.';
            }
        });
    };
    const intervalId = setInterval(updateDots, 750);
    return () => clearInterval(intervalId);
  }, []);

  // update message every 20s
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      setDots('');
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [messageIndex]);

  const currentMessage = loadingMessages[messageIndex];

  return (
    <div className="container">
      <div className="row justify-content-center">
          <div className="indicator-container">
              <div className="loader-container col-md-12">
                  <span className="loader"></span>
                  <p>{currentMessage}{dots}</p>
              </div>
          </div>
      </div>
    </div>
    );
  }
  
export default LoadingIndicator;

