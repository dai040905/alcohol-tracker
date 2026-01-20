'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Droplets, AlertTriangle, ShieldAlert, HeartPulse, Info, Clock } from 'lucide-react'

interface Drink {
    id: string
    created_at: string
    volume_cc: number
    abv: number
}

interface Profile {
    gender: 'male' | 'female'
    weight_kg: number
}

export default function AlcoholSummary({
    drinks,
    profile
}: {
    drinks: Drink[],
    profile?: Profile | null
}) {
    const [bac, setBac] = useState(0)
    const [totalPureCc, setTotalPureCc] = useState(0)

    const calculateBAC = useCallback(() => {
        if (!profile || drinks.length === 0) {
            const totalCc = drinks.reduce((acc, d) => acc + (d.volume_cc * (d.abv / 100)), 0)
            return { currentBac: 0, totalCc }
        }

        const rFactor = profile.gender === 'female' ? 0.55 : 0.68
        const weightGrams = profile.weight_kg * 1000
        const eliminationRatePerHour = 0.015 // β coefficient
        const now = new Date().getTime()

        // 1. Sort drinks by time ascending
        const sortedDrinks = [...drinks].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )

        let runningBac = 0
        let lastEventTime = new Date(sortedDrinks[0].created_at).getTime()
        let totalCc = 0

        // 2. Iterate through drinks and metabolize between them
        sortedDrinks.forEach((drink) => {
            const pureCc = drink.volume_cc * (drink.abv / 100)
            totalCc += pureCc

            const alcoholGrams = pureCc * 0.789
            const drinkContribution = (alcoholGrams / (weightGrams * rFactor)) * 100

            const currentTime = new Date(drink.created_at).getTime()
            const hoursPassedSinceLastEvent = (currentTime - lastEventTime) / (1000 * 60 * 60)

            // Subtract metabolism since last drink
            runningBac = Math.max(0, runningBac - (eliminationRatePerHour * hoursPassedSinceLastEvent))

            // Add current drink
            runningBac += drinkContribution
            lastEventTime = currentTime
        })

        // 3. Final metabolism from last drink until "Now"
        const hoursPassedUntilNow = (now - lastEventTime) / (1000 * 60 * 60)
        runningBac = Math.max(0, runningBac - (eliminationRatePerHour * hoursPassedUntilNow))

        return { currentBac: runningBac, totalCc }
    }, [drinks, profile])

    useEffect(() => {
        const update = () => {
            const { currentBac, totalCc } = calculateBAC()
            setBac(currentBac)
            setTotalPureCc(totalCc)
        }

        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [calculateBAC])

    const getStatus = (val: number) => {
        if (val === 0) return { label: '正常', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Info, desc: '目前血液中無酒精反應。' }
        if (val < 0.03) return { label: '正常', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Info, desc: '身體反應正常，仍建議少量飲酒。' }
        if (val < 0.05) return { label: '輕微影響', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', icon: Info, desc: '感官略微放鬆，注意力開始不集中。' }
        if (val < 0.08) return { label: '法律限制', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: AlertTriangle, desc: '⚠️ 注意：已過法律駕車限制，不可開車！' }
        if (val < 0.15) return { label: '醉酒狀態', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: ShieldAlert, desc: '❌ 嚴重：運動平衡與說話能力受損。' }
        return { label: '爛醉/危險', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: HeartPulse, desc: '🆘 危險：可能有斷片或急性中毒風險。' }
    }

    const status = getStatus(bac)
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

                <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
                    <div className="text-center">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">今日攝取總量</h3>
                        <p className="text-4xl font-black text-white font-mono">
                            {totalPureCc.toFixed(1)} <span className="text-sm font-normal text-slate-500">cc</span>
                        </p>
                    </div>

                    <div className="h-16 w-px bg-white/10 hidden md:block"></div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">當前血液濃度 (BAC)</h3>
                            <Clock className="w-4 h-4 text-slate-500 animate-pulse" />
                        </div>
                        <p className={`text-5xl font-black font-mono transition-colors duration-500 ${status.color}`}>
                            {bac.toFixed(3)}<span className="text-sm font-bold opacity-70 ml-1">%</span>
                        </p>
                    </div>
                </div>

                <motion.div
                    key={status.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-5 rounded-xl border ${status.bg} ${status.border} text-left`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-bold ${status.color}`}>狀態：{status.label}</p>
                        {bac > 0 && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 代謝計算中
                            </p>
                        )}
                    </div>
                    <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium">
                        {profile ? status.desc : '⚠️ 請點擊圖示設定體重，以啟用代謝追蹤功能。'}
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
