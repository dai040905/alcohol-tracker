'use client'

import { motion } from 'framer-motion'
import { Beer, Wine, GlassWater, Clock } from 'lucide-react'

interface Drink {
    id: string
    alcohol_type: string
    volume_cc: number
    abv: number
    created_at: string
}

const ICON_MAP: Record<string, any> = {
    '啤酒': Beer,
    '葡萄酒': Wine,
    '烈酒': GlassWater,
}

export default function DrinkList({ drinks }: { drinks: Drink[] }) {
    if (drinks.length === 0) {
        return (
            <div className="glass-card flex flex-col items-center justify-center p-12 text-slate-500">
                <Clock className="w-12 h-12 mb-4 opacity-20" />
                <p>今日尚無紀錄</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-300 px-2">今日飲酒紀錄</h3>
            <div className="space-y-3">
                {drinks.map((drink, index) => {
                    const Icon = ICON_MAP[drink.alcohol_type] || Beer
                    const pureCc = (drink.volume_cc * (drink.abv / 100)).toFixed(1)
                    const time = new Date(drink.created_at).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })

                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={drink.id}
                            className="glass p-4 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <Icon className="w-6 h-6 text-primary/80" />
                                </div>
                                <div>
                                    <p className="text-slate-200 font-bold">{drink.alcohol_type}</p>
                                    <p className="text-slate-500 text-xs">{drink.volume_cc}cc · {drink.abv}%</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-primary font-mono font-bold">+{pureCc} cc</p>
                                <p className="text-slate-600 text-[10px] mt-1">{time}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
