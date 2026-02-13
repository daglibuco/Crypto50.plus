import React, { useState } from 'react';
import { Lock, User, ShieldCheck, X, LogIn, AlertCircle } from 'lucide-react';
import { validateMemberLogin } from '../services/crmService';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: any, role: 'member' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = validateMemberLogin(email);
    if (user) {
      onLogin(user, 'member');
      onClose();
    } else {
      setError("Email not found. Please register first.");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded Admin Credentials as requested
    if (username === 'Crypto50.plus' && password === '?C50+?') {
      onLogin({ firstName: 'Admin', lastName: 'User' }, 'admin');
      onClose();
    } else {
      setError("Invalid Administrator Credentials.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
            <p className="text-slate-500 text-sm">Access your secure portal</p>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
                onClick={() => { setActiveTab('member'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'member' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Member Login
            </button>
            <button 
                onClick={() => { setActiveTab('admin'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Admin Access
            </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
        )}

        {/* MEMBER FORM */}
        {activeTab === 'member' && (
            <form onSubmit={handleMemberLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                        <User className="w-3 h-3" /> Registered Email
                    </label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <LogIn className="w-5 h-5" /> Login
                </button>
            </form>
        )}

        {/* ADMIN FORM */}
        {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Username
                    </label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Password
                    </label>
                    <input 
                        type="password" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="w-5 h-5" /> Admin Login
                </button>
            </form>
        )}
      </div>
    </div>
  );
};
