import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { poissonPmf, poissonCdf } from '../utils/math';
import { motion } from 'motion/react';
import { Info, Settings2, BarChart3 } from 'lucide-react';

export function PoissonCalculator() {
  const [lambda, setLambda] = useState<number>(4);
  const [calcType, setCalcType] = useState<'exact' | 'most' | 'least' | 'between'>('exact');
  const [xVal, setXVal] = useState<number>(2);
  const [x1Val, setX1Val] = useState<number>(1);
  const [x2Val, setX2Val] = useState<number>(5);

  const mean = lambda;
  const variance = lambda;
  const sd = Math.sqrt(variance);

  const result = useMemo(() => {
    if (lambda < 0) return null;
    
    if (calcType === 'exact') return poissonPmf(xVal, lambda);
    if (calcType === 'most') return poissonCdf(xVal, lambda); // P(X <= x)
    if (calcType === 'least') return 1 - poissonCdf(xVal - 1, lambda); // P(X >= x)
    if (calcType === 'between') return poissonCdf(x2Val, lambda) - poissonCdf(x1Val - 1, lambda);
    return null;
  }, [lambda, calcType, xVal, x1Val, x2Val]);

  const chartData = useMemo(() => {
    if (lambda < 0) return [];
    const data = [];
    const maxPlot = Math.max(10, Math.ceil(mean + 4 * sd));
    
    for (let x = 0; x <= maxPlot; x++) {
      let highlight = false;
      if (calcType === 'exact' && x === xVal) highlight = true;
      if (calcType === 'most' && x <= xVal) highlight = true;
      if (calcType === 'least' && x >= xVal) highlight = true;
      if (calcType === 'between' && x >= x1Val && x <= x2Val) highlight = true;

      data.push({
        x,
        prob: poissonPmf(x, lambda),
        highlight,
      });
    }
    return data;
  }, [lambda, calcType, xVal, x1Val, x2Val, mean, sd]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">
            Poisson Distribution
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium mt-1">
            Discrete probability of events in a fixed interval
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Discrete Engine</span>
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
            { label: "Expected Value E(X)", value: lambda >= 0 ? mean.toFixed(4) : '-', sub: "μ = λ" },
            { label: "Variance Var(X)", value: lambda >= 0 ? variance.toFixed(4) : '-', sub: "σ² = λ" },
            { label: "Std Deviation SD(X)", value: lambda >= 0 ? sd.toFixed(4) : '-', sub: "σ = √λ" }
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
          <section className="p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6" aria-label="Distribution parameters">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Parameters</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="pois-lambda" className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Mean / Rate (λ)</label>
                <input
                  id="pois-lambda"
                  type="number"
                  value={lambda}
                  onChange={e => setLambda(Math.max(0, Number(e.target.value)))}
                  step="0.1"
                  min="0"
                  aria-describedby="pois-lambda-hint"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                />
                <span id="pois-lambda-hint" className="sr-only">Mean event rate, must be non-negative</span>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <label htmlFor="pois-calctype" className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Calculation Type</label>
                <select
                  id="pois-calctype"
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
                <fieldset className="grid grid-cols-2 gap-4 border-0 p-0 m-0">
                  <legend className="sr-only">Value range</legend>
                  <div>
                    <label htmlFor="pois-x1" className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Lower (x₁)</label>
                    <input
                      id="pois-x1"
                      type="number"
                      value={x1Val}
                      onChange={e => setX1Val(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="pois-x2" className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Upper (x₂)</label>
                    <input
                      id="pois-x2"
                      type="number"
                      value={x2Val}
                      onChange={e => setX2Val(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-stone-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>
                </fieldset>
              ) : (
                <div>
                  <label htmlFor="pois-x" className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">Value (x)</label>
                  <input
                    id="pois-x"
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
            role="status"
            aria-live="polite"
            aria-label={result !== null ? `Probability result: ${(result * 100).toFixed(2)} percent` : 'Calculation error'}
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
              <div className="flex items-center gap-4" role="list" aria-label="Chart legend">
                <div className="flex items-center gap-2" role="listitem">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Selected (highlighted bars)</span>
                </div>
                <div className="flex items-center gap-2" role="listitem">
                  <div className="w-3 h-3 bg-stone-200 dark:bg-stone-700 rounded-full" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Other (non-selected bars)</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[350px]" role="img" aria-label={`Bar chart showing Poisson probability mass function with rate lambda ${lambda}`}>
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
              <Info className="w-5 h-5 text-indigo-500 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                The <strong>Poisson distribution</strong> models the number of times an event occurs in a fixed interval of time or space.
                It assumes events occur with a known constant mean rate and independently of the time since the last event.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
