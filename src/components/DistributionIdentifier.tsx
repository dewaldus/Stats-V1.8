import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DistributionIdentifier({ onSelect }: { onSelect: (dist: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string, nextStep: number | string) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (typeof nextStep === 'string') {
      onSelect(nextStep);
    } else {
      setStep(nextStep);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const QuestionCard = ({ title, description, options }: { title: string, description?: string, options: { label: string, sub: string, next: number | string }[] }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-stone-800 dark:text-white tracking-tight">{title}</h3>
        {description && <p className="text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(`q${step}`, opt.label, opt.next)}
            className="group text-left p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-stone-800 dark:text-stone-200 text-lg">{opt.label}</div>
              <div className="text-sm text-stone-500 dark:text-stone-500 mt-1">{opt.sub}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-indigo-500 transition-colors" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">
          Distribution Identifier
        </h2>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2, 4].map((s, i) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step === s ? "w-8 bg-indigo-500" : i < [0, 1, 2, 4].indexOf(step) ? "w-4 bg-indigo-200 dark:bg-indigo-900" : "w-4 bg-stone-200 dark:bg-stone-800"
              }`} 
            />
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <QuestionCard 
              title="What type of data are you working with?"
              options={[
                { label: "Discrete (Countable)", sub: "e.g., number of students, cars, defects", next: 1 },
                { label: "Continuous (Measurable)", sub: "e.g., time, weight, distance, money", next: 4 }
              ]}
            />
          )}

          {step === 1 && (
            <QuestionCard 
              title="Are you counting successes in a fixed number of trials?"
              options={[
                { label: "Yes", sub: "e.g., 5 out of 20 students", next: 2 },
                { label: "No", sub: "Counting occurrences over an interval (time, space)", next: 3 }
              ]}
            />
          )}

          {step === 2 && (
            <QuestionCard 
              title="Are the trials independent?"
              description="Or is the population very large compared to the sample?"
              options={[
                { label: "Yes (Independent)", sub: "Probability of success stays the same", next: 'binomial' },
                { label: "No (Dependent)", sub: "Sampling from a small population without replacement", next: 'hypergeometric' }
              ]}
            />
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl text-emerald-800 dark:text-emerald-300 shadow-xl shadow-emerald-500/5"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black mb-3 tracking-tight">Poisson Distribution</h3>
              <p className="text-lg opacity-80 leading-relaxed">
                Used for counting the number of occurrences of an event over a given interval of time or space.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('poisson')} 
                className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                Go to Poisson Calculator
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 4 && (
            <QuestionCard 
              title="What is the shape of the distribution?"
              options={[
                { label: "Equally likely chance", sub: "Flat, rectangular shape within a range", next: 'uniform' },
                { label: "Bell-shaped and symmetric", sub: "Clustered around the mean", next: 'normal' }
              ]}
            />
          )}
        </AnimatePresence>
      </div>

      {step > 0 && step !== 3 && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={reset} 
          className="mt-12 mx-auto flex items-center gap-2 text-sm text-stone-400 dark:text-stone-600 hover:text-stone-800 dark:hover:text-stone-300 font-bold uppercase tracking-widest transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      )}
    </div>
  );
}

