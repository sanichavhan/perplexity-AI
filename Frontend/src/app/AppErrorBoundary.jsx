import React from 'react';
import { useRouteError, useNavigate } from 'react-router';

const AppErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Application Error:', error);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans text-gray-200">
      <div className="max-w-md w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl bg-opacity-80">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Unexpected Application Error!</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Something went wrong while rendering this page. Our team has been notified.
          </p>

          <div className="w-full bg-black/20 rounded-lg p-4 mb-8 text-left border border-white/5">
            <p className="text-xs font-mono text-red-400 break-words overflow-auto max-h-32 custom-scrollbar">
              {error?.message || error?.statusText || 'Unknown Error'}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">refresh</span>
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-[#2F2F2F] text-white font-semibold rounded-xl hover:bg-[#3F3F3F] transition-colors border border-white/10"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppErrorBoundary;
