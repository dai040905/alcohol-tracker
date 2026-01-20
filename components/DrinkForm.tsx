'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Beer, Wine, GlassWater, Plus, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const DRINK_TYPES = [
    { label: '啤酒', icon: Beer, defaultAbv: 5, defaultVolume: 330 },
    { label: '葡萄酒', icon: Wine, defaultAbv: 12, defaultVolume: 125 },
    { label: '烈酒', icon: GlassWater, defaultAbv: 40, defaultVolume: 30 },
]

export default function DrinkForm({ onDrinkAdded }: { onDrinkAdded: () => void }) {
    const [type, setType] = useState('啤酒')
    const [volume, setVolume] = useState('330')
    const [abv, setAbv] = useState('5')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase.from('drinks').insert({
            user_id: user.id,
            alcohol_type: type,
            volume_cc: parseInt(volume),
            abv: parseFloat(abv),
        })

        if (!error) {
            onDrinkAdded()
            // reset form partially
            setVolume('330')
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card space-y-6">
            <h2 className="text-xl font-bold text-slate-200">新增飲酒紀錄</h2>

            <div className="grid grid-cols-3 gap-3">
                {DRINK_TYPES.map((dt) => (
                    <button
                        key={dt.label}
                        type="button"
                        onClick={() => {
                            setType(dt.label)
                            setAbv(dt.defaultAbv.toString())
                            setVolume(dt.defaultVolume.toString())
                        }}
                        className={`flex flex-col items-center p-3 rounded-xl border transition-all ${type === dt.label
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                    >
                        <dt.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs">{dt.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">容量 (CC)</label>
                    <input
                        type="number"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">酒精濃度 (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={abv}
                        onChange={(e) => setAbv(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <><Plus className="w-5 h-5 mr-2" /> 新增紀錄</>
                )}
            </button>
        </form>
    )
}
