/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DistributionIdentifier } from './components/DistributionIdentifier';
import { NormalCalculator } from './components/NormalCalculator';
import { UniformCalculator } from './components/UniformCalculator';
import { BinomialCalculator } from './components/BinomialCalculator';
import { PoissonCalculator } from './components/PoissonCalculator';
import { HypergeometricCalculator } from './components/HypergeometricCalculator';
import { BayesCalculator } from './components/BayesCalculator';
import {
  HelpCircle,
  Calculator,
  BrainCircuit,
  Moon,
  Sun,
  LayoutDashboard,
  Binary,
  Waves,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navSections = [
  {
    title: 'Guidance',
    items: [
      { id: 'identifier', label: 'Distribution Identifier', icon: HelpCircle, color: 'indigo' as const, accent: 'Guide' },
    ],
  },
  {
    title: 'Continuous',
    items: [
      { id: 'normal', label: 'Normal Distribution', icon: Waves, color: 'indigo' as const, accent: 'Bell curve' },
      { id: 'uniform', label: 'Uniform Distribution', icon: LayoutDashboard, color: 'indigo' as const, accent: 'Flat range' },
    ],
  },
  {
    title: 'Discrete',
    items: [
      { id: 'binomial', label: 'Binomial Distribution', icon: Binary, color: 'indigo' as const, accent: 'Fixed trials' },
      { id: 'poisson', label: 'Poisson Distribution', icon: Sparkles, color: 'indigo' as const, accent: 'Event rate' },
      { id: 'hypergeometric', label: 'Hypergeometric', icon: LayoutDashboard, color: 'indigo' as const, accent: 'No replacement' },
    ],
  },
  {
    title: 'Inference',
    items: [
      { id: 'bayes', label: "Bayes' Theorem", icon: BrainCircuit, color: 'amber' as const, accent: 'Conditional logic' },
    ],
  },
];

const viewMeta = {
  identifier: {
    eyebrow: 'Decision Assistant',
    title: 'Find the right model before you calculate.',
    description:
      'Answer a few plain-language prompts and jump directly into the probability distribution that fits your data.',
    metricLabel: 'Workflow',
    metricValue: 'Guided',
  },
  normal: {
    eyebrow: 'Continuous Analysis',
    title: 'Inspect bell-curve behavior with immediate probability feedback.',
    description:
      'Tune the mean, spread, and interval conditions while the distribution chart updates as a live analytical surface.',
    metricLabel: 'Model',
    metricValue: 'Gaussian',
  },
  uniform: {
    eyebrow: 'Continuous Analysis',
    title: 'Measure equal-probability ranges with cleaner interval controls.',
    description: 'Use the uniform calculator when every value in a bounded range has the same likelihood.',
    metricLabel: 'Model',
    metricValue: 'Uniform',
  },
  binomial: {
    eyebrow: 'Discrete Analysis',
    title: 'Evaluate fixed-trial outcomes without losing context.',
    description:
      'Move from exact events to cumulative ranges while keeping the result, chart, and assumptions in view.',
    metricLabel: 'Model',
    metricValue: 'Trials',
  },
  poisson: {
    eyebrow: 'Discrete Analysis',
    title: 'Track event frequencies across time or space.',
    description: 'Use Poisson reasoning for arrivals, incidents, and occurrence counts over a known interval.',
    metricLabel: 'Model',
    metricValue: 'Rate',
  },
  hypergeometric: {
    eyebrow: 'Discrete Analysis',
    title: 'Handle no-replacement sampling with more confidence.',
    description:
      'Designed for finite populations where each draw changes the odds of the next result.',
    metricLabel: 'Model',
    metricValue: 'Finite set',
  },
  bayes: {
    eyebrow: 'Inference Studio',
    title: 'Solve conditional probability relationships from partial information.',
    description:
      'Map known percentages and let the engine infer complementary, joint, conditional, and union probabilities.',
    metricLabel: 'Model',
    metricValue: 'Bayesian',
  },
} as const;

type ViewKey = keyof typeof viewMeta;

type NavButtonProps = {
  id: ViewKey;
  icon: any;
  label: string;
  color?: 'indigo' | 'amber';
  accent: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewKey>('identifier');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full"
      >
        {(() => {
          switch (activeTab) {
            case 'identifier':
              return <DistributionIdentifier onSelect={(dist) => setActiveTab(dist as ViewKey)} />;
            case 'normal':
              return <NormalCalculator />;
            case 'uniform':
              return <UniformCalculator />;
            case 'binomial':
              return <BinomialCalculator />;
            case 'poisson':
              return <PoissonCalculator />;
            case 'hypergeometric':
              return <HypergeometricCalculator />;
            case 'bayes':
              return <BayesCalculator />;
            default:
              return <DistributionIdentifier onSelect={(dist) => setActiveTab(dist as ViewKey)} />;
          }
        })()}
      </motion.div>
    );
  };

  const activeView = viewMeta[activeTab];

  const NavButton = ({ id, icon: Icon, label, color = 'indigo', accent }: NavButtonProps) => {
    const isActive = activeTab === id;
    const activeClasses = {
      indigo: 'app-nav-button-active',
      amber: 'app-nav-button-active app-nav-button-active-amber',
    }[color];

    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab(id)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={label}
        className={`app-nav-button ${isActive ? activeClasses : ''}`}
      >
        <div className={`app-nav-icon ${isActive ? 'app-nav-icon-active' : ''}`}>
          <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} aria-hidden="true" />
        </div>
        <div className="min-w-0 text-left">
          <div className="truncate text-sm font-semibold">{label}</div>
          <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{accent}</div>
        </div>
        {isActive && (
          <motion.div
            layoutId="active-nav"
            className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full ${
              color === 'indigo'
                ? 'bg-[var(--app-primary)]/12 text-[var(--app-primary)]'
                : 'bg-[var(--app-accent)]/18 text-[var(--app-accent)]'
            }`}
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4" />
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="app-shell min-h-screen text-slate-950 dark:text-slate-50">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-3 md:p-4 lg:flex-row lg:p-5">
        <aside
          className="app-panel relative w-full overflow-hidden lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-[22rem] lg:flex-shrink-0"
          aria-label="Application sidebar"
        >
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20" />
          <div className="flex h-full flex-col">
            <div className="border-b border-[var(--app-border)] px-5 pb-5 pt-6 md:px-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="app-kicker">Probability Workspace</span>
                  <h1 className="mt-3 flex items-center gap-3 text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--app-primary),#60a5fa)] text-white shadow-[0_18px_40px_rgba(30,64,175,0.28)]"
                      aria-hidden="true"
                    >
                      <Calculator className="h-5 w-5" aria-hidden="true" />
                    </span>
                    Stats V1.8
                  </h1>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
                    A sharper interface for exploring distributions, intervals, and conditional reasoning.
                  </p>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  aria-pressed={isDarkMode}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="app-theme-toggle"
                >
                  {isDarkMode ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="app-stat-card">
                  <span className="app-stat-label">Views</span>
                  <span className="app-stat-value">7</span>
                </div>
                <div className="app-stat-card">
                  <span className="app-stat-label">Theme</span>
                  <span className="app-stat-value">{isDarkMode ? 'Dark' : 'Light'}</span>
                </div>
                <div className="app-stat-card">
                  <span className="app-stat-label">Style</span>
                  <span className="app-stat-value">Data UI</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5 md:px-5" aria-label="Main navigation">
              {navSections.map((section) => (
                <section key={section.title} className="space-y-3">
                  <p className="px-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500" aria-hidden="true">
                    {section.title}
                  </p>
                  <div className="grid gap-2">
                    {section.items.map((item) => (
                      <React.Fragment key={item.id}>
                        <NavButton
                          id={item.id as ViewKey}
                          icon={item.icon}
                          label={item.label}
                          color={item.color}
                          accent={item.accent}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </section>
              ))}
            </nav>

            <div className="border-t border-[var(--app-border)] bg-white/55 px-5 py-4 backdrop-blur-sm dark:bg-slate-950/35 md:px-6">
              <div className="rounded-[1.5rem] border border-[var(--app-border-strong)] bg-[var(--app-panel-strong)] p-4">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Current focus</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{activeView.metricLabel}</div>
                <div className="mt-1 text-lg font-black tracking-[-0.03em] text-[var(--app-primary)]">{activeView.metricValue}</div>
              </div>
            </div>
          </div>
        </aside>

        <main id="main-content" className="relative min-w-0 flex-1" aria-label="Calculator content" tabIndex={-1}>
          <div className="space-y-5">
            <section className="app-panel relative overflow-hidden px-5 py-6 md:px-8 md:py-8">
              <div className="app-grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <span className="app-kicker">{activeView.eyebrow}</span>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-950 dark:text-white md:text-5xl">
                    {activeView.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                    {activeView.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[28rem]">
                  <div className="app-hero-card">
                    <span className="app-stat-label">Category</span>
                    <span className="app-hero-value">{activeView.eyebrow.split(' ')[0]}</span>
                  </div>
                  <div className="app-hero-card">
                    <span className="app-stat-label">Mode</span>
                    <span className="app-hero-value">{isDarkMode ? 'Low light' : 'Daylight'}</span>
                  </div>
                  <div className="app-hero-card">
                    <span className="app-stat-label">Engine</span>
                    <span className="app-hero-value">Interactive</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="relative">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>
          </div>

          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute left-[-8rem] top-[12rem] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_68%)] blur-2xl" />
            <div className="absolute right-[5%] top-[6rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.14),transparent_70%)] blur-3xl" />
            <div className="absolute bottom-[-6rem] left-[35%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.14),transparent_72%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_72%)]" />
          </div>
        </main>
      </div>
    </div>
  );
}
