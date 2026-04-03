import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--youtube-black)', color: 'white', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      <div style={{ flex: 1, maxWidth: '800px', margin: '6rem auto', padding: '0 2rem' }} className="fade-in">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-2px' }}>TERMS OF <span style={{ color: 'var(--youtube-red)' }}>USE.</span></h1>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>01. CREATIVE LICENSE</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            Creators retain 100% of the commercial ownership of all thumbnails generated via PromptVision. Our engine provides a perpetual, worldwide, Royalty-free license for use across YouTube and other social platforms.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>02. USAGE POLICIES</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            Users are solely responsible for ensuring that their prompts and generated content adhere to standard social media community guidelines. Misuse of the Studio to generate prohibited or harmful content will result in immediate session termination.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>03. STUDIO ACCESS</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            PromptVision is a professional-tier creative platform. System availability is maintained at 99.9% but is subject to individual infrastructure status and provider performance.
          </p>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Terms;
