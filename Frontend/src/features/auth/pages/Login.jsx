import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        const success = await handleLogin(payload)
        if (success) {
            navigate("/dashboard")
        }

    }

    if(!loading && user){
        return <Navigate to="/dashboard" replace />
    }

    return (
        <section className="bg-[#131313] text-[#e2e2e2] flex flex-col min-h-screen font-body selection:bg-[#00fbfb] selection:text-[#007070]">
            <main className="flex-grow flex flex-col items-center justify-center px-8 relative overflow-hidden">
                {/* Aesthetic Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#035252] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00fbfb] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
                
                {/* Branding Section */}
                <div className="mb-16 text-center z-10 mt-10">
                    <h1 className="text-white font-black tracking-[0.2em] text-3xl font-headline italic">
                        NovaAI
                    </h1>
                    <p className="text-[#839493] text-[0.65rem] md:text-xs tracking-[0.2em] mt-4 uppercase opacity-60">
                        Intelligence Curated
                    </p>
                    {/* <p className="text-[#839493] text-[0.65rem] md:text-xs tracking-[0.2em] mt-4 uppercase opacity-60">
                        Institutional Access Protocol
                    </p> */}
                </div>

                {/* Login Form Container */}
                <div className="w-full max-w-sm z-10 space-y-12">
                    <form onSubmit={submitForm} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[0.6875rem] uppercase tracking-widest text-[#839493] ml-1 font-bold">Email</label>
                            <div className="bg-[#1f1f1f] h-14 flex items-center px-4 rounded-lg group focus-within:ring-1 focus-within:ring-[#00fbfb]/50 transition-all">
                                <span className="material-symbols-outlined text-[#839493] mr-3 text-lg group-focus-within:text-[#00fbfb]">alternate_email</span>
                                <input 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-[#353535] placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-white" 
                                    placeholder="EMAIL ADDRESS" 
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[0.6875rem] uppercase tracking-widest text-[#839493] ml-1 font-bold">Password</label>
                            <div className="bg-[#1f1f1f] h-14 flex items-center px-4 rounded-lg group focus-within:ring-1 focus-within:ring-[#00fbfb]/50 transition-all">
                                <span className="material-symbols-outlined text-[#839493] mr-3 text-lg group-focus-within:text-[#00fbfb]">fingerprint</span>
                                <input 
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-[#353535] placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-white" 
                                    placeholder="PASSWORD" 
                                />
                            </div>
                        </div>

                        {/* Recovery Link */}
                        <div className="flex justify-end">
                            <button type="button" className="text-[0.6875rem] uppercase tracking-tighter text-[#839493] hover:text-[#00fbfb] transition-colors cursor-pointer">
                                Forgotten Cipher?
                            </button>
                        </div>

                        {/* Action Section */}
                        <div className="space-y-8 pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 bg-[#00fbfb] text-[#003737] font-black uppercase tracking-[0.15em] text-sm rounded-lg active:scale-[0.98] transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>LOGIN</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            
                            <div className="text-center">
                                <p className="text-[#839493] text-xs tracking-tight">
                                    Unauthorized access is strictly monitored.
                                </p>
                                <div className="mt-4">
                                    <Link to="/register" className="text-[#00dddd] text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4 transition-all">
                                        Join NovaAI Community
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Metadata */}
                <div className="absolute bottom-10 text-center w-full">
                    <div className="flex items-center justify-center gap-4 opacity-20">
                        <div className="h-[1px] w-8 bg-[#839493]"></div>
                        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#839493]">NovaAI Network</span>
                        <div className="h-[1px] w-8 bg-[#839493]"></div>
                    </div>
                </div>
            </main>

            {/* Illustration Component */}
            <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none">
                <div className="relative w-full h-full text-[#839493]">
                    <div className="absolute inset-0 border border-current opacity-20 rotate-45"></div>
                    <div className="absolute inset-4 border border-current opacity-10 -rotate-12"></div>
                    <div className="absolute inset-10 border border-[#00fbfb] opacity-20 rotate-90"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00fbfb] rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default Login