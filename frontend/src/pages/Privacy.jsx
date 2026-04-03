import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--youtube-black)', color: 'white', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />
      <div style={{ flex: 1, maxWidth: '800px', margin: '6rem auto', padding: '0 2rem' }} className="fade-in">
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-2px' }}>PRIVACY <span style={{ color: 'var(--youtube-red)' }}>POLICY.</span></h1>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>01. DATA COLLECTION</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            PromptVision collects only essential data required to provide our AI generation services. This includes your Prompt history, account credentials, and Google OAuth identifiers. We do not sell or share your creative data with third parties.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>02. ENCRYPTION PROTOCOLS</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            All generational handshakes are protected by industry-standard SSL encryption. Your creative assets are stored in secure cloud environments with multi-layered access controls.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#888' }}>03. AI MODEL TRAINING</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
            User-generated prompts are used solely for the fulfillment of individual requests. We do not use your private creative visions to train public foundation models without explicit consent.
          </p>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Privacy;
