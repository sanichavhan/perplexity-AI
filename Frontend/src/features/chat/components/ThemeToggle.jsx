import React from 'react';
import { useTheme } from '../../../hooks/useTheme';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface-container transition-all group cursor-pointer text-sm font-medium text-on-surface-variant hover:text-on-surface"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-surface-container text-yellow-400' : 'bg-surface-container text-indigo-500'}`}>
                <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:rotate-12">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </div>
            <span className="truncate flex-1 text-left tracking-tight">
                {isDark ? 'Bright Mode' : 'Dark Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-secondary-container' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
        </button>
    );
};

export default ThemeToggle;
