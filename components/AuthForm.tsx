"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => setIsSignIn((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
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
              <input
                type="email"
                placeholder="Email"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition">Sign In</button>
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
              <input
                type="text"
                placeholder="Name"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
              />
             
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition">Sign Up</button>
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
