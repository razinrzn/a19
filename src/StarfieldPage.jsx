import React, { useEffect, useState, useRef } from 'react';
import './StarfieldPage.css';
import GradientBackground from './GradientBackground';
/* Removed Page3App import since Page 3 is a normal webpage similar to Page 2 */

const STAR_COUNT = 300;
const CONFETTI_COUNT = 700;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloatFromInterval(min, max) {
  return Math.random() * (max - min) + min;
}

function generateConfetti() {
  const confetti = [];
  const leftX = 0;
  const rightX = window.innerWidth;
  const bottomY = window.innerHeight;
  const sideGeneratorCount = 3; // number of generators on each side
  const bottomGeneratorCount = 3; // number of generators on bottom
  const perOrigin = Math.floor(CONFETTI_COUNT / (2 * sideGeneratorCount + bottomGeneratorCount));

  // Generate confetti for left edge generators
  for (let gen = 0; gen < sideGeneratorCount; gen++) {
    const y0 = (window.innerHeight / (sideGeneratorCount + 1)) * (gen + 1);
    for (let i = gen * perOrigin; i < (gen + 1) * perOrigin; i++) {
      confetti.push({
        id: i,
        origin: 'left',
        size: randomIntFromInterval(6, 12),
        color: `hsl(${randomIntFromInterval(0, 360)}, 85%, 55%)`,
        delay: randomFloatFromInterval(0, 1),
        rotate: randomIntFromInterval(0, 360),
        rotationSpeed: randomFloatFromInterval(-720, 720),
        angle: (randomFloatFromInterval(-45, 45) * Math.PI) / 180,
        speed: randomFloatFromInterval(300, 600),
        x0: leftX,
        y0,
      });
    }
  }

  // Generate confetti for right edge generators
  for (let gen = 0; gen < sideGeneratorCount; gen++) {
    const y0 = (window.innerHeight / (sideGeneratorCount + 1)) * (gen + 1);
    for (let i = (gen + sideGeneratorCount) * perOrigin; i < (gen + sideGeneratorCount + 1) * perOrigin; i++) {
      confetti.push({
        id: i,
        origin: 'right',
        size: randomIntFromInterval(6, 12),
        color: `hsl(${randomIntFromInterval(0, 360)}, 85%, 55%)`,
        delay: randomFloatFromInterval(0, 1),
        rotate: randomIntFromInterval(0, 360),
        rotationSpeed: randomFloatFromInterval(-720, 720),
        angle: (randomFloatFromInterval(135, 225) * Math.PI) / 180,
        speed: randomFloatFromInterval(300, 600),
        x0: rightX,
        y0,
      });
    }
  }

  // Generate confetti for bottom generators
  for (let gen = 0; gen < bottomGeneratorCount; gen++) {
    const x0 = (window.innerWidth / (bottomGeneratorCount + 1)) * (gen + 1);
    for (let i = (gen + 2 * sideGeneratorCount) * perOrigin; i < (gen + 2 * sideGeneratorCount + 1) * perOrigin; i++) {
      confetti.push({
        id: i,
        origin: 'bottom',
        size: randomIntFromInterval(6, 12),
        color: `hsl(${randomIntFromInterval(0, 360)}, 85%, 55%)`,
        delay: randomFloatFromInterval(0, 1),
        rotate: randomIntFromInterval(0, 360),
        rotationSpeed: randomFloatFromInterval(-720, 720),
        angle: (randomFloatFromInterval(-75, 75) * Math.PI) / 180,
        speed: randomFloatFromInterval(300, 600),
        x0,
        y0: bottomY,
      });
    }
  }
  return confetti;
}

function StarfieldPage() {
  const [stars, setStars] = useState([]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [page2Parallax, setPage2Parallax] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [confettiStartTime, setConfettiStartTime] = useState(null);
  const [playFireworkVideo, setPlayFireworkVideo] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [showClickMeButton, setShowClickMeButton] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showPage3, setShowPage3] = useState(false); // add showPage3 state for page 3 visibility
  const [showNextButton, setShowNextButton] = useState(false); // new state for button fade-in delay
  const [showCurrentPage, setShowCurrentPage] = useState(true);
  const [showNextPage, setShowNextPage] = useState(false); // added missing showNextPage state
  const [isPage2Transitioning, setIsPage2Transitioning] = useState(false); // new transition state for fade out
  const [page2FadeOut, setPage2FadeOut] = useState(false);
  const [page3FadeIn, setPage3FadeIn] = useState(false);
  const [page3SurpriseVisible, setPage3SurpriseVisible] = useState(false);

  // page3Style added to fix visibility of page 3 container
  const page3Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'transparent', // or any desired background
    overflowY: 'hidden',  // changed from 'auto' to 'hidden' to prevent vertical scrollbar
    overflowX: 'hidden',  // add to prevent horizontal scrollbar
    zIndex: 25
  };

  useEffect(() => {
    let timeoutId;
    if (showPage3) {
      timeoutId = setTimeout(() => {
        setPage3SurpriseVisible(true);
      }, 5000);
    } else {
      setPage3SurpriseVisible(false);
    }
    return () => clearTimeout(timeoutId);
  }, [showPage3]);

  // remove isPage2ToPage3Transitioning usage entirely later

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const page2Ref = useRef(null);

  const starfieldTransform = `translate3d(${parallax.x.toFixed(2)}px, ${parallax.y.toFixed(2)}px, 0)`;


  useEffect(() => {
    const generatedStars = [];
    const containerWidth = 120;
    const containerHeight = 120;
    for (let i = 0; i < STAR_COUNT; i++) {
      const size = randomFloatFromInterval(0.5, 3);
      generatedStars.push({
        id: i,
        top: Math.random() * containerHeight,
        left: Math.random() * containerWidth,
        size,
        twinkleDuration: randomFloatFromInterval(1.5, 6),
        color: `rgba(255, 255, ${randomIntFromInterval(200, 255)}, ${randomFloatFromInterval(0.6, 1)})`,
        blur: Math.min(0.5, size / 5),
      });
    }
    setStars(generatedStars);
  }, []);


  useEffect(() => {
    function handleMouseMove(e) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      setParallax({ x, y });
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setShowConfetti(true);
      setConfetti(generateConfetti());
      setConfettiStartTime(performance.now());
      setPlayFireworkVideo(true);
      /* Removed auto play on countdown completion to avoid unwanted audio */
      /* if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
        audioRef.current.play().catch(() => {
          // Handle play promise rejection if user hasn't interacted with page yet
        });
      } */
      setShowWords(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (showWords) {
      const timer = setTimeout(() => {
        setShowClickMeButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (!showWords && showClickMeButton) {
      setShowClickMeButton(false);
    }
  }, [showWords, showClickMeButton]);

  const animTimeRef = React.useRef(0);

  useEffect(() => {
    if (!showConfetti) return;
    let animationFrameId;
    const startTime = confettiStartTime || performance.now();
    let lastFrameTime = 0;
    const frameRate = 20;
    const frameDuration = 1000 / frameRate;

    function animate(time) {
      if (time - lastFrameTime >= frameDuration) {
        animTimeRef.current = time - startTime;
        lastFrameTime = time;

        // Imperative update of confetti styles
        if (containerRef.current) {
          confetti.forEach(p => {
            const t = animTimeRef.current / 1000 - p.delay;
            const confettiElem = document.getElementById(`confetti-${p.id}`);
            if (!confettiElem) return;
            if (t < 0 || t > 6) {
              confettiElem.style.opacity = '0';
              return;
            }
            const g = 600;
            const vx = p.speed * Math.cos(p.angle);
            const vy0 = -p.speed * Math.sin(p.angle);

            const x = p.x0 + vx * t;
            const y = p.y0 + vy0 * t + 0.5 * g * t * t;
            const rotation = p.rotate + p.rotationSpeed * t;
            const opacity = t > 5.5 ? 1 - (t - 5.5) / 0.5 : 1;

            confettiElem.style.position = 'fixed';
            confettiElem.style.left = '0px';
            confettiElem.style.top = '0px';
            confettiElem.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            confettiElem.style.width = `${p.size}px`;
            confettiElem.style.height = `${p.size / 3}px`;
            confettiElem.style.backgroundColor = p.color;
            confettiElem.style.borderRadius = '3px';
            confettiElem.style.opacity = `${opacity}`;
            confettiElem.style.pointerEvents = 'none';
            confettiElem.style.zIndex = '20';
            confettiElem.style.willChange = 'transform, opacity';
            confettiElem.style.boxShadow = `0 0 6px ${p.color}`;
          });
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [showConfetti, confettiStartTime, confetti]);

  // Removed confettiStyle function as we use imperative styling now

  // Removed transitioning useEffect since we're using smooth scroll instead
  // Remove the above transitioning useEffect block

  const transitionDuration = 700;

  // Remove slide transition styles for pages 2 and 3; replaced by fade classes

  return (
    <div className="page-container" style={{ backgroundColor: 'transparent' }}>
          {showCurrentPage && (
            <div className={"current-page" + (transitioning ? " fade-out-up" : "")} style={{backgroundColor: "transparent", zIndex: 15, position: "absolute", width: "100vw", height: "100vh"}}>
              {/* Starfield and animation elements same as before (unchanged) */}
          <div
            className="starfield"
            aria-label="Starfield background"
            style={{
              transform: starfieldTransform,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
              backgroundColor: 'transparent',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            {stars.map(({ id, top, left, size, twinkleDuration, color, blur }) => (
              <div
                key={id}
                className="star"
                style={{
                  position: 'fixed',
                  top: top + "vh",
                  left: left + "vw",
                  width: size + "px",
                  height: size + "px",
                  backgroundColor: color,
                  animationDuration: twinkleDuration + "s",
                  filter: "blur(" + blur + "px)",
                  boxShadow: "0 0 " + size * 2 + "px " + color,
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
          {/* Other content (playFireworkVideo, countdown, words, confetti etc.) same as before */}
          {playFireworkVideo && (
            <video
              ref={videoRef}
              src="/assets/firework.mp4"
              muted
              autoPlay
              loop
              playsInline
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.style.opacity = 1;
                }
              }}
              onError={(e) => {
                console.error('Error loading firework video:', e);
              }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                pointerEvents: 'none',
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out',
                zIndex: 5,
              }}
              aria-hidden="true"
            />
          )}
          {countdown > 0 && (
            <div
              className="countdown"
              aria-live="polite"
              role="alert"
              style={{
                position: 'fixed',
                top: '50vh',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10rem',
                fontWeight: 'bold',
                color: '#00ffff',
                textShadow: '0 0 30px #00ffff',
                zIndex: 1000,
                userSelect: 'none',
                backgroundColor: 'transparent',
                pointerEvents: 'none',
              }}
            >
              {countdown}
            </div>
          )}
          {confetti && confetti.length > 0 && (
            <div ref={containerRef}>
              {confetti.map((p) => (
                <div
                  key={p.id}
                  id={`confetti-${p.id}`}
                  className="confetti"
                  aria-hidden="true"
                  style={{
                    position: 'fixed',
                    width: p.size,
                    height: p.size / 3,
                    backgroundColor: p.color,
                    borderRadius: '3px',
                    pointerEvents: 'none',
                    zIndex: 20,
                    boxShadow: `0 0 6px ${p.color}`,
                    willChange: 'transform, opacity',
                  }}
                />
              ))}
            </div>
          )}
          {showWords && (
            <>
              <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: 'fixed',
                  top: '50vh',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#ffffff',
                  fontSize: '7rem',
                  fontWeight: '700',
                  fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  textAlign: 'center',
                  userSelect: 'none',
                  zIndex: 1000,
                  lineHeight: '7.5rem',
                  whiteSpace: 'pre-line',
                  textShadow: '0 0 20px #00ffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
              {['HAPPY', 'BIRTHDAY', 'AYESHA'].map((word, idx) => (
                <div
                  key={idx}
                  className="birthday-word"
                  style={{
                    pointerEvents: 'none',
                    display: 'block',
                    marginBottom: '4rem',
                    opacity: 0,
                    animationName: 'floatUpFadeIn',
                    animationDuration: '1.2s',
                    animationFillMode: 'forwards',
                    animationDelay: `${idx * 1.2}s`,
                    animationTimingFunction: 'ease-out',
                    transform: 'translateY(30px)',
                    lineHeight: '3.5rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {word}
                </div>
              ))}
              </div>
            {(showClickMeButton && !showNextPage) && (
              <button
                className="liquid-glass-button fade-in-up"
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = false;
                    audioRef.current.volume = 0.3;
                    audioRef.current.play().catch(() => {});
                  }
                  // Start fade out up animation and fade in up simultaneously
                  setTransitioning(true);
                  setShowNextPage(true);
                  setShowWords(false); // Hide "Happy Birthday" text immediately
                  setShowClickMeButton(false); // Hide button immediately
                  // After animation duration, hide current page and reset transitioning
                  setTimeout(() => {
                    setShowCurrentPage(false);
                    setTransitioning(false);
                    if (page2Ref.current) {
                      page2Ref.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 700); // sync with CSS animation duration
                }}
                aria-label="click here cutie Button"
                style={{
                  position: 'fixed',
                  top: '85vh',
                  left: '40%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  pointerEvents: 'auto',
                  fontSize: '2rem',
                }}
              >
                click here cutie
              </button>
            )}
            </> 
          )}
          {/* Countdown, showWords, showClickMeButton, confetti rendered unchanged */}
          {/* Code for countdown, words, clickme button, confetti is unchanged and omitted here for brevity */}
        </div>
      )}
      {/* Page 2 container with updated style and transition */}
          {showNextPage && (
            <div
              ref={page2Ref}
              className={`page2-container ${isPage2Transitioning ? " fade-out-up" : "fade-in-up"}`}
            style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setPage2Parallax({ x, y });
              }}
            >
          <GradientBackground parallax={page2Parallax} />
          <div className="liquid-glass" style={{ display: 'flex', flexDirection: 'column', padding: '3rem', width: '90vw', maxWidth: '1500px', minWidth: '300px', minHeight: '400px', color: 'black', fontSize: '1.8rem', fontWeight: 'bold', zIndex: 30, margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ flex: '1 1 auto' }}>
              <p>Dear Ayesha,</p>
              <p>
                HAPPY HAPPY HAPPIEST BIRTHDAY TO MY BEAUTIFUL BABY. this is the best day of the year and i cant believe i get to be a part of it 
                every year. may allah give you health, wealth, courage, knowledge and everything you need to achieve all your goals. be my baby forever
                youre the best thing that ever happened to me. im so happy you exist. im so grateful for you. words cant describe how much you meant to me.
                and that's exactly why this day is so special because you were born today. once again happiest birthday my pookiebear. i hope you
                like this little gift from me :)
              </p>
              <p>With love,</p>
              <p>your cutiepie razin</p>
            </div>
              <button
                className="liquid-glass-button"
                type="button"
                onClick={() => {
                  setIsPage2Transitioning(true);
                  setShowWords(false);
                  setShowClickMeButton(false);

                  setPage2FadeOut(true);
                  setPage3FadeIn(false);

                  setTimeout(() => {
                    setShowPage3(true);
                    setShowNextPage(false);
                    setPage3FadeIn(true);
                    setPage2FadeOut(false);
                    setIsPage2Transitioning(false);
                  }, 400);
                }}
                aria-label="Next Button"
                style={{
                  alignSelf: 'center',
                  fontSize: '2rem',
                  padding: '1rem 3rem',
                  whiteSpace: 'nowrap',
                  minWidth: '140px',
                  minHeight: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: 'red',
                  marginTop: '-2rem',
                  zIndex: 30,
                }}
              >
                Next
              </button>
          </div>
        </div>
      )}
      {/* Page 3 container with updated style and transition */}
      {(showPage3) && (
        <div
          className={`page3-container ${
            page3FadeIn ? 'fade-in-up' : ''
          }`}
          aria-label="Page 3 container"
          style={{
            ...page3Style,
            opacity: page3FadeIn ? 1 : 0,
            pointerEvents: page3FadeIn ? 'auto' : 'none',
          }}
        >
          <GradientBackground parallax={parallax} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 10,
            }}
            aria-hidden="true"
          >
            {/* Additional animated elements if needed */}
          </div>
              <>
                <div style={{ position: 'relative', zIndex: 50, width: '100%', padding: '0 0 0.3rem 0' }}>
                  <h1 className="page-heading" style={{ marginBottom: '-1rem' }}>
                    My baby: from age 0 to 1.9 🤭
                  </h1>
                </div>
                <div
                  className="photo-gallery"
                  style={{
                    position: 'relative',
                    zIndex: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '-10rem',
                    // padding: '2rem',
                    width: '100%',
                    height: '100%',
                    overflowY: 'hidden',
                    boxSizing: 'border-box',
                    perspective: '800px', // added perspective for 3D hover effect
                  }}
                >
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="liquid-glass photo-container"
                  style={{
                    width: '240px',
                    height: '370px',
                    padding: '0.5rem',
                    borderRadius: '15px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1rem',
                    userSelect: 'none',
                    overflow: 'hidden',
                  }}
                  aria-label={`Photo placeholder ${idx + 1}`}
                >
                  <img
                    src={`/assets/image${idx + 1}.jpg`}
                    alt={`Photo ${idx + 1}`}
                    style={{
                      maxWidth: '85%',
                      maxHeight: '85%',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      display: 'block',
                      margin: 'auto',
                    }}
                  />
                </div>
              ))}
              <div
                className="liquid-glass photo-container"
                style={{
                  width: '240px',
                  height: '370px',
                  padding: '0.5rem',
                  borderRadius: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1rem',
                  userSelect: 'none',
                  overflow: 'hidden',
                }}
                aria-label="Photo placeholder 5"
              >
                <img
                  src={`/assets/image5.jpg`}
                  alt="Photo 5"
                  style={{
                    maxWidth: '85%',
                    maxHeight: '85%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    display: 'block',
                    margin: 'auto',
                  }}
                />
              </div>
          </div>
          </>
          {page3SurpriseVisible && (
            <button
              type="button"
              aria-label="Click me for a surprise"
              className="liquid-glass-button fade-in-up"
              onClick={() => window.open('https://cakeforyou.vercel.app/', '_blank', 'noopener')}
              style={{
                position: 'fixed',
                bottom: '40px',
                left: '38%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                fontSize: '1.6rem',
                cursor: 'pointer',
                padding: '0.75rem 1.5rem',
                userSelect: 'none',
                minWidth: '190px',
                borderRadius: '9999px',
                fontWeight: 'bold',
                pointerEvents: 'auto',
              }}
            >
              Click me for a surprise😏🤭🥹😘
            </button>
          )}
        </div>
      )}  
    </div>
  );
}

export default StarfieldPage;
