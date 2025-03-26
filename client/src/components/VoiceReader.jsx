// client/src/components/VoiceReader.jsx
import React from "react";

/**
 * VoiceReader Component - Provides controls for text-to-speech functionality
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onStartReading - Handler for starting reading
 * @param {Function} props.onPause - Handler for pausing reading
 * @param {Function} props.onResume - Handler for resuming reading
 * @param {Function} props.onStop - Handler for stopping reading
 * @param {boolean} props.isReading - Whether reading is in progress
 * @param {boolean} props.isPaused - Whether reading is paused
 * @param {number} props.speechRate - Current speech rate
 * @param {Function} props.onRateChange - Handler for speech rate changes
 */
function VoiceReader({ 
  onStartReading, 
  onPause, 
  onResume, 
  onStop, 
  isReading, 
  isPaused,
  speechRate,
  onRateChange
}) {
  /**
   * Handles speech rate button clicks
   * 
   * @param {number} rate - New speech rate value
   */
  const handleRateChange = (rate) => {
    if (onRateChange) {
      onRateChange(rate);
    }
  };

  return (
    <div className="voice-controls">
      {!isReading && !isPaused && (
        <button className="voice-control-button" onClick={onStartReading}>
          <span>▶️</span> Read All
        </button>
      )}
      {isReading && !isPaused && (
        <button className="voice-control-button" onClick={onPause}>
          <span>⏸️</span> Pause
        </button>
      )}
      {isPaused && (
        <button className="voice-control-button" onClick={onResume}>
          <span>▶️</span> Continue
        </button>
      )}
      <button
        className="voice-control-button"
        onClick={onStop}
        disabled={!isReading && !isPaused}
      >
        <span>⏹️</span> Stop
      </button>
      <div className="speed-control">
        <span>Speed:</span>
        <div className="speed-buttons">
          {[0.5, 1, 1.5, 2, 2.5].map((rate) => (
            <button
              key={rate}
              className={`speed-button ${speechRate === rate ? "active" : ""}`}
              onClick={() => handleRateChange(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoiceReader;