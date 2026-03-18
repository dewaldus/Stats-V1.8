import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Info, Settings2, BarChart3 } from 'lucide-react';

export function UniformCalculator() {
  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(10);
  const [calcType, setCalcType] = useState<'less' | 'greater' | 'between'>('less');
  const [xVal, setXVal] = useState<number>(5);
  const [x1Val, setX1Val] = useState<number>(2);
  const [x2Val, setX2Val] = useState<number>(8);

  const mean = (a + b) / 2;
  const variance = Math.pow(b - a, 2) / 12;
  const sd = Math.sqrt(variance);

  const result = useMemo(() => {
    if (b <= a) return null;
    
    const getCdf = (x: number) => {
      if (x <= a) return 0;
      if (x >= b) return 1;
      return (x - a) / (b - a);
    };

    if (calcType === 'less') return getCdf(xVal);
    if (calcType === 'greater') return 1 - getCdf(xVal);
    if (calcType === 'between') return getCdf(x2Val) - getCdf(x1Val);
    return null;
  }, [a, b, calcType, xVal, x1Val, x2Val]);

  const chartData = useMemo(() => {
    if (b <= a) return [];
    const data = [];
    const min = a - (b - a) * 0.2;
    const max = b + (b - a) * 0.2;
    const step = (max - min) / 100;
    const height = 1 / (b - a);
    
    for (let x = min; x <= max; x += step) {
      const y = (x >= a && x <= b) ? height : 0;
      let fill = false;
      if (x >= a && x <= b) {
        if (calcType === 'less' && x <= xVal) fill = true;
        if (calcType === 'greater' && x >= xVal) fill = true;
        if (calcType === 'between' && x >= x1Val && x <= x2Val) fill = true;
      }

      data.push({
        x: Number(x.toFixed(2)),
        y,
        fillArea: fill ? y : 0,
      });
    }
    return data;
  }, [a, b, calcType, xVal, x1Val, x2Val]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">Uniform Distribution</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Constant probability over a defined range [a, b]</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Range</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">[{a}, {b}]</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
              <Settings2 className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-widest">Parameters</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Lower (a)</label>
                <input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Upper (b)</label>
                <input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Calculation Type</label>
              <select value={calcType} onChange={e => setCalcType(e.target.value as any)} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium appearance-none">
                <option value="less">P(X ≤ x) [Less than]</option>
                <option value="greater">P(X {'>'} x) [Greater than]</option>
                <option value="between">P(x₁ ≤ X ≤ x₂) [Between]</option>
              </select>
            </div>

            {calcType === 'less' || calcType === 'greater' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Value (x)</label>
                <input type="number" value={xVal} onChange={e => setXVal(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Lower (x₁)</label>
                  <input type="number" value={x1Val} onChange={e => setX1Val(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 dark:text-stone-400 ml-1">Upper (x₂)</label>
                  <input type="number" value={x2Val} onChange={e => setX2Val(Number(e.target.value))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" />
                </div>
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
              <div className="text-xl font-black text-stone-900 dark:text-white">{b > a ? mean.toFixed(2) : '-'}</div>
            </div>
            <div className="p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Std Deviation</div>
              <div className="text-xl font-black text-stone-900 dark:text-white">{b > a ? sd.toFixed(4) : '-'}</div>
            </div>
          </motion.div>

          <motion.div 
            layout
            className="p-8 bg-emerald-600 dark:bg-emerald-500 rounded-[2rem] text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Calculated Result</div>
              <div className="text-5xl font-black tracking-tighter mb-2">
                {result !== null ? (result * 100).toFixed(2) + '%' : 'Error'}
              </div>
              {result !== null && (
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
                <h3 className="text-xs font-black uppercase tracking-widest">PDF Visualization</h3>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUniform" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFillUniform" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:opacity-10" />
                  <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#34d399' }}
                    formatter={(value: number) => value.toFixed(4)} 
                    labelFormatter={(label: number) => `x = ${label}`} 
                  />
                  <Area type="stepAfter" dataKey="y" stroke="#10b981" fill="url(#colorUniform)" strokeWidth={3} animationDuration={1000} />
                  <Area type="stepAfter" dataKey="fillArea" stroke="none" fill="url(#colorFillUniform)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
