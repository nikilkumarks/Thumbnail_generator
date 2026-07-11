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

const Security = () => (
  <LegalPage title="STUDIO" accent="SECURITY.">
    <section>
      <h2>01. ACCOUNT HARNESSING</h2>
      <p>We utilize high-fidelity JWT authentication combined with Secure Google OAuth 2.0. This ensures that only you can access your private creative history and generation models.</p>
    </section>
    <section>
      <h2>02. ENGINE SAFETY</h2>
      <p>PromptVision is protected by advanced AI safety filters powered by Cohere Command-R. Every request is scrubbed for malicious intent or sensitive data before hitting our high-performance GPU nodes.</p>
    </section>
    <section>
      <h2>03. GLOBAL REDUNDANCY</h2>
      <p>Our infrastructure is distributed across professional-grade data centers with 24/7 technical monitoring. In the event of an outage, our redundant node architecture ensures your creativeness is never lost.</p>
    </section>
  </LegalPage>
);

export default Security;
