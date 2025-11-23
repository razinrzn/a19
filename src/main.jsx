import React from 'react';
import ReactDOM from 'react-dom/client';
import StarfieldPage from './StarfieldPage';

const App = () => (
  <>
    <StarfieldPage />
    <audio
      id="background-music"
      src="/assets/hbd.mp3"
      muted
      loop
      preload="auto"
      autoPlay
      style={{ display: 'none' }}
    />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
