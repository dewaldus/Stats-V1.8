import React, { useState, useMemo } from 'react';
import { Info, Calculator, RotateCcw, ArrowRight, Share2, Download, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

const EPSILON = 1e-7;

type ProbKeys = 
  | 'pA' | 'pB' | 'pAc' | 'pBc'
  | 'pA_B' | 'pA_Bc' | 'pAc_B' | 'pAc_Bc'
  | 'pB_A' | 'pBc_A' | 'pB_Ac' | 'pBc_Ac'
  | 'pA_and_B' | 'pA_and_Bc' | 'pAc_and_B' | 'pAc_and_Bc'
  | 'pA_or_B' | 'pA_or_Bc' | 'pAc_or_B' | 'pAc_or_Bc';

const ALL_KEYS: ProbKeys[] = [
  'pA', 'pB', 'pAc', 'pBc',
  'pA_B', 'pA_Bc', 'pAc_B', 'pAc_Bc',
  'pB_A', 'pBc_A', 'pB_Ac', 'pBc_Ac',
  'pA_and_B', 'pA_and_Bc', 'pAc_and_B', 'pAc_and_Bc',
  'pA_or_B', 'pA_or_Bc', 'pAc_or_B', 'pAc_or_Bc'
];

function solveProbabilities(inputs: Record<ProbKeys, number | null>) {
  let v = { ...inputs };
  
  const set = (key: ProbKeys, val: number) => {
    if (v[key] === null) {
      v[key] = Math.max(0, Math.min(1, val));
      return true;
    }
    return false;
  };

  for (let i = 0; i < 20; i++) {
    let changed = false;

    // Complements
    if (v.pA !== null) changed = set('pAc', 1 - v.pA) || changed;
    if (v.pAc !== null) changed = set('pA', 1 - v.pAc) || changed;
    if (v.pB !== null) changed = set('pBc', 1 - v.pB) || changed;
    if (v.pBc !== null) changed = set('pB', 1 - v.pBc) || changed;
    
    if (v.pA_B !== null) changed = set('pAc_B', 1 - v.pA_B) || changed;
    if (v.pAc_B !== null) changed = set('pA_B', 1 - v.pAc_B) || changed;
    
    if (v.pA_Bc !== null) changed = set('pAc_Bc', 1 - v.pA_Bc) || changed;
    if (v.pAc_Bc !== null) changed = set('pA_Bc', 1 - v.pAc_Bc) || changed;
    
    if (v.pB_A !== null) changed = set('pBc_A', 1 - v.pB_A) || changed;
    if (v.pBc_A !== null) changed = set('pB_A', 1 - v.pBc_A) || changed;
    
    if (v.pB_Ac !== null) changed = set('pBc_Ac', 1 - v.pB_Ac) || changed;
    if (v.pBc_Ac !== null) changed = set('pB_Ac', 1 - v.pBc_Ac) || changed;

    // Joints from conditionals
    if (v.pA_B !== null && v.pB !== null) changed = set('pA_and_B', v.pA_B * v.pB) || changed;
    if (v.pB_A !== null && v.pA !== null) changed = set('pA_and_B', v.pB_A * v.pA) || changed;
    
    if (v.pA_Bc !== null && v.pBc !== null) changed = set('pA_and_Bc', v.pA_Bc * v.pBc) || changed;
    if (v.pBc_A !== null && v.pA !== null) changed = set('pA_and_Bc', v.pBc_A * v.pA) || changed;
    
    if (v.pAc_B !== null && v.pB !== null) changed = set('pAc_and_B', v.pAc_B * v.pB) || changed;
    if (v.pB_Ac !== null && v.pAc !== null) changed = set('pAc_and_B', v.pB_Ac * v.pAc) || changed;
    
    if (v.pAc_Bc !== null && v.pBc !== null) changed = set('pAc_and_Bc', v.pAc_Bc * v.pBc) || changed;
    if (v.pBc_Ac !== null && v.pAc !== null) changed = set('pAc_and_Bc', v.pBc_Ac * v.pAc) || changed;

    // Conditionals from joints
    if (v.pA_and_B !== null) {
      if (v.pB !== null && v.pB > EPSILON) changed = set('pA_B', v.pA_and_B / v.pB) || changed;
      if (v.pA !== null && v.pA > EPSILON) changed = set('pB_A', v.pA_and_B / v.pA) || changed;
    }
    if (v.pA_and_Bc !== null) {
      if (v.pBc !== null && v.pBc > EPSILON) changed = set('pA_Bc', v.pA_and_Bc / v.pBc) || changed;
      if (v.pA !== null && v.pA > EPSILON) changed = set('pBc_A', v.pA_and_Bc / v.pA) || changed;
    }
    if (v.pAc_and_B !== null) {
      if (v.pB !== null && v.pB > EPSILON) changed = set('pAc_B', v.pAc_and_B / v.pB) || changed;
      if (v.pAc !== null && v.pAc > EPSILON) changed = set('pB_Ac', v.pAc_and_B / v.pAc) || changed;
    }
    if (v.pAc_and_Bc !== null) {
      if (v.pBc !== null && v.pBc > EPSILON) changed = set('pAc_Bc', v.pAc_and_Bc / v.pBc) || changed;
      if (v.pAc !== null && v.pAc > EPSILON) changed = set('pBc_Ac', v.pAc_and_Bc / v.pAc) || changed;
    }

    // Marginals from joints
    if (v.pA_and_B !== null && v.pA_and_Bc !== null) changed = set('pA', v.pA_and_B + v.pA_and_Bc) || changed;
    if (v.pAc_and_B !== null && v.pAc_and_Bc !== null) changed = set('pAc', v.pAc_and_B + v.pAc_and_Bc) || changed;
    if (v.pA_and_B !== null && v.pAc_and_B !== null) changed = set('pB', v.pA_and_B + v.pAc_and_B) || changed;
    if (v.pA_and_Bc !== null && v.pAc_and_Bc !== null) changed = set('pBc', v.pA_and_Bc + v.pAc_and_Bc) || changed;

    // Joints from marginals and other joints
    if (v.pA !== null && v.pA_and_Bc !== null) changed = set('pA_and_B', v.pA - v.pA_and_Bc) || changed;
    if (v.pB !== null && v.pAc_and_B !== null) changed = set('pA_and_B', v.pB - v.pAc_and_B) || changed;
    
    if (v.pA !== null && v.pA_and_B !== null) changed = set('pA_and_Bc', v.pA - v.pA_and_B) || changed;
    if (v.pBc !== null && v.pAc_and_Bc !== null) changed = set('pA_and_Bc', v.pBc - v.pAc_and_Bc) || changed;
    
    if (v.pB !== null && v.pA_and_B !== null) changed = set('pAc_and_B', v.pB - v.pA_and_B) || changed;
    if (v.pAc !== null && v.pAc_and_Bc !== null) changed = set('pAc_and_B', v.pAc - v.pAc_and_Bc) || changed;
    
    if (v.pBc !== null && v.pA_and_Bc !== null) changed = set('pAc_and_Bc', v.pBc - v.pA_and_Bc) || changed;
    if (v.pAc !== null && v.pAc_and_B !== null) changed = set('pAc_and_Bc', v.pAc - v.pAc_and_B) || changed;

    // Unions
    if (v.pA !== null && v.pB !== null && v.pA_and_B !== null) changed = set('pA_or_B', v.pA + v.pB - v.pA_and_B) || changed;
    if (v.pAc_and_Bc !== null) changed = set('pA_or_B', 1 - v.pAc_and_Bc) || changed;
    
    if (v.pA !== null && v.pBc !== null && v.pA_and_Bc !== null) changed = set('pA_or_Bc', v.pA + v.pBc - v.pA_and_Bc) || changed;
    if (v.pAc_and_B !== null) changed = set('pA_or_Bc', 1 - v.pAc_and_B) || changed;
    
    if (v.pAc !== null && v.pB !== null && v.pAc_and_B !== null) changed = set('pAc_or_B', v.pAc + v.pB - v.pAc_and_B) || changed;
    if (v.pA_and_Bc !== null) changed = set('pAc_or_B', 1 - v.pA_and_Bc) || changed;
    
    if (v.pAc !== null && v.pBc !== null && v.pAc_and_Bc !== null) changed = set('pAc_or_Bc', v.pAc + v.pBc - v.pAc_and_Bc) || changed;
    if (v.pA_and_B !== null) changed = set('pAc_or_Bc', 1 - v.pA_and_B) || changed;

    // Joints from Unions
    if (v.pA_or_B !== null) {
      changed = set('pAc_and_Bc', 1 - v.pA_or_B) || changed;
      if (v.pA !== null && v.pB !== null) changed = set('pA_and_B', v.pA + v.pB - v.pA_or_B) || changed;
    }
    if (v.pA_or_Bc !== null) {
      changed = set('pAc_and_B', 1 - v.pA_or_Bc) || changed;
      if (v.pA !== null && v.pBc !== null) changed = set('pA_and_Bc', v.pA + v.pBc - v.pA_or_Bc) || changed;
    }
    if (v.pAc_or_B !== null) {
      changed = set('pA_and_Bc', 1 - v.pAc_or_B) || changed;
      if (v.pAc !== null && v.pB !== null) changed = set('pAc_and_B', v.pAc + v.pB - v.pAc_or_B) || changed;
    }
    if (v.pAc_or_Bc !== null) {
      changed = set('pA_and_B', 1 - v.pAc_or_Bc) || changed;
      if (v.pAc !== null && v.pBc !== null) changed = set('pAc_and_Bc', v.pAc + v.pBc - v.pAc_or_Bc) || changed;
    }

    if (!changed) break;
  }

  return v;
}

const initialInputs: Record<ProbKeys, number | null> = {
  pA: null, pB: null, pAc: null, pBc: null,
  pA_B: null, pA_Bc: null, pAc_B: null, pAc_Bc: null,
  pB_A: null, pBc_A: null, pB_Ac: null, pBc_Ac: null,
  pA_and_B: null, pA_and_Bc: null, pAc_and_B: null, pAc_and_Bc: null,
  pA_or_B: null, pA_or_Bc: null, pAc_or_B: null, pAc_or_Bc: null
};

export function BayesCalculator() {
  const [nameA, setNameA] = useState('A');
  const [nameB, setNameB] = useState('B');
  const [inputs, setInputs] = useState<Record<ProbKeys, number | null>>(initialInputs);
  const [inputStrings, setInputStrings] = useState<Record<ProbKeys, string>>(
    Object.fromEntries(ALL_KEYS.map(k => [k, ''])) as Record<ProbKeys, string>
  );

  const solved = useMemo(() => solveProbabilities(inputs), [inputs]);

  const handleInputChange = (key: ProbKeys, value: string) => {
    setInputStrings(prev => ({ ...prev, [key]: value }));
    const num = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [key]: !isNaN(num) && num >= 0 && num <= 100 ? num / 100 : null
    }));
  };

  const clearAll = () => {
    setInputs(initialInputs);
    setInputStrings(Object.fromEntries(ALL_KEYS.map(k => [k, ''])) as Record<ProbKeys, string>);
  };

  const getSymbol = (key: ProbKeys) => {
    const map: Record<ProbKeys, string> = {
      pA: `P(${nameA})`, pB: `P(${nameB})`, pAc: `P(${nameA}ᶜ)`, pBc: `P(${nameB}ᶜ)`,
      pA_B: `P(${nameA}|${nameB})`, pA_Bc: `P(${nameA}|${nameB}ᶜ)`, pAc_B: `P(${nameA}ᶜ|${nameB})`, pAc_Bc: `P(${nameA}ᶜ|${nameB}ᶜ)`,
      pB_A: `P(${nameB}|${nameA})`, pBc_A: `P(${nameB}ᶜ|${nameA})`, pB_Ac: `P(${nameB}|${nameA}ᶜ)`, pBc_Ac: `P(${nameB}ᶜ|${nameA}ᶜ)`,
      pA_and_B: `P(${nameA}∩${nameB})`, pA_and_Bc: `P(${nameA}∩${nameB}ᶜ)`, pAc_and_B: `P(${nameA}ᶜ∩${nameB})`, pAc_and_Bc: `P(${nameA}ᶜ∩${nameB}ᶜ)`,
      pA_or_B: `P(${nameA}∪${nameB})`, pA_or_Bc: `P(${nameA}∪${nameB}ᶜ)`, pAc_or_B: `P(${nameA}ᶜ∪${nameB})`, pAc_or_Bc: `P(${nameA}ᶜ∪${nameB}ᶜ)`
    };
    return map[key];
  };

  const getDesc = (key: ProbKeys) => {
    const map: Record<ProbKeys, string> = {
      pA: `Probability of ${nameA}`, pB: `Probability of ${nameB}`, pAc: `Probability of not ${nameA}`, pBc: `Probability of not ${nameB}`,
      pA_B: `Probability of ${nameA} given ${nameB}`, pA_Bc: `Probability of ${nameA} given not ${nameB}`, pAc_B: `Probability of not ${nameA} given ${nameB}`, pAc_Bc: `Probability of not ${nameA} given not ${nameB}`,
      pB_A: `Probability of ${nameB} given ${nameA}`, pBc_A: `Probability of not ${nameB} given ${nameA}`, pB_Ac: `Probability of ${nameB} given not ${nameA}`, pBc_Ac: `Probability of not ${nameB} given not ${nameA}`,
      pA_and_B: `Probability of ${nameA} and ${nameB}`, pA_and_Bc: `Probability of ${nameA} and not ${nameB}`, pAc_and_B: `Probability of not ${nameA} and ${nameB}`, pAc_and_Bc: `Probability of not ${nameA} and not ${nameB}`,
      pA_or_B: `Probability of ${nameA} or ${nameB}`, pA_or_Bc: `Probability of ${nameA} or not ${nameB}`, pAc_or_B: `Probability of not ${nameA} or ${nameB}`, pAc_or_Bc: `Probability of not ${nameA} or not ${nameB}`
    };
    return map[key];
  };

  const renderInputRow = (key: ProbKeys) => (
    <div key={key} className="flex flex-col gap-1.5 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 transition-all hover:border-amber-500/50 group">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">{getSymbol(key)}</label>
        <div className="group/tooltip relative">
          <Info className="w-3 h-3 text-stone-300 dark:text-stone-600 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-stone-900 text-white text-[9px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            {getDesc(key)}
          </div>
        </div>
      </div>
      <div className="relative">
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={inputStrings[key]}
          onChange={e => handleInputChange(key, e.target.value)}
          className="w-full px-0 py-1 text-xl bg-transparent border-none text-stone-900 dark:text-white focus:outline-none focus:ring-0 transition-all font-black placeholder-stone-200 dark:placeholder-stone-800"
          placeholder="0"
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-black text-stone-300 dark:text-stone-700">%</span>
      </div>
    </div>
  );

  const renderResultRow = (key: ProbKeys, highlightClass = 'bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300') => {
    const val = solved[key];
    const isKnown = val !== null;
    const isInput = inputs[key] !== null;
    
    return (
      <tr key={key} className={`border-b border-stone-100 dark:border-stone-800/50 ${highlightClass} ${isInput ? 'font-bold' : ''}`}>
        <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{getSymbol(key)}</td>
        <td className="px-3 py-2 text-right font-mono">{isKnown ? val.toFixed(4) : '?'}</td>
        <td className="px-3 py-2 text-right font-mono">{isKnown ? (val * 100).toFixed(2) + '%' : '?'}</td>
        <td className="px-3 py-2 text-[10px] opacity-70 italic">{getDesc(key)}</td>
      </tr>
    );
  };

  // Analysis
  const checkTolerance = (a: number | null, b: number | null) => {
    if (a === null || b === null) return null;
    return Math.abs(a - b) < 0.001;
  };

  const isIndependent = checkTolerance(solved.pA_and_B, (solved.pA || 0) * (solved.pB || 0));
  let independenceVerdict = "UNKNOWN";
  let independenceGap = 0;
  if (isIndependent === true) independenceVerdict = "INDEPENDENT";
  else if (isIndependent === false) {
    independenceVerdict = "DEPENDENT";
    independenceGap = (solved.pA_and_B || 0) - ((solved.pA || 0) * (solved.pB || 0));
  }

  const checks = [
    { name: `P(${nameB}|${nameA}) + P(${nameB}ᶜ|${nameA}) = 1`, pass: checkTolerance((solved.pB_A || 0) + (solved.pBc_A || 0), 1) },
    { name: `Joints sum to 1`, pass: checkTolerance((solved.pA_and_B || 0) + (solved.pA_and_Bc || 0) + (solved.pAc_and_B || 0) + (solved.pAc_and_Bc || 0), 1) },
    { name: `P(${nameA}∪${nameB}) = 1 - P(${nameA}ᶜ∩${nameB}ᶜ)`, pass: checkTolerance(solved.pA_or_B, 1 - (solved.pAc_and_Bc || 0)) }
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors">
      <div className="bg-amber-600 dark:bg-amber-500 p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter">Bayes' Theorem</h2>
          <p className="text-amber-100 font-medium mt-1">Enter known probabilities in % to derive the complete set.</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">Event Names</h3>
              <button onClick={clearAll} aria-label="Clear all probability inputs" className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">Clear All</button>
            </div>
            <fieldset className="grid grid-cols-2 gap-4 border-0 p-0 m-0">
              <legend className="sr-only">Event names</legend>
              <div className="space-y-1.5">
                <label htmlFor="bayes-nameA" className="text-[10px] font-bold text-stone-500 dark:text-stone-400 ml-1 uppercase tracking-wider">Event A</label>
                <input id="bayes-nameA" type="text" value={nameA} onChange={e => setNameA(e.target.value || 'A')} aria-describedby="bayes-nameA-hint" className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                <span id="bayes-nameA-hint" className="sr-only">Label for event A used in probability notation</span>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="bayes-nameB" className="text-[10px] font-bold text-stone-500 dark:text-stone-400 ml-1 uppercase tracking-wider">Event B</label>
                <input id="bayes-nameB" type="text" value={nameB} onChange={e => setNameB(e.target.value || 'B')} aria-describedby="bayes-nameB-hint" className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                <span id="bayes-nameB-hint" className="sr-only">Label for event B used in probability notation</span>
              </div>
            </fieldset>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <div className="col-span-full text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] mt-4 mb-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
              Marginals
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
            </div>
            {renderInputRow('pA')}{renderInputRow('pB')}
            {renderInputRow('pAc')}{renderInputRow('pBc')}
            
            <div className="col-span-full text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] mt-6 mb-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
              Conditionals
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
            </div>
            {renderInputRow('pA_B')}{renderInputRow('pA_Bc')}
            {renderInputRow('pAc_B')}{renderInputRow('pAc_Bc')}
            
            <div className="col-span-full text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] mt-6 mb-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
              Posteriors
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
            </div>
            {renderInputRow('pB_A')}{renderInputRow('pBc_A')}
            {renderInputRow('pB_Ac')}{renderInputRow('pBc_Ac')}
            
            <div className="col-span-full text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] mt-6 mb-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
              Joints
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
            </div>
            {renderInputRow('pA_and_B')}{renderInputRow('pA_and_Bc')}
            {renderInputRow('pAc_and_B')}{renderInputRow('pAc_and_Bc')}
            
            <div className="col-span-full text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] mt-6 mb-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
              Unions
              <div className="h-px flex-1 bg-stone-100 dark:bg-stone-800" />
            </div>
            {renderInputRow('pA_or_B')}{renderInputRow('pA_or_Bc')}
            {renderInputRow('pAc_or_B')}{renderInputRow('pAc_or_Bc')}
          </div>
        </div>

        {/* Right Column: Results & Analysis */}
        <div className="lg:col-span-8 space-y-6">
          <div className="overflow-x-auto rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest bg-stone-50 dark:bg-stone-800/50">
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3 text-right">Decimal</th>
                  <th className="px-4 py-3 text-right">Percent</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-stone-50 dark:bg-stone-800/30"><td colSpan={4} className="px-4 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest">Marginals</td></tr>
                {renderResultRow('pA')}{renderResultRow('pB')}{renderResultRow('pAc')}{renderResultRow('pBc')}
                
                <tr className="bg-stone-50 dark:bg-stone-800/30"><td colSpan={4} className="px-4 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest">Conditionals</td></tr>
                {renderResultRow('pA_B')}{renderResultRow('pA_Bc')}{renderResultRow('pAc_B')}{renderResultRow('pAc_Bc')}
                
                <tr className="bg-stone-50 dark:bg-stone-800/30"><td colSpan={4} className="px-4 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest">Bayes Posteriors</td></tr>
                {renderResultRow('pB_A', 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-300')}
                {renderResultRow('pBc_A', 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-300')}
                {renderResultRow('pB_Ac', 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-300')}
                {renderResultRow('pBc_Ac', 'bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-300')}
                
                <tr className="bg-stone-50 dark:bg-stone-800/30"><td colSpan={4} className="px-4 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest">Joints</td></tr>
                {renderResultRow('pA_and_B')}{renderResultRow('pA_and_Bc')}{renderResultRow('pAc_and_B')}{renderResultRow('pAc_and_Bc')}
                
                <tr className="bg-stone-50 dark:bg-stone-800/30"><td colSpan={4} className="px-4 py-1.5 text-[10px] font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest">Unions</td></tr>
                {renderResultRow('pA_or_B', 'bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-300')}
                {renderResultRow('pA_or_Bc', 'bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-300')}
                {renderResultRow('pAc_or_B', 'bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-300')}
                {renderResultRow('pAc_or_Bc', 'bg-blue-50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-300')}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-200 dark:border-stone-800">
              <h4 className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">Interpretation</h4>
              <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-3 list-disc pl-4">
                <li>The overall probability of {nameA} is <span className="font-bold text-stone-900 dark:text-white">{solved.pA !== null ? (solved.pA * 100).toFixed(1) + '%' : '?'}</span>.</li>
                <li>Given {nameA}, the probability of {nameB} is <span className="font-bold text-stone-900 dark:text-white">{solved.pB_A !== null ? (solved.pB_A * 100).toFixed(1) + '%' : '?'}</span>.</li>
                <li>The probability of both {nameA} and {nameB} occurring is <span className="font-bold text-stone-900 dark:text-white">{solved.pA_and_B !== null ? (solved.pA_and_B * 100).toFixed(1) + '%' : '?'}</span>.</li>
                <li>The probability of either {nameA} or {nameB} occurring is <span className="font-bold text-stone-900 dark:text-white">{solved.pA_or_B !== null ? (solved.pA_or_B * 100).toFixed(1) + '%' : '?'}</span>.</li>
              </ul>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-200 dark:border-stone-800">
              <h4 className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">Independence Test</h4>
              <div className="text-center py-4">
                <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  independenceVerdict === 'INDEPENDENT' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                  independenceVerdict === 'DEPENDENT' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                }`}>
                  {independenceVerdict}
                </span>
              </div>
              {independenceVerdict === 'DEPENDENT' && (
                <p className="text-[10px] font-bold text-center mt-2 text-stone-500 uppercase tracking-wider">
                  {independenceGap > 0 ? 'Positive' : 'Negative'} correlation<br/>
                  <span className="opacity-60">Gap: {Math.abs(independenceGap).toFixed(4)}</span>
                </p>
              )}
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-3xl border border-stone-200 dark:border-stone-800">
              <h4 className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">Verification</h4>
              <ul className="text-[10px] font-bold space-y-3">
                {checks.map((check, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400 truncate mr-2 uppercase tracking-wider" title={check.name}>{check.name}</span>
                    <span className="text-sm">{check.pass === true ? '✅' : check.pass === false ? '❌' : '❔'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
