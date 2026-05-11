import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('employee'); // 'employee' or 'manager'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSuccess = async (credentialResponse) => {
    await loginWithGoogle(credentialResponse.credential);
    navigate('/dashboard');
  };

  const handleError = () => {
    setErrorMsg('Login Failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - White Background */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 relative">
        
        {/* Toggle View */}
        <div className="absolute top-6 left-6">
          <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
            <button 
              onClick={() => { setView('employee'); setErrorMsg(''); }}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${view === 'employee' ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Employee
            </button>
            <button 
              onClick={() => { setView('manager'); setErrorMsg(''); }}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${view === 'manager' ? 'bg-red-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manager
            </button>
          </div>
        </div>

        <div className="max-w-sm w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome to LayoutIQ
          </h1>
          <p className="text-gray-500 font-medium">
            {view === 'manager' ? 'Manager Sign-In' : 'Employee Sign-In'}
          </p>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              shape="rectangular"
              theme="outline"
              size="large"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Colored Background */}
      <div className={`hidden md:flex w-1/2 relative overflow-hidden transition-colors duration-500 ${view === 'manager' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}>
        {/* Background Waves/Blobs */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,40 70,20 100,50 L100,100 L0,100 Z" fill="white" />
            <path d="M0,100 C20,60 80,80 100,20 L100,0 L0,0 Z" fill="black" opacity="0.1" />
          </svg>
        </div>

        {/* Central Graphic Container */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12">
          {view === 'manager' ? (
            <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 flex flex-col shadow-2xl relative">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
               {/* Simplified Envelope Vector */}
               <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white/90" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               <div className="text-white mt-4 text-center font-medium opacity-90">Manager Portal Access</div>
            </div>
          ) : (
            <div className="w-72 h-80 bg-white shadow-2xl rounded-sm p-4 relative flex flex-col">
              <div className="absolute -left-12 bottom-12 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              {/* Simplified Calendar Vector */}
              <div className="flex justify-between items-center mb-4">
                <div className="h-2 w-16 bg-gray-200 rounded"></div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 rounded-sm"></div>
                ))}
              </div>
              <div className="text-gray-500 mt-4 text-center text-sm font-medium">Employee Workflow</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
