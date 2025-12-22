import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="border-t border-slate-900 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>© 2025 Stack Overflow. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
