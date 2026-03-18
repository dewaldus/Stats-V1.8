import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { hypergeomPmf, hypergeomCdf } from '../utils/math';
import { motion } from 'motion/react';
import { Info, Settings2, BarChart3 } from 'lucide-react';

export function HypergeometricCalculator() {
  const [N, setN] = useState<number>(25); // Population size
  const [K, setK] = useState<number>(20); // Successes in population (S in notes)
  const [n, setn] = useState<number>(5);  // Sample size
  const [calcType, setCalcType] = useState<'exact' | 'most' | 'least' | 'between'>('exact');
  const [xVal, setXVal] = useState<number>(3);
  const [x1Val, setX1Val] = useState<number>(1);
  const [x2Val, setX2Val] = useState<number>(4);

  const mean = n * (K / N);
  const variance = n * (K / N) * ((N - K) / N) * ((N - n) / (N - 1));
  const sd = Math.sqrt(variance);

  const result = useMemo(() => {
    if (N < 0 || K < 0 || n < 0 || K > N || n > N) return null;
    
    if (calcType === 'exact') return hypergeomPmf(xVal, N, K, n);
    if (calcType === 'most') return hypergeomCdf(xVal, N, K, n); // P(X <= x)
    if (calcType === 'least') return 1 - hypergeomCdf(xVal - 1, N, K, n); // P(X >= x)
    if (calcType === 'between') return hypergeomCdf(x2Val, N, K, n) - hypergeomCdf(x1Val - 1, N, K, n);
    return null;
  }, [N, K, n, calcType, xVal, x1Val, x2Val]);

  const chartData = useMemo(() => {
    if (N < 0 || K < 0 || n < 0 || K > N || n > N) return [];
    const data = [];
    const minPlot = Math.max(0, n - (N - K));
    const maxPlot = Math.min(n, K);
    
    for (let x = minPlot; x <= maxPlot; x++) {
      let highlight = false;
      if (calcType === 'exact' && x === xVal) highlight = true;
      if (calcType === 'most' && x <= xVal) highlight = true;
      if (calcType === 'least' && x >= xVal) highlight = true;
      if (calcType === 'between' && x >= x1Val && x <= x2Val) highlight = true;

      data.push({
        x,
        prob: hypergeomPmf(x, N, K, n),
        highlight,
      });
    }
    return data;
  }, [N, K, n, calcType, xVal, x1Val, x2Val]);

  const isValid = N > 0 && K >= 0 && n >= 0 && K <= N && n <= N;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">
            Hypergeometric
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1">
            Sampling without replacement from a finite population
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Finite Engine</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: "Expected Value E(X)", value: isValid ? mean.toFixed(4) : '-', sub: "n * (K/N)" },
            { label: "Variance Var(X)", value: isValid && N > 1 ? variance.toFixed(4) : '-', sub: "Finite Pop Correction" },
            { label: "Std Deviation SD(X)", value: isValid && N > 1 ? sd.toFixed(4) : '-', sub: "σ = √Var(X)" }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-medium text-stone-400 dark:text-stone-600 mt-1">{stat.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Controls Section */}
        <div className="lg:col-span-4 space-y-6">
          <section className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Parameters</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Population Size (N)</label>
                <input 
                  type="number" 
                  value={N} 
                  onChange={e => setN(Math.max(0, parseInt(e.target.value) || 0))} 
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Successes (K)</label>
                  <input 
                    type="number" 
                    value={K} 
                    onChange={e => setK(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Sample Size (n)</label>
                  <input 
                    type="number" 
                    value={n} 
                    onChange={e => setn(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Calculation Type</label>
                <select 
                  value={calcType} 
                  onChange={e => setCalcType(e.target.value as any)} 
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none"
                >
                  <option value="exact">P(X = x) [Exact]</option>
                  <option value="most">P(X ≤ x) [At most]</option>
                  <option value="least">P(X ≥ x) [At least]</option>
                  <option value="between">P(x₁ ≤ X ≤ x₂) [Between]</option>
                </select>
              </div>

              {calcType === 'between' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Lower (x₁)</label>
                    <input 
                      type="number" 
                      value={x1Val} 
                      onChange={e => setX1Val(parseInt(e.target.value) || 0)} 
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Upper (x₂)</label>
                    <input 
                      type="number" 
                      value={x2Val} 
                      onChange={e => setX2Val(parseInt(e.target.value) || 0)} 
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Value (x)</label>
                  <input 
                    type="number" 
                    value={xVal} 
                    onChange={e => setXVal(parseInt(e.target.value) || 0)} 
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" 
                  />
                </div>
              )}
            </div>
          </section>

          <motion.div 
            layout
            className="p-8 bg-indigo-600 dark:bg-indigo-500 rounded-3xl shadow-xl shadow-indigo-500/20 text-white"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Probability Result</div>
            <div className="text-5xl font-black tracking-tighter mb-2">
              {result !== null ? (result * 100).toFixed(2) + '%' : 'Error'}
            </div>
            {result !== null && (
              <div className="text-sm font-medium opacity-90">
                P = {result.toFixed(6)}
              </div>
            )}
          </motion.div>
        </div>

        {/* Visualization Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm h-full flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Probability Mass Function</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-stone-200 dark:bg-stone-700 rounded-full" />
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Other</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="x" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xl">
                            <div className="text-[10px] font-black text-stone-400 uppercase mb-1">x = {payload[0].payload.x}</div>
                            <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                              {(payload[0].value as number * 100).toFixed(4)}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.highlight ? '#6366f1' : '#e2e8f0'} 
                        className={entry.highlight ? 'opacity-100' : 'opacity-30 dark:opacity-10'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl flex items-start gap-4">
              <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                The <strong>Hypergeometric distribution</strong> models the probability of <em>k</em> successes in <em>n</em> draws, 
                without replacement, from a finite population of size <em>N</em> that contains exactly <em>K</em> successes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
