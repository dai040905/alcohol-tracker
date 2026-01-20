'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Scale, Loader2, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileModal({
    isOpen,
    onClose,
    initialData,
    onSave
}: {
    isOpen: boolean,
    onClose: () => void,
    initialData?: { gender: string, weight_kg: number },
    onSave: () => void
}) {
    const [gender, setGender] = useState(initialData?.gender || 'male')
    const [weight, setWeight] = useState(initialData?.weight_kg?.toString() || '70')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            gender,
            weight_kg: parseFloat(weight),
            updated_at: new Date().toISOString(),
        })

        if (!error) {
            onSave()
            onClose()
        }
        setLoading(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card w-full max-w-sm border-primary/20"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-100">設定個人檔案</h2>
                        </div>

                        <p className="text-xs text-slate-400 mb-6">
                            我們需要這些資訊來根據 Widmark 公式計算您的血液酒精濃度 (BAC)。
                        </p>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">您的性別</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['male', 'female'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`py-3 rounded-xl border transition-all text-sm font-bold ${gender === g
                                                    ? 'bg-primary/20 border-primary text-primary'
                                                    : 'bg-white/5 border-white/10 text-slate-500'
                                                }`}
                                        >
                                            {g === 'male' ? '男生' : '女生'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">體重 (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-slate-100"
                                        placeholder="例如: 70"
                                        required
                                        min="20"
                                        max="300"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 transition-all"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <><Save className="w-4 h-4 mr-2" /> 儲存設定</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
