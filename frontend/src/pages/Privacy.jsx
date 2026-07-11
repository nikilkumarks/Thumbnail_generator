import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const LegalPage = ({ title, accent, children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="page-bg page-scroll auth-locked-dark">
    <Navbar />
    <main className="legal-page fade-in">
      <h1 className="text-display text-gradient" style={{ marginBottom: 'var(--space-8)' }}>
        {title} <span className="text-accent">{accent}</span>
      </h1>
      {children}
    </main>
    <Footer />
  </motion.div>
);

const Privacy = () => (
  <LegalPage title="PRIVACY" accent="POLICY.">
    <section>
      <h2>01. DATA COLLECTION</h2>
      <p>PromptVision collects only essential data required to provide our AI generation services. This includes your Prompt history, account credentials, and Google OAuth identifiers. We do not sell or share your creative data with third parties.</p>
    </section>
    <section>
      <h2>02. ENCRYPTION PROTOCOLS</h2>
      <p>All generational handshakes are protected by industry-standard SSL encryption. Your creative assets are stored in secure cloud environments with multi-layered access controls.</p>
    </section>
    <section>
      <h2>03. AI MODEL TRAINING</h2>
      <p>User-generated prompts are used solely for the fulfillment of individual requests. We do not use your private creative visions to train public foundation models without explicit consent.</p>
    </section>
  </LegalPage>
);

export default Privacy;
