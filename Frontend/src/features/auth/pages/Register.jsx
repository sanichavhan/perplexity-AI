import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { handleRegister } = useAuth()
    const loading = useSelector(state => state.auth.loading)
    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            username,
            email,
            password,
        }

        const success = await handleRegister(payload)
        if (success) {
            navigate('/dashboard')
        }
    }

    return (
        <section className="bg-[#131313] text-[#e2e2e2] flex flex-col min-h-screen font-body selection:bg-[#00fbfb] selection:text-[#007070]">
            <main className="flex-grow flex flex-col items-center justify-center px-8 relative overflow-hidden">
                {/* Aesthetic Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#035252] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00fbfb] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
                
                {/* Branding Section */}
                <div className="mb-16 text-center z-10 mt-10">
                    <h1 className="text-white font-black tracking-[0.4em] text-2xl md:text-3xl uppercase font-headline">
                        REGISTER
                    </h1>
                    {/* <p className="text-[#839493] text-[0.65rem] md:text-xs tracking-[0.2em] mt-4 uppercase opacity-60">
                        Agent Onboarding Protocol
                    </p> */}
                </div>

                {/* Register Form Container */}
                <div className="w-full max-w-sm z-10 space-y-12">
                    <form onSubmit={submitForm} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-[0.6875rem] uppercase tracking-widest text-[#839493] ml-1 font-bold">USERNAME</label>
                            <div className="bg-[#1f1f1f] h-14 flex items-center px-4 rounded-lg group focus-within:ring-1 focus-within:ring-[#00fbfb]/50 transition-all">
                                <span className="material-symbols-outlined text-[#839493] mr-3 text-lg group-focus-within:text-[#00fbfb]">badge</span>
                                <input 
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-[#353535] placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-white" 
                                    placeholder="PUBLIC ALIAS" 
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[0.6875rem] uppercase tracking-widest text-[#839493] ml-1 font-bold">EMAIL</label>
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
                            <label htmlFor="password" className="text-[0.6875rem] uppercase tracking-widest text-[#839493] ml-1 font-bold">PASSWORD</label>
                            <div className="bg-[#1f1f1f] h-14 flex items-center px-4 rounded-lg group focus-within:ring-1 focus-within:ring-[#00fbfb]/50 transition-all">
                                <span className="material-symbols-outlined text-[#839493] mr-3 text-lg group-focus-within:text-[#00fbfb]">fingerprint</span>
                                <input 
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-[#353535] placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-white" 
                                    placeholder="CREATE PASSWORD" 
                                />
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="space-y-8 pt-4">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#00fbfb] text-[#003737] font-black uppercase tracking-[0.15em] text-sm rounded-lg active:scale-[0.98] transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>Create Account</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add_circle</span>
                            </button>
                            
                            <div className="text-center">
                                <div className="mt-4">
                                    <Link to="/login" className="text-[#00dddd] text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4 transition-all">
                                        Already Registered? Login
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
                        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[#839493]">Secure Onboarding</span>
                        <div className="h-[1px] w-8 bg-[#839493]"></div>
                    </div>
                </div>
            </main>

            {/* Illustration Component */}
            <div className="hidden lg:block absolute left-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none">
                <div className="relative w-full h-full text-[#839493]">
                    <div className="absolute inset-0 border border-current opacity-20 -rotate-45"></div>
                    <div className="absolute inset-4 border border-current opacity-10 rotate-12"></div>
                    <div className="absolute inset-10 border border-[#00fbfb] opacity-20 -rotate-90"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00fbfb] rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}

export default Register