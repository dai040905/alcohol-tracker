'use client'

import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'

export default function AlcoholSummary({ totalPureCc }: { totalPureCc: number }) {
    // Assume a "limit" or goal for safer drinking, e.g., 20cc pure alcohol
    const limit = 100
    const percentage = Math.min((totalPureCc / limit) * 100, 100)

    return (
        <div className="glass-card flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                />
            </div>

            <div className="z-10 text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Droplets className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">今日酒精累計量</h3>
                <p className="text-5xl font-black text-white font-mono">
                    {totalPureCc.toFixed(1)} <span className="text-xl font-normal text-slate-500">cc</span>
                </p>
                <p className="mt-4 text-xs text-slate-500 italic">
                    (純酒精換算量)
                </p>
            </div>

            {totalPureCc > limit && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-wider"
                >
                    超過建議攝取量
                </motion.div>
            )}
        </div>
    )
}
