// src/pages/AboutPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/office.jpg'; // Adjust path as needed

function AboutPage() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* Dark overlay for contrast */}
      <h1 style={styles.heading}>About Asset Maze</h1>

      <section style={styles.section}>
        <h2 style={styles.subheading}>The Story of Asset Maze</h2>
        <p style={styles.paragraph}>
          In the fast-paced world of business, assets are the backbone that keeps operations running smoothly. Whether it's a piece of machinery in a factory, a fleet of vehicles in a logistics company, or digital assets powering a tech firm, the effective management of these resources is crucial. However, as businesses grow, so does the complexity of managing and tracking these assets. Enter <strong>Asset Maze</strong>—a revolutionary solution designed to bring simplicity and efficiency to asset management.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>Our Beginnings</h2>
        <p style={styles.paragraph}>
          The idea for Asset Maze was born out of a common frustration shared by business owners and operations managers alike: keeping track of assets was becoming increasingly challenging. Traditional methods, like spreadsheets or paper records, were not only time-consuming but also prone to errors. Data was scattered, often outdated, and difficult to retrieve when needed most. Seeing this problem firsthand, our founders—who come from backgrounds in technology, finance, and logistics—decided it was time to build a solution that could transform asset management.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>Our Vision</h2>
        <p style={styles.paragraph}>
          At Asset Maze, we believe that businesses should spend less time tracking assets and more time leveraging them for growth. Our vision is to provide a streamlined, intuitive platform where companies can easily monitor, organize, and optimize their resources. We aim to turn asset management from a tedious, error-prone task into a seamless experience, helping companies stay organized, reduce losses, and make data-driven decisions.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>What We Do</h2>
        <p style={styles.paragraph}>
          Asset Maze offers a comprehensive yet easy-to-use platform for tracking a wide range of assets. Whether it’s physical equipment, vehicles, inventory, or digital resources, our platform provides tools to monitor and manage assets across their entire lifecycle—from acquisition to maintenance to disposal. Key features include real-time asset tracking, automated maintenance alerts, and insightful reporting, allowing businesses to stay informed about the health, location, and performance of their assets at all times.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>Why We’re Different</h2>
        <p style={styles.paragraph}>
          Unlike other asset management systems, Asset Maze is designed with user-friendliness in mind. Our interface is intuitive and requires no specialized training, meaning team members can quickly learn and start using the system with minimal onboarding. Asset Maze is also customizable, allowing businesses to tailor the platform to their unique needs and industry requirements. And with our cloud-based approach, Asset Maze provides secure, accessible, and scalable solutions for businesses of all sizes.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>Our Impact</h2>
        <p style={styles.paragraph}>
          Since its launch, Asset Maze has helped countless businesses reduce downtime, avoid costly repairs, and maintain a high level of organization. By enabling better asset visibility and control, we empower our clients to make smarter decisions that directly impact their bottom line. Companies using Asset Maze have reported increased efficiency, reduced waste, and a significant decrease in asset-related expenses.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheading}>Looking Ahead</h2>
        <p style={styles.paragraph}>
          Asset Maze is committed to continuous innovation. We are constantly improving our platform, adding new features based on feedback from our users, and leveraging the latest technologies to stay ahead of industry trends. Our team is dedicated to ensuring that Asset Maze remains the go-to solution for businesses seeking an efficient, reliable way to manage their assets.
        </p>
      </section>

      <p style={styles.footerText}>
        Asset Maze isn't just about software—it's about creating a more organized, efficient world where businesses can thrive without the burden of asset mismanagement. Join us on this journey, and discover how Asset Maze can transform the way you manage and grow your assets.
      </p>

      {/* Back to Home Button */}
      <button onClick={handleBackToHome} style={styles.backButton}>Back to Home</button>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    padding: '20px',
    maxWidth: '100%',
    minHeight: '100vh',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#ECF0F1',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for readability
    zIndex: 1,
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#A5D6A7',
    zIndex: 2,
    position: 'relative',
  },
  section: {
    marginBottom: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for text sections
    padding: '20px',
    borderRadius: '8px',
    zIndex: 2,
    position: 'relative',
  },
  subheading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#B0BEC5',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#ECF0F1',
  },
  footerText: {
    fontSize: '18px',
    lineHeight: '1.6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '30px',
    color: '#ECF0F1',
    zIndex: 2,
    position: 'relative',
  },
  backButton: {
    display: 'block',
    margin: '30px auto 0',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#004C7A',
    backgroundColor: '#A5D6A7',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 2,
    position: 'relative',
  },
};

export default AboutPage;
