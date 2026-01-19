'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import AlcoholSummary from '@/components/AlcoholSummary'
import DrinkForm from '@/components/DrinkForm'
import DrinkList from '@/components/DrinkList'
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const [drinks, setDrinks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    const fetchDrinks = useCallback(async () => {
        // Get today's start in ISO format
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data, error } = await supabase
            .from('drinks')
            .select('*')
            .gte('created_at', today.toISOString())
            .order('created_at', { ascending: false })

        if (!error && data) {
            setDrinks(data)
        }
    }, [supabase])

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)
            await fetchDrinks()
            setLoading(false)
        }

        checkUser()
    }, [supabase, router, fetchDrinks])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const totalPureCc = drinks.reduce((acc, drink) => {
        return acc + (drink.volume_cc * (drink.abv / 100))
    }, 0)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between glass p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">目前的飲酒者</p>
                        <p className="text-sm text-slate-200 font-bold truncate max-w-[150px]">
                            {user?.email?.split('@')[0]}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                    title="登出"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                </button>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Summary and Form */}
                <div className="lg:col-span-5 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <AlcoholSummary totalPureCc={totalPureCc} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <DrinkForm onDrinkAdded={fetchDrinks} />
                    </motion.div>
                </div>

                {/* Right Column: History */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <DrinkList drinks={drinks} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
