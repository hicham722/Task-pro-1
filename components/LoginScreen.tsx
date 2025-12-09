import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API call / OAuth flow
    setTimeout(() => {
      const mockUser: User = {
        name: 'Adan Food',
        email: 'adan.food@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Adan+Food&background=2563eb&color=fff'
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
       <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

       <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden relative z-10 border border-slate-100">
          <div className="p-10 text-center">
             <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-8 shadow-lg shadow-blue-500/30 transform rotate-3">
                TF
             </div>
             
             <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Welcome Back</h1>
             <p className="text-slate-500 mb-10 leading-relaxed">
               Streamline your productivity with TaskFlow Pro. 
               Sign in to access your dashboard.
             </p>

             <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden shadow-sm active:scale-[0.98]"
             >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></span>
                        <span className="text-slate-400">Signing in...</span>
                    </div>
                ) : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="group-hover:text-slate-900 transition-colors">Continue with Google</span>
                    </>
                )}
             </button>
             
             <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 py-2 rounded-lg">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Free Forever</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 py-2 rounded-lg">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span>Secure Data</span>
                </div>
             </div>
          </div>
          <div className="bg-slate-50 p-5 text-center border-t border-slate-100">
             <p className="text-xs text-slate-400">
                By continuing, you agree to TaskFlow's <a href="#" className="text-blue-600 hover:underline">Terms</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
             </p>
          </div>
       </div>
    </div>
  );
};

export default LoginScreen;