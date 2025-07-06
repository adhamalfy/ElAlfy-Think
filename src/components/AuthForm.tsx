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
        toast.success("أهلاً بعودتك!");
        router.push("/chat");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        if (typeof window !== "undefined") {
          localStorage.setItem("welcomeName", name);
        }
        toast.success(`Registration successful! Welcome, ${name}!`);
        router.push("/chat");
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
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition flex items-center justify-center" disabled={loading}>
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  ) : (
                    "Sign In"
                  )}
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
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition flex items-center justify-center" disabled={loading}>
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                  ) : (
                    "Sign Up"
                  )}
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
