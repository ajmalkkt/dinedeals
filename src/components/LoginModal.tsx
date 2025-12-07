import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useModal } from '../contexts/ModalContext';
import { X } from 'lucide-react';
import { firebaseSignup, firebaseResetPassword } from '../auth/firebaseClient';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export default function LoginModal() {
  const { isLoginOpen, closeLogin, onLoginSuccess } = useModal(); // ✅ Import onLoginSuccess
  const auth = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('public'); // Default role
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (!isLoginOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        await auth.loginWithEmail?.(email, password);
        onLoginSuccess(); // ✅ Run the callback (e.g., navigate to admin)
      } 
      else if (mode === 'SIGNUP') {
        const user = await firebaseSignup(email, password, name);
        
        // OPTIONAL: Call your Backend here to set the Role
        // const token = await user.getIdToken();
        // await fetch('http://localhost:5000/api/auth/set-role', {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ role })
        // });
        
        setMsg("Account created! Please login.");
        setMode('LOGIN');
      } 
      else if (mode === 'FORGOT_PASSWORD') {
        await firebaseResetPassword(email);
        setMsg(`Password reset link sent to ${email}`);
        setMode('LOGIN');
      }
    } catch (err: any) {
      // Clean up error messages
      const msg = err.message || "An error occurred";
      if (msg.includes("auth/user-not-found")) setError("No user found with this email.");
      else if (msg.includes("auth/wrong-password")) setError("Incorrect password.");
      else if (msg.includes("auth/email-already-in-use")) setError("Email already exists.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'LOGIN' && 'Welcome Back'}
            {mode === 'SIGNUP' && 'Create Account'}
            {mode === 'FORGOT_PASSWORD' && 'Reset Password'}
          </h2>
          <button onClick={closeLogin} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
          {msg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{msg}</div>}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  required 
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            {mode !== 'FORGOT_PASSWORD' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
            )}

            {/* Role Selection for Signup */}
            {mode === 'SIGNUP' && (
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="public">Foodie (Public User)</option>
                  <option value="restaurant_owner">Restaurant Owner</option>
                </select>
               </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : (mode === 'LOGIN' ? 'Sign In' : mode === 'SIGNUP' ? 'Create Account' : 'Send Reset Link')}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            {mode === 'LOGIN' && (
              <>
                <p>New here? <button onClick={() => setMode('SIGNUP')} className="text-blue-600 font-semibold">Sign up</button></p>
                <button onClick={() => setMode('FORGOT_PASSWORD')} className="text-gray-500 hover:text-gray-800">Forgot Password?</button>
              </>
            )}
            
            {(mode === 'SIGNUP' || mode === 'FORGOT_PASSWORD') && (
              <p>Already have an account? <button onClick={() => setMode('LOGIN')} className="text-blue-600 font-semibold">Sign In</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}