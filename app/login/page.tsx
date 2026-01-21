'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Wine, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isResetPassword, setIsResetPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isResetPassword) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
                })
                if (error) throw error
                alert('重設密碼連結已發送到您的電子郵件！')
                setIsResetPassword(false)
            } else if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                })
                if (error) throw error
                alert('請檢查郵件以確認帳號！')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || '發生錯誤')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                        <Wine className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient">酒精追蹤器</h1>
                    <p className="text-slate-400 mt-2 text-center">
                        {isResetPassword
                            ? '輸入 Email 以重設密碼'
                            : isSignUp ? '建立新帳號以開始追蹤' : '歡迎回來，請登入帳號'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">電子郵件</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    {!isResetPassword && (
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-300">密碼</label>
                                {!isSignUp && (
                                    <button
                                        type="button"
                                        onClick={() => setIsResetPassword(true)}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        忘記密碼？
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            isResetPassword ? '發送重設郵件' : isSignUp ? '註冊' : '登入'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm space-y-4">
                    {!isResetPassword ? (
                        <p>
                            {isSignUp ? '已經有帳號了？' : '還沒有帳號？'}{' '}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-primary hover:underline font-medium"
                            >
                                {isSignUp ? '登入' : '立即註冊'}
                            </button>
                        </p>
                    ) : (
                        <button
                            onClick={() => setIsResetPassword(false)}
                            className="text-primary hover:underline font-medium"
                        >
                            回登入頁面
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
