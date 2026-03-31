import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { binomialPmf, binomialCdf } from '../utils/math';
import { motion } from 'motion/react';
import { Info, Settings2, BarChart3 } from 'lucide-react';

export function BinomialCalculator() {
  const [n, setN] = useState<number>(10);
  const [p, setP] = useState<number>(0.5);
  const [calcType, setCalcType] = useState<'exact' | 'most' | 'least' | 'between'>('exact');
  const [xVal, setXVal] = useState<number>(5);
  const [x1Val, setX1Val] = useState<number>(3);
  const [x2Val, setX2Val] = useState<number>(7);

  const mean = n * p;
  const variance = n * p * (1 - p);
  const sd = Math.sqrt(variance);

  const result = useMemo(() => {
    if (n < 0 || p < 0 || p > 1) return null;
    
    if (calcType === 'exact') return binomialPmf(xVal, n, p);
    if (calcType === 'most') return binomialCdf(xVal, n, p); // P(X <= x)
    if (calcType === 'least') return 1 - binomialCdf(xVal - 1, n, p); // P(X >= x)
    if (calcType === 'between') return binomialCdf(x2Val, n, p) - binomialCdf(x1Val - 1, n, p);
    return null;
  }, [n, p, calcType, xVal, x1Val, x2Val]);

  const chartData = useMemo(() => {
    if (n < 0 || p < 0 || p > 1) return [];
    const data = [];
    const maxPlot = Math.min(n, Math.max(20, Math.ceil(mean + 4 * sd)));
    
    for (let x = 0; x <= maxPlot; x++) {
      let highlight = false;
      if (calcType === 'exact' && x === xVal) highlight = true;
      if (calcType === 'most' && x <= xVal) highlight = true;
      if (calcType === 'least' && x >= xVal) highlight = true;
      if (calcType === 'between' && x >= x1Val && x <= x2Val) highlight = true;

      data.push({
        x,
        prob: binomialPmf(x, n, p),
        highlight,
      });
    }
    return data;
  }, [n, p, calcType, xVal, x1Val, x2Val, mean, sd]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">Binomial Distribution</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Discrete probability of successes in n independent trials</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Trials (n)</span>
            <span className="text-lg font-black text-orange-600 dark:text-orange-400">{n}</span>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Prob (p)</span>
            <span className="text-lg font-black text-orange-600 dark:text-orange-400">{p}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6" aria-label="Distribution parameters">
            <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
              <Settings2 className="w-4 h-4" aria-hidden="true" />
              <h3 className="text-xs font-black uppercase tracking-widest">Parameters</h3>
            </div>

            <fieldset className="grid grid-cols-2 gap-4 border-0 p-0 m-0">
              <legend className="sr-only">Distribution parameters</legend>
              <div className="space-y-1.5">
                <label htmlFor="binom-n" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Trials (n)</label>
                <input id="binom-n" type="number" value={n} onChange={e => setN(Math.max(0, parseInt(e.target.value) || 0))} min="0" aria-describedby="binom-n-hint" className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium" />
                <span id="binom-n-hint" className="sr-only">Number of independent trials</span>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="binom-p" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Prob (p)</label>
                <input id="binom-p" type="number" value={p} onChange={e => setP(Number(e.target.value))} min="0" max="1" step="0.01" aria-describedby="binom-p-hint" className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium" />
                <span id="binom-p-hint" className="sr-only">Probability of success per trial, between 0 and 1</span>
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <label htmlFor="binom-calctype" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Calculation Type</label>
              <select id="binom-calctype" value={calcType} onChange={e => setCalcType(e.target.value as any)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium appearance-none">
                <option value="exact">P(X = x) [Exact value]</option>
                <option value="most">P(X ≤ x) [At most / No more than]</option>
                <option value="least">P(X ≥ x) [At least / Greater than]</option>
                <option value="between">P(x₁ ≤ X ≤ x₂) [Between]</option>
              </select>
            </div>

            {calcType === 'between' ? (
              <fieldset className="grid grid-cols-2 gap-4 border-0 p-0 m-0">
                <legend className="sr-only">Value range</legend>
                <div className="space-y-1.5">
                  <label htmlFor="binom-x1" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Lower (x₁)</label>
                  <input id="binom-x1" type="number" value={x1Val} onChange={e => setX1Val(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="binom-x2" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Upper (x₂)</label>
                  <input id="binom-x2" type="number" value={x2Val} onChange={e => setX2Val(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium" />
                </div>
              </fieldset>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="binom-x" className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Value (x)</label>
                <input id="binom-x" type="number" value={xVal} onChange={e => setXVal(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-medium" />
              </div>
            )}
          </section>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Expected Value</div>
              <div className="text-xl font-black text-stone-900 dark:text-white">{n >= 0 && p >= 0 && p <= 1 ? mean.toFixed(2) : '-'}</div>
            </div>
            <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Std Deviation</div>
              <div className="text-xl font-black text-stone-900 dark:text-white">{n >= 0 && p >= 0 && p <= 1 ? sd.toFixed(4) : '-'}</div>
            </div>
          </motion.div>

          <motion.div
            layout
            role="status"
            aria-live="polite"
            aria-label={result !== null ? `Calculated probability: ${(result * 100).toFixed(2)} percent` : 'Calculation error'}
            className="p-8 bg-orange-600 dark:bg-orange-500 rounded-[2rem] text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Calculated Result</div>
              <div className="text-5xl font-black tracking-tighter mb-2">
                {result !== null ? (result * 100).toFixed(2) + '%' : 'Error'}
              </div>
              {result !== null && (
                <div className="text-sm font-bold opacity-80 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" aria-hidden="true" />
                  Probability: {result.toFixed(6)}
                </div>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <h3 className="text-xs font-black uppercase tracking-widest">PMF Visualization</h3>
              </div>
            </div>
            <div className="flex-1" role="img" aria-label={`Bar chart showing the Binomial probability mass function with ${n} trials and probability ${p}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:opacity-10" />
                  <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fb923c' }}
                    formatter={(value: number) => value.toFixed(4)} 
                    labelFormatter={(label: number) => `x = ${label}`} 
                  />
                  <Bar dataKey="prob" radius={[6, 6, 0, 0]} animationDuration={1000}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.highlight ? '#f97316' : '#fed7aa'} className="transition-colors duration-300" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

