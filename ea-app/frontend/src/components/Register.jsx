import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
  const [mode, setMode] = useState('signup')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const response = await fetch(
          mode === "signup"
            ? "http://localhost:5000/api/auth/register"
            : "http://localhost:5000/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            alert("User with this email already exists.");
          } else {
            alert(result.error || result.message || "Something went wrong");
          }
          setLoading(false);
          return;
        }

        if (!result.user || !result.user.role) {
          alert("Invalid user data returned from server.");
          setLoading(false);
          return;
        }

        const userRole = result.user.role.toLowerCase();

        localStorage.setItem("token", result.token);
        localStorage.setItem("role", userRole);

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } catch (err) {
        console.error(err);
        alert("Cannot connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };



  const isSignup = mode === 'signup'

  const panelVariants = {
    hidden: { opacity: 0, x: isSignup ? -30 : 30, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: isSignup ? 30 : -30, scale: 0.98 },
  }

  return (
    <motion.div id='register'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col items-center gap-8 px-4 sm:px-12 lg:px-24 xl:px-40 pt-24 pb-16 text-gray-700 dark:text-white"
    >
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {isSignup ? 'Join our community!' : 'Welcome back!'}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          {isSignup 
            ? 'From strategy to execution, we craft digital solutions that move your business forward' 
            : 'Sign in to your account and pick up right where you left off'}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          {['signup', 'login'].map(tab => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                mode === tab ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
              } relative`}
            >
              {tab === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-6 sm:p-8">
          {isSignup && <input name="username" placeholder="Your username" required className="input-field" />}
          <input name="email" type="email" placeholder="Email" required className="input-field" />
          <input name="password" type="password" placeholder="Password" required className="input-field" />

          {isSignup && (
            <label className="flex items-center gap-2">
              <input type="checkbox" required className="accent-primary" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                I agree to the <a className="text-primary" href="#">Terms</a> and <a className="text-primary" href="#">Privacy</a>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setMode(isSignup ? 'login' : 'signup')} className="text-primary font-semibold hover:underline">
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default AuthPage