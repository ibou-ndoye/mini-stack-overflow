import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Lock, Mail, User as UserIcon, Shield, Loader2 } from 'lucide-react';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('auth/register/', formData);
            // After successful registration, redirect to login
            navigate('/login');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData) {
                const firstError = Object.values(errorData)[0];
                setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setError('Une erreur est survenue lors de l\'inscription.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center bg-primary-600/10 p-4 rounded-2xl mb-4 border border-primary-500/20">
                        <MessageSquare className="w-8 h-8 text-primary-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Rejoindre la communauté</h1>
                    <p className="text-slate-400 mt-2">Créez votre compte Stack Overflow</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Nom d'utilisateur</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all"
                                    placeholder="pseudo"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Rôle</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <select
                                    name="role"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="STUDENT">Étudiant</option>
                                    <option value="TEACHER">Enseignant</option>
                                    <option value="STAFF">Personnel</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-900/20 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Création en cours...' : 'Créer un compte'}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8 text-sm">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-400">Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
