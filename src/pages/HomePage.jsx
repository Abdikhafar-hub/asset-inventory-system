import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../assets/offfice.jpg";
import StarsCanvas from "../components/StarsCanvas"; // Update to the correct relative path

function HomePage() {
  const navigate = useNavigate();
  const svgRef = useRef(null);

  // Generate static stars for twinkling background effect
  const generateTwinklingStars = (count) => {
    return Array.from({ length: count }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  };

  const [twinklingStars] = useState(generateTwinklingStars(400)); // Static stars for background
  const [shootingStars, setShootingStars] = useState([]);

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  // Function to start a shooting star from a random edge of the screen
  const getRandomStartPoint = () => {
    const side = Math.floor(Math.random() * 4);
    const offset = Math.random() * (side % 2 === 0 ? window.innerWidth : window.innerHeight);

    switch (side) {
      case 0: // Top
        return { x: offset, y: 0, angle: 45 };
      case 1: // Right
        return { x: window.innerWidth, y: offset, angle: 135 };
      case 2: // Bottom
        return { x: offset, y: window.innerHeight, angle: 225 };
      case 3: // Left
        return { x: 0, y: offset, angle: 315 };
      default:
        return { x: 0, y: 0, angle: 45 };
    }
  };

  useEffect(() => {
    const createShootingStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar = {
        id: Date.now() + Math.random(), // Unique ID
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * 20 + 20, // Faster speed range
        distance: 0,
        width: Math.random() * 7 + 5, // Increased thickness range
      };
      setShootingStars((prevStars) => [...prevStars, newStar]);

      // Remove the star after it moves off-screen
      setTimeout(() => {
        setShootingStars((prevStars) => prevStars.filter((star) => star.id !== newStar.id));
      }, 3000); // Star lifespan of 3 seconds
    };

    // Interval for creating new shooting stars (more frequent)
    const interval = setInterval(createShootingStar, Math.random() * 1000 + 500); // 0.5-1.5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveShootingStars = () => {
      setShootingStars((prevStars) =>
        prevStars.map((star) => {
          const newX = star.x + star.speed * Math.cos((star.angle * Math.PI) / 180);
          const newY = star.y + star.speed * Math.sin((star.angle * Math.PI) / 180);
          const newDistance = star.distance + star.speed;
          const newScale = 1 + newDistance / 100;

          if (
            newX < -50 ||
            newX > window.innerWidth + 50 ||
            newY < -50 ||
            newY > window.innerHeight + 50
          ) {
            return null;
          }
          return {
            ...star,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          };
        }).filter(Boolean) // Remove null values
      );
    };

    const animationFrame = requestAnimationFrame(moveShootingStars);
    return () => cancelAnimationFrame(animationFrame);
  }, [shootingStars]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoText}>Asset Maze</div>
          <div style={styles.logoIcon}></div>
        </div>
        <nav style={styles.nav}>
          <Link to="/about" style={styles.navLink}>About Us</Link>
          <Link to="/contacts" style={styles.navLink}>Contact Us</Link>
        </nav>
        <button onClick={handleNavigateToLogin} style={styles.signInButton}>Sign In</button>
      </header>

      <section style={{ ...styles.heroSection, backgroundImage: `url(${backgroundImage})` }}>
        <div style={styles.overlay}></div>
        <h1 style={styles.heroTitle}>ASSET MAZE</h1>
        <p style={styles.heroSubtitle}>Keep track with ease</p>
        <button onClick={handleNavigateToLogin} style={styles.getStartedButton}>Get Started</button>
      </section>

      <section style={styles.reviewsSection}>
        <StarsCanvas />

        {/* Twinkling stars background */}
        <div style={styles.starryBackground}>
          {twinklingStars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: star.opacity }}
              animate={{ opacity: [0.4, star.opacity, 0.4] }}
              transition={{
                duration: Math.random() * 1 + 1,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              style={{
                ...styles.star,
                top: `${star.y}%`,
                left: `${star.x}%`,
              }}
            />
          ))}

          {/* Shooting stars SVG */}
          <svg ref={svgRef} width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
            {shootingStars.map((star) => (
              <rect
                key={star.id}
                x={star.x}
                y={star.y}
                width={star.width * star.scale} // Dynamic width for thickness
                height="2"
                fill="url(#gradient)"
                transform={`rotate(${star.angle}, ${star.x + (star.width * star.scale) / 2}, ${star.y + 1})`}
              />
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#b4f2ff", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 style={styles.reviewsTitle}>Asset Maze Reviews</h2>
        <p style={styles.reviewsSubtitle}>Hear from some of our users:</p>
        <div style={styles.reviewsContainer}>
          <div style={styles.reviewCard}>
            <img src="src/assets/abdikhafar.jpg" alt="User 1" style={styles.userImage} />
            <p style={styles.reviewText}>"Epitome of smooth and seamless"</p>
            <p style={styles.reviewUser}>Abdikhafar Issack - Procurement Manager</p>
          </div>
          <div style={styles.reviewCard}>
            <img src="https://via.placeholder.com/40" alt="User 2" style={styles.userImage} />
            <p style={styles.reviewText}>"Definitely up there in asset management"</p>
            <p style={styles.reviewUser}>Kihoto Ndoria - Admin</p>
          </div>
          <div style={styles.reviewCard}>
            <img src="https://via.placeholder.com/40" alt="User 3" style={styles.userImage} />
            <p style={styles.reviewText}>"3 months in, never faltered - good"</p>
            <p style={styles.reviewUser}>Elvis Muthomi - Employee</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        {/* Footer content */}
		<div style={styles.footerTop}>
          <div style={styles.footerColumn}>
            <h4>About Asset Maze</h4>
            <p>
              Efficiently manage and track your assets with ease. Helping businesses stay organized and informed.
            </p>
            <Link to="/about" style={styles.link}>Learn More</Link>
          </div>
          <div style={styles.footerColumn}>
            <h4>Quick Links</h4>
            <ul style={styles.footerList}>
              <li><Link to="/features" style={styles.link}>Features</Link></li>
              <li><Link to="/contact" style={styles.link}>Contact</Link></li>
              <li><Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={styles.link}>Terms of Service</Link></li>
            </ul>
          </div>
          <div style={styles.footerColumn}>
            <h4>Support</h4>
            <ul style={styles.footerList}>
              <li><Link to="/help" style={styles.link}>Help Center</Link></li>
              <li><Link to="/faqs" style={styles.link}>FAQs</Link></li>
              <li><Link to="/contact-support" style={styles.link}>Contact Support</Link></li>
            </ul>
          </div>
          <div style={styles.footerColumn}>
            <h4>Connect</h4>
            <div style={styles.socialIcons}>
              <Link to="#"><img src="https://img.icons8.com/ios-filled/50/instagram-new.png" alt="Instagram" style={styles.icon} /></Link>
              <Link to="#"><img src="https://img.icons8.com/ios-filled/50/facebook.png" alt="Facebook" style={styles.icon} /></Link>
              <Link to="#"><img src="https://img.icons8.com/ios-filled/50/twitter.png" alt="Twitter" style={styles.icon} /></Link>
              <Link to="#"><img src="https://img.icons8.com/ios-filled/50/new-post.png" alt="Mail" style={styles.icon} /></Link>
              <Link to="#"><img src="https://img.icons8.com/ios-filled/50/linkedin.png" alt="LinkedIn" style={styles.icon} /></Link>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 Asset Maze. All rights reserved.</p>
          <p>Built with care to keep your assets on track.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Poppins, sans-serif', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', alignItems: 'center', position: 'fixed', width: '100%', top: 0, zIndex: 1000 },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '24px', fontWeight: 'bold', color: '#A5D6A7' },
  nav: { display: 'flex', gap: '20px' },
  navLink: { color: 'white', textDecoration: 'none', fontSize: '18px', cursor: 'pointer' },
  signInButton: { backgroundColor: 'white', color: '#008B8B', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', border: 'none', marginRight: '60px' },
  heroSection: { position: 'relative', textAlign: 'center', padding: '150px 20px', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 },
  heroTitle: { fontSize: '56px', color: '#A5D6A7', fontWeight: 'bold', position: 'relative', zIndex: 2 },
  heroSubtitle: { fontSize: '24px', color: '#B0BEC5', marginBottom: '20px', position: 'relative', zIndex: 2 },
  getStartedButton: { marginTop: '20px', padding: '15px 30px', backgroundColor: '#008B8B', color: 'white', fontSize: '18px', borderRadius: '5px', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 2 },
  reviewsSection: { position: 'relative', padding: '0px 0px', backgroundColor: '#0B1120', color: '#333', overflow: 'hidden'  },
  starryBackground: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' },
  star: { position: 'absolute', width: '2px', height: '2px', backgroundColor: 'white', borderRadius: '50%' },
  reviewsTitle: { textAlign: 'center', fontSize: '32px', fontWeight: 'bold', color: '#A5D6A7' },
  reviewsSubtitle: { textAlign: 'center', marginBottom: '20px', color: '#A5D6A7' },
  reviewsContainer: { display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '10px', paddingTop: '-500px' },
  reviewCard: { width: '250px', padding: '20px', backgroundColor: '#fff', color: '#004C7A', borderRadius: '8px', textAlign: 'center', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' },
  userImage: { borderRadius: '50%', width: '40px', height: '40px', marginBottom: '10px' },
  reviewText: { fontSize: '16px', marginBottom: '5px' },
  reviewUser: { fontSize: '14px', color: '#666' },
  footer: {
    padding: '60px 20px 30px',
    background: 'linear-gradient(to right, #00093c, #2d0b00)',
    color: 'white',
    borderTopLeftRadius: '125px',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingBottom: '20px',
    borderBottom: '1px solid #555',
  },
  footerBottom: {
    marginTop: '20px',
    fontSize: '13px',
    textAlign: 'center',
    color: '#A5D6A7',
  },
  footerColumn: {
    width: '22%',
    minWidth: '200px',
    marginBottom: '20px',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    color: '#ccc',
    lineHeight: '1.8',
  },
  link: {
    color: '#A5D6A7',
    textDecoration: 'none',
  },
  socialIcons: {
    display: 'flex', gap: '10px', marginTop: '10px',
  },
  icon: {
    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fff', color: '#2B0B02',
    padding: '5px', transition: 'background 0.3s, color 0.3s',
  },
};

export default HomePage;
