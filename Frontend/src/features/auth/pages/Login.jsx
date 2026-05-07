import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router'
import { setError } from '../auth.slice'
import { useEffect } from 'react'


const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        // Clear error on mount
        dispatch(setError(null))
        return () => {
            // Clear error on unmount
            dispatch(setError(null))
        }
    }, [ dispatch ])

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
    const error = useSelector(state => state.auth.error);

    if(!loading && user){
        return <Navigate to="/dashboard" replace />
    }

    return (
        <section className="bg-background text-on-surface flex flex-col min-h-screen font-body">
            <main className="flex-grow flex flex-col items-center justify-center px-8 relative overflow-hidden">
                {error && (
                    <div className="w-full max-w-sm mb-8 bg-error/10 border border-error/20 text-error text-[0.7rem] px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm z-20">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        <span className="font-bold tracking-wider uppercase">{error}</span>
                    </div>
                )}
                {/* Aesthetic Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container opacity-10 blur-[120px] rounded-full pointer-events-none transition-colors duration-500"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-container opacity-5 blur-[100px] rounded-full pointer-events-none transition-colors duration-500"></div>
                
                {/* Branding Section */}
                <div className="mb-16 text-center z-10 mt-10">
                    <h1 className="text-on-surface font-black tracking-[0.2em] text-3xl font-headline italic">
                        NovaAI
                    </h1>
                    <p className="text-on-surface-variant text-[0.65rem] md:text-xs tracking-[0.2em] mt-4 uppercase opacity-60">
                        Join the Intelligence
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
                            <label htmlFor="email" className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">Email</label>
                            <div className="bg-surface h-14 flex items-center px-4 rounded-lg group border border-outline focus-within:ring-1 focus-within:ring-primary-container/50 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-on-surface-variant mr-3 text-lg group-focus-within:text-primary-container">alternate_email</span>
                                <input 
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                        if (error) dispatch(setError(null))
                                    }}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-on-surface-variant/30 placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-on-surface" 
                                    placeholder="EMAIL ADDRESS" 
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant ml-1 font-bold">Password</label>
                            <div className="bg-surface h-14 flex items-center px-4 rounded-lg group border border-outline focus-within:ring-1 focus-within:ring-primary-container/50 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-on-surface-variant mr-3 text-lg group-focus-within:text-primary-container">fingerprint</span>
                                <input 
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value)
                                        if (error) dispatch(setError(null))
                                    }}
                                    required
                                    className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium tracking-tight placeholder:text-on-surface-variant/30 placeholder:text-[0.75rem] placeholder:tracking-widest outline-none text-on-surface" 
                                    placeholder="PASSWORD" 
                                />
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="space-y-8 pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 bg-primary-container text-on-primary-container font-bold uppercase tracking-[0.15em] text-sm rounded-lg active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-primary-container/20"
                            >
                                <span className="text-gray-900">LOGIN</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            
                            <div className="text-center">
                                {/* <p className="text-on-surface-variant text-xs tracking-tight">
                                    Unauthorized access is strictly monitored.
                                </p> */}
                                <div className="mt-4">
                                    <Link to="/register" className="text-primary-container text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4 transition-all">
                                        If You Haven't Created an Account Register Here
                                    </Link>
                                </div>  
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Metadata */}
                <div className="absolute bottom-10 text-center w-full">
                    <div className="flex items-center justify-center gap-4 opacity-20">
                        <div className="h-[1px] w-8 bg-on-surface-variant"></div>
                        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-on-surface-variant">Join the Intelligence</span>
                        <div className="h-[1px] w-8 bg-on-surface-variant"></div>
                    </div>
                </div>
            </main>

            {/* Illustration Component */}
            <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none">
                <div className="relative w-full h-full text-on-surface-variant">
                    <div className="absolute inset-0 border border-current opacity-20 rotate-45"></div>
                    <div className="absolute inset-4 border border-current opacity-10 -rotate-12"></div>
                    <div className="absolute inset-10 border border-primary-container opacity-20 rotate-90"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-container rounded-full animate-pulse shadow-lg shadow-primary-container/50"></div>
                </div>
            </div>
        </section>
    )
}

export default Login