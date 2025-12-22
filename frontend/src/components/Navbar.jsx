import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, GraduationCap, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-primary-600 p-1.5 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
                                Stack Overflow
                            </span>
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Questions
                                </Link>
                                <Link to="/diplomas" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Diplômes
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/ask" className="hidden sm:block bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary-900/20">
                            Poser une question
                        </Link>
                        <div className="ml-3 relative flex items-center gap-2">
                            <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                                Connexion
                            </Link>
                            <Link to="/register" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-slate-700">
                                S'inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
