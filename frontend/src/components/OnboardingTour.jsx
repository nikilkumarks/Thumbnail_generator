import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { target: 'studio-hero', title: 'Creative packs', body: 'Start with a preset pack or type your own idea in the input below.' },
  { target: 'studio-input', title: 'Describe & generate', body: 'Write your vision, pick a size preset, and hit send. Use Shift+Enter for a new line.' },
  { target: 'studio-upload', title: 'Reference upload', body: 'Attach a reference image so the AI matches its style and composition.' },
  { target: 'studio-tools', title: 'Prompt tools', body: 'Fine-tune mood, style, and text overlay before generating.' },
];

const OnboardingTour = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const finish = () => {
    localStorage.setItem('pv-onboarding-done', '1');
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="onboarding-overlay">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="onboarding-card"
        >
          <button type="button" className="onboarding-skip" onClick={finish}>Skip tour</button>
          <p className="text-caption" style={{ marginBottom: 'var(--space-2)' }}>Step {step + 1} of {STEPS.length}</p>
          <h3 className="text-h3" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>{current.title}</h3>
          <p className="text-body-sm" style={{ marginBottom: 'var(--space-6)' }}>{current.body}</p>
          <div className="onboarding-actions">
            {step > 0 && (
              <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={finish}>Get started</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const shouldShowOnboarding = () => !localStorage.getItem('pv-onboarding-done');

export default OnboardingTour;
