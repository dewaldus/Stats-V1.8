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
import { HelpCircle, Calculator, BrainCircuit, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('identifier');
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {(() => {
          switch (activeTab) {
            case 'identifier': return <DistributionIdentifier onSelect={setActiveTab} />;
            case 'normal': return <NormalCalculator />;
            case 'uniform': return <UniformCalculator />;
            case 'binomial': return <BinomialCalculator />;
            case 'poisson': return <PoissonCalculator />;
            case 'hypergeometric': return <HypergeometricCalculator />;
            case 'bayes': return <BayesCalculator />;
            default: return <DistributionIdentifier onSelect={setActiveTab} />;
          }
        })()}
      </motion.div>
    );
  };

  const NavButton = ({ id, icon: Icon, label, color = "indigo" }: { id: string, icon: any, label: string, color?: string }) => {
    const isActive = activeTab === id;
    const activeClasses = {
      indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    }[color as "indigo" | "amber"];

    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab(id)}
        aria-current={isActive ? "page" : undefined}
        aria-label={label}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive ? activeClasses : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} aria-hidden="true" />
        {label}
        {isActive && (
          <motion.div
            layoutId="active-nav"
            className={`ml-auto w-1.5 h-1.5 rounded-full ${color === "indigo" ? "bg-indigo-500" : "bg-amber-500"}`}
            aria-hidden="true"
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col sticky top-0 h-screen z-20" aria-label="Application sidebar">
        <div className="p-8 border-b border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-stone-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20" aria-hidden="true">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              ProbCalc
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-1">
              Advanced Statistics Engine
            </p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto" aria-label="Main navigation">
          <div className="space-y-1">
            <NavButton id="identifier" icon={HelpCircle} label="Distribution Identifier" />
          </div>

          <div className="space-y-3">
            <p className="px-3 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em]" aria-hidden="true">Advanced</p>
            <NavButton id="bayes" icon={BrainCircuit} label="Bayes' Theorem" color="amber" />
          </div>

          <div className="space-y-3">
            <p className="px-3 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em]" aria-hidden="true">Continuous</p>
            <div className="space-y-1">
              <NavButton id="normal" icon={LayoutDashboard} label="Normal Distribution" />
              <NavButton id="uniform" icon={LayoutDashboard} label="Uniform Distribution" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="px-3 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em]" aria-hidden="true">Discrete</p>
            <div className="space-y-1">
              <NavButton id="binomial" icon={LayoutDashboard} label="Binomial Distribution" />
              <NavButton id="poisson" icon={LayoutDashboard} label="Poisson Distribution" />
              <NavButton id="hypergeometric" icon={LayoutDashboard} label="Hypergeometric" />
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-stone-100 dark:border-stone-800/50 bg-stone-50/50 dark:bg-stone-900/50">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-pressed={isDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <span className="text-sm font-semibold text-stone-600 dark:text-stone-300" aria-hidden="true">
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <div className="w-10 h-6 bg-stone-100 dark:bg-stone-700 rounded-full p-1 relative transition-colors duration-300" aria-hidden="true">
              <motion.div
                animate={{ x: isDarkMode ? 16 : 0 }}
                className="w-4 h-4 bg-white dark:bg-indigo-400 rounded-full shadow-sm flex items-center justify-center"
              >
                {isDarkMode ? <Moon className="w-2.5 h-2.5 text-indigo-900" aria-hidden="true" /> : <Sun className="w-2.5 h-2.5 text-amber-500" aria-hidden="true" />}
              </motion.div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-auto relative" aria-label="Calculator content" tabIndex={-1}>
        <div className="max-w-7xl mx-auto p-8 lg:p-12 min-h-screen">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
        
        {/* Background Accents */}
        <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-72 -z-10 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
}

