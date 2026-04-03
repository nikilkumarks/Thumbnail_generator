import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Security = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--youtube-black)', color: 'white', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      <div style={{ flex: 1, maxWidth: '800px', margin: '6rem auto', padding: '0 2rem' }} className="fade-in">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-2px' }}>STUDIO <span style={{ color: 'var(--youtube-red)' }}>SECURITY.</span></h1>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>01. ACCOUNT HARNESSING</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            We utilize high-fidelity JWT authentication combined with Secure Google OAuth 2.0. This ensures that only you can access your private creative history and generation models.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>02. ENGINE SAFETY</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            PromptVision is protected by advanced AI safety filters powered by Cohere Command-R. Every request is scrubbed for malicious intent or sensitive data before hitting our high-performance GPU nodes.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>03. GLOBAL REDUNDANCY</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            Our infrastructure is distributed across professional-grade data centers with 24/7 technical monitoring. In the event of an outage, our redundant node architecture ensures your creativeness is never lost.
          </p>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Security;
