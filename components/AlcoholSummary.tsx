'use client'

import { motion } from 'framer-motion'
import { Droplets, AlertTriangle, ShieldAlert, HeartPulse, Info } from 'lucide-react'

interface Profile {
    gender: 'male' | 'female'
    weight_kg: number
}

export default function AlcoholSummary({
    totalPureCc,
    profile
}: {
    totalPureCc: number,
    profile?: Profile | null
}) {
    // Widmark Formula
    // BAC = (A / (W * r)) * 100
    // A = Pure Alcohol in Grams (Pure Alcohol cc * 0.789)
    // W = Body weight in Grams (Weight kg * 1000)
    // r = 0.68 for male, 0.55 for female

    const alcoholGrams = totalPureCc * 0.789
    const rFactor = profile?.gender === 'female' ? 0.55 : 0.68
    const weightGrams = (profile?.weight_kg || 70) * 1000
    const bac = (alcoholGrams / (weightGrams * rFactor)) * 100

    const getStatus = (val: number) => {
        if (val === 0) return { label: '正常', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info, desc: '目前血液中無酒精反應。' }
        if (val < 0.03) return { label: '正常', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Info, desc: '身體反應正常，仍建議少量飲酒。' }
        if (val < 0.05) return { label: '輕微影響', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', icon: Info, desc: '感官略微放鬆，注意力開始不集中。' }
        if (val < 0.08) return { label: '法律限制', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle, desc: '⚠️ 注意：已過法律駕車限制，不可開車！' }
        if (val < 0.15) return { label: '醉酒狀態', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: ShieldAlert, desc: '❌ 嚴重：運動平衡與說話能力受損。' }
        return { label: '爛醉/危險', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: HeartPulse, desc: '🆘 危險：可能有斷片或急性中毒風險。' }
    }

    const status = getStatus(bac)
    // Progress based on "Impairment limit" (0.05)
    const percentage = Math.min((bac / 0.08) * 100, 100)

    return (
        <div className="glass-card flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    className={`h-full transition-colors duration-500 ${status.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1 }}
                />
            </div>

            <div className="z-10 text-center w-full">
                <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full transition-colors duration-500 ${status.bg}`}>
                        <status.icon className={`w-8 h-8 transition-colors duration-500 ${status.color}`} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
                    <div className="text-center">
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">純酒精量</h3>
                        <p className="text-3xl font-black text-white font-mono">
                            {totalPureCc.toFixed(1)} <span className="text-xs font-normal text-slate-500">cc</span>
                        </p>
                    </div>

                    <div className="h-12 w-px bg-white/5 hidden md:block"></div>

                    <div className="text-center">
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">血液酒精濃度 (BAC)</h3>
                        <p className={`text-4xl font-black font-mono transition-colors duration-500 ${status.color}`}>
                            {bac.toFixed(3)}<span className="text-xs font-bold opacity-70 ml-1">%</span>
                        </p>
                    </div>
                </div>

                <motion.div
                    key={status.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl border ${status.bg} ${status.border} text-left`}
                >
                    <p className={`text-xs font-bold mb-1 ${status.color}`}>狀態：{status.label}</p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                        {profile ? status.desc : '⚠️ 請點擊右上方頭像設定體重與性別，以獲得更準確的 BAC 估算。'}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
