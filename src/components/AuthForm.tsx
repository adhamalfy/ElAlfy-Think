"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const AuthForm: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fly, setFly] = useState(false);
  const router = useRouter();

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password || (!isSignIn && !name)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (isSignIn) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setFly(true);
        setTimeout(() => {
          toast.success("أهلاً بعودتك!");
          router.push("/chat");
        }, 3000); // 3 ثواني
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setFly(true);
        setTimeout(() => {
          toast.success(`Registration successful! Welcome, ${name}!`);
          router.push("/chat");
        }, 3000); // 3 ثواني
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <Toaster position="top-center" />
      <div className="bg-gray-800 pt-6 pb-8 px-8 rounded-xl shadow-lg w-full max-w-md relative overflow-hidden flex flex-col items-center">
        <div className="mb-2 flex justify-center">
          <Image src="/assests/logo.png" alt="Logo" width={180} height={60} style={{objectFit: 'contain'}} />
        </div>
        <AnimatePresence mode="wait">
          {isSignIn ? (
            <motion.div
              key="signIn"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                />
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition flex items-center justify-center relative overflow-hidden h-12"
                  disabled={loading}
                  style={{ minHeight: 48 }}
                >
                  {fly && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 120, opacity: 0.3 }}
                      transition={{ duration: 2.5, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: 6,
                        zIndex: 0,
                        pointerEvents: 'none',
                      }}
                    >
                      <svg width="120" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="120" height="6" rx="3" fill="#fff" fillOpacity="0.2"/>
                      </svg>
                    </motion.span>
                  )}
                  <span className="flex items-center gap-2 w-full justify-center relative z-10">
                    <AnimatePresence initial={false}>
                      {!fly ? (
                        <>
                          <span style={{ opacity: fly ? 0 : 1, transition: 'opacity 0.2s' }}>
                            {loading ? '' : (isSignIn ? "Sign In" : "Sign Up")}
                          </span>
                          <motion.span
                            key="svg"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="inline-block"
                            style={{ marginLeft: 8 }}
                          >
                            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 8L40 24L8 40V28L28 24L8 20V8Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.span>
                        </>
                      ) : (
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            pointerEvents: 'none',
                            width: 48,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'visible',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0, opacity: 0.15 }}
                            animate={{ width: 48, opacity: 0.25 }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '60%',
                              transform: 'translate(-50%, -50%)',
                              height: 4,
                              background: 'rgba(255,255,255,0.18)',
                              borderRadius: 2,
                              zIndex: 1,
                              width: 48,
                              pointerEvents: 'none',
                            }}
                          />
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2 }}>
                            <path d="M8 8L40 24L8 40V28L28 24L8 20V8Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </form>
              <p className="text-center text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <button onClick={toggleForm} className="text-blue-400 hover:underline">Sign Up</button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signUp"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
                />
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition flex items-center justify-center relative overflow-hidden h-12"
                  disabled={loading}
                  style={{ minHeight: 48 }}
                >
                  {fly && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 120, opacity: 0.3 }}
                      transition={{ duration: 2.5, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: 6,
                        zIndex: 0,
                        pointerEvents: 'none',
                      }}
                    >
                      <svg width="120" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="120" height="6" rx="3" fill="#fff" fillOpacity="0.2"/>
                      </svg>
                    </motion.span>
                  )}
                  <span className="flex items-center gap-2 w-full justify-center relative z-10">
                    <AnimatePresence initial={false}>
                      {!fly ? (
                        <>
                         
                          <span style={{ opacity: fly ? 0 : 1, transition: 'opacity 0.2s' }}>
                            {isSignIn ? "Sign In" : "Sign Up"}
                          </span>
                          <motion.span
                            key="svg"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="inline-block"
                            style={{ marginLeft: 8 }}
                          >
                            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 8L40 24L8 40V28L28 24L8 20V8Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.span>
                        </>
                      ) : (
                        <span
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            pointerEvents: 'none',
                            width: 48,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'visible',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0, opacity: 0.15 }}
                            animate={{ width: 48, opacity: 0.25 }}
                            transition={{ duration: 1.2, ease: 'easeInOut' }}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '60%',
                              transform: 'translate(-50%, -50%)',
                              height: 4,
                              background: 'rgba(255,255,255,0.18)',
                              borderRadius: 2,
                              zIndex: 1,
                              width: 48,
                              pointerEvents: 'none',
                            }}
                          />
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2 }}>
                            <path d="M8 8L40 24L8 40V28L28 24L8 20V8Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </form>
              <p className="text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <button onClick={toggleForm} className="text-blue-400 hover:underline">Sign In</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthForm;
