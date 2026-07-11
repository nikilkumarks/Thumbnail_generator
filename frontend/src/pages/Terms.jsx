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

const Terms = () => (
  <LegalPage title="TERMS OF" accent="USE.">
    <section>
      <h2>01. CREATIVE LICENSE</h2>
      <p>Creators retain 100% of the commercial ownership of all thumbnails generated via PromptVision. Our engine provides a perpetual, worldwide, Royalty-free license for use across YouTube and other social platforms.</p>
    </section>
    <section>
      <h2>02. USAGE POLICIES</h2>
      <p>Users are solely responsible for ensuring that their prompts and generated content adhere to standard social media community guidelines. Misuse of the Studio to generate prohibited or harmful content will result in immediate session termination.</p>
    </section>
    <section>
      <h2>03. STUDIO ACCESS</h2>
      <p>PromptVision is a professional-tier creative platform. System availability is maintained at 99.9% but is subject to individual infrastructure status and provider performance.</p>
    </section>
  </LegalPage>
);

export default Terms;
