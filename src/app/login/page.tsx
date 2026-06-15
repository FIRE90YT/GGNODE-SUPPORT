"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Server, Shield, Sparkles } from "lucide-react";
import { loginAction, registerAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  // Track mouse for subtle background parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const action = isRegistering ? registerAction : loginAction;
      const result = await action(formData);
      if (result?.error) {
        setErrorMsg(result.error);
      }
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[var(--color-bg-base)]">
      {/* Interactive Background SVG */}
      <motion.div 
        animate={{ 
          x: mousePosition.x * -50, 
          y: mousePosition.y * -50 
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="30%" cy="20%" r="400" fill="url(#glow1)" />
          <circle cx="70%" cy="80%" r="500" fill="url(#glow2)" />
        </svg>
      </motion.div>

      {/* Floating abstract particles */}
      {[
        { w: 150, h: 120, l: 10, t: 20 },
        { w: 100, h: 150, l: 80, t: 10 },
        { w: 200, h: 100, l: 15, t: 80 },
        { w: 120, h: 120, l: 85, t: 85 },
        { w: 80, h: 80, l: 50, t: 50 },
        { w: 180, h: 160, l: 40, t: 10 }
      ].map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className="absolute rounded-full bg-[var(--color-brand)]/30 z-0"
          style={{
            width: p.w,
            height: p.h,
            left: `${p.l}%`,
            top: `${p.t}%`,
            filter: "blur(50px)",
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="relative bg-[var(--color-bg-panel)]/60 backdrop-blur-2xl border border-[var(--color-border)] rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* subtle top border glow breathing animation */}
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent" 
          />
          
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col relative z-10">
            <motion.div variants={itemVariants} className="flex justify-center mb-8 relative">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-4 bg-[var(--color-bg-base)] rounded-2xl border border-[var(--color-border)] shadow-inner cursor-pointer"
              >
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[var(--color-brand)]/20 blur-xl rounded-full" 
                />
                <Server className="w-10 h-10 text-[var(--color-brand)] relative z-10" />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.h1 layout="position" className="text-3xl font-bold text-[var(--color-text-main)] tracking-tight">
                {isRegistering ? "Create Account" : "Welcome Back"}
              </motion.h1>
              <motion.p layout="position" className="text-[var(--color-text-muted)] mt-2 flex justify-center items-center gap-2">
                {isRegistering ? "Join GGNODES Support Platform" : "Sign in to your GGNODES account"}
                {isRegistering && <Sparkles className="w-4 h-4 text-yellow-400" />}
              </motion.p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {errorMsg}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text-muted)] pl-1">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-brand)] group-focus-within/input:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 focus:border-[var(--color-brand)] transition-all duration-300"
                    placeholder="admin@ggnodes.com"
                  />
                  {/* Focus background glow behind input */}
                  <div className="absolute inset-0 -z-10 bg-[var(--color-brand)]/0 group-focus-within/input:bg-[var(--color-brand)]/10 blur-xl rounded-xl transition-all duration-500" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text-muted)] pl-1">Password</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-brand)] group-focus-within/input:scale-110 transition-all duration-300" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/50 focus:border-[var(--color-brand)] transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 -z-10 bg-[var(--color-brand)]/0 group-focus-within/input:bg-[var(--color-brand)]/10 blur-xl rounded-xl transition-all duration-500" />
                </div>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {!isRegistering && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center mt-2">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-brand)] focus:ring-[var(--color-brand)] focus:ring-offset-[var(--color-bg-base)] accent-[var(--color-brand)] cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text-muted)] cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm mt-2">
                      <a href="#" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants} className="pt-2 relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPending}
                  className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] focus:ring-offset-[var(--color-bg-base)] transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] overflow-hidden disabled:opacity-50"
                >
                  <motion.span layout="position">
                    {isPending ? "Please wait..." : (isRegistering ? "Create Account" : "Sign In")}
                  </motion.span>
                  {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  
                  {/* Button shine effect */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" 
                  />
                </motion.button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm text-[var(--color-text-muted)] flex flex-wrap justify-center items-center gap-1">
                <motion.span layout="position">{isRegistering ? "Already have an account?" : "Don't have an account?"}</motion.span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="group font-medium text-[var(--color-text-main)] hover:text-[var(--color-brand)] transition-colors cursor-pointer relative"
                >
                  <motion.span layout="position">{isRegistering ? "Sign in instead" : "Register now"}</motion.span>
                  {/* Underline animation on hover */}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[var(--color-brand)] transition-all duration-300 group-hover:w-full" />
                </button>
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]/70">
              <Shield className="w-3 h-3" />
              <span>Secure connection to GGNODES</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
