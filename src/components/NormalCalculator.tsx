import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { normalPdf, normalCdf, normalInv } from '../utils/math';
import { motion } from 'motion/react';
import { Info, Settings2, BarChart3 } from 'lucide-react';

export function NormalCalculator() {
  const [mu, setMu] = useState<number>(0);
  const [sigma, setSigma] = useState<number>(1);
  const [calcType, setCalcType] = useState<'less' | 'greater' | 'between' | 'inverse'>('less');
  const [xVal, setXVal] = useState<number>(0);
  const [x1Val, setX1Val] = useState<number>(-1);
  const [x2Val, setX2Val] = useState<number>(1);
  const [pVal, setPVal] = useState<number>(0.5);

  const result = useMemo(() => {
    if (sigma <= 0) return null;
    if (calcType === 'less') return normalCdf(xVal, mu, sigma);
    if (calcType === 'greater') return 1 - normalCdf(xVal, mu, sigma);
    if (calcType === 'between') return normalCdf(x2Val, mu, sigma) - normalCdf(x1Val, mu, sigma);
    if (calcType === 'inverse') return normalInv(pVal, mu, sigma);
    return null;
  }, [mu, sigma, calcType, xVal, x1Val, x2Val, pVal]);

  const chartData = useMemo(() => {
    if (sigma <= 0) return [];
    const data = [];
    const min = mu - 4 * sigma;
    const max = mu + 4 * sigma;
    const step = (max - min) / 100;
    
    for (let x = min; x <= max; x += step) {
      let fill = false;
      if (calcType === 'less' && x <= xVal) fill = true;
      if (calcType === 'greater' && x >= xVal) fill = true;
      if (calcType === 'between' && x >= x1Val && x <= x2Val) fill = true;
      if (calcType === 'inverse' && x <= (result || 0)) fill = true;

      data.push({
        x: Number(x.toFixed(2)),
        y: normalPdf(x, mu, sigma),
        fillArea: fill ? normalPdf(x, mu, sigma) : 0,
      });
    }
    return data;
  }, [mu, sigma, calcType, xVal, x1Val, x2Val, result]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">Normal Distribution</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Bell-shaped and symmetric probability distribution</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Mean</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{mu}</span>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Std Dev</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{sigma}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
              <Settings2 className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Mean (μ)</label>
                <input type="number" value={mu} onChange={e => setMu(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Std Dev (σ)</label>
                <input type="number" value={sigma} onChange={e => setSigma(Number(e.target.value))} min="0.0001" step="0.1" className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Calculation Type</label>
              <select value={calcType} onChange={e => setCalcType(e.target.value as any)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium appearance-none">
                <option value="less">P(X ≤ x) [Less than]</option>
                <option value="greater">P(X {'>'} x) [Greater than]</option>
                <option value="between">P(x₁ ≤ X ≤ x₂) [Between]</option>
                <option value="inverse">Inverse: Find x given P(X ≤ x)</option>
              </select>
            </div>

            {calcType === 'less' || calcType === 'greater' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Value (x)</label>
                <input type="number" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            ) : calcType === 'between' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Lower (x₁)</label>
                  <input type="number" value={x1Val} onChange={e => setX1Val(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Upper (x₂)</label>
                  <input type="number" value={x2Val} onChange={e => setX2Val(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Probability (p)</label>
                <input type="number" value={pVal} onChange={e => setPVal(Number(e.target.value))} min="0.0001" max="0.9999" step="0.01" className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium" />
              </div>
            )}
          </section>

          <motion.div 
            layout
            className="p-8 bg-indigo-600 dark:bg-indigo-500 rounded-[2rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Calculated Result</div>
              <div className="text-5xl font-black tracking-tighter mb-2">
                {result !== null ? (calcType === 'inverse' ? result.toFixed(4) : (result * 100).toFixed(2) + '%') : 'Error'}
              </div>
              {result !== null && calcType !== 'inverse' && (
                <div className="text-sm font-bold opacity-80 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Probability: {result.toFixed(6)}
                </div>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
                <BarChart3 className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-widest">Distribution Visualization</h3>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:opacity-10" />
                  <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                    formatter={(value: number) => value.toFixed(4)} 
                    labelFormatter={(label: number) => `x = ${label}`} 
                  />
                  <Area type="monotone" dataKey="y" stroke="#6366f1" fill="url(#colorY)" strokeWidth={3} animationDuration={1000} />
                  <Area type="monotone" dataKey="fillArea" stroke="none" fill="url(#colorFill)" animationDuration={1000} />
                  {calcType === 'inverse' && result !== null && (
                    <ReferenceLine x={result} stroke="#4f46e5" strokeDasharray="5 5" strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

