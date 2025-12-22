import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Award, Clock, GraduationCap, Loader2 } from 'lucide-react';
import api from '../api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch me endpoint
                const response = await api.get('users/me/');
                setProfile(response.data);
            } catch (err) {
                setError("Erreur lors de la récupération du profil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400">
                {error || "Une erreur est survenue."}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} className="w-32 h-32 rounded-3xl border-4 border-slate-800 shadow-2xl" alt="avatar" />
                        <div className="absolute -bottom-2 -right-2 bg-primary-600 p-2 rounded-xl shadow-lg">
                            <Award className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-bold text-white">{profile.username}</h1>
                        <p className="text-primary-400 font-medium">{profile.role || 'Étudiant'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Clock className="w-4 h-4" />
                                Membre depuis {new Date(profile.date_joined).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="md:ml-auto flex gap-4">
                        <div className="text-center px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <div className="text-2xl font-bold text-white">0</div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Points</div>
                        </div>
                        <div className="text-center px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <div className="text-2xl font-bold text-white">0</div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Badges</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-primary-500" />
                        Activité Récente
                    </h2>
                    <div className="space-y-4">
                        <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
                            Aucune activité récente à afficher.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <User className="w-6 h-6 text-primary-500" />
                        Bio
                    </h2>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-slate-400 text-sm leading-relaxed">
                        {profile.bio || "Aucune bio renseignée."}
                    </div>

                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 pt-4">
                        <GraduationCap className="w-6 h-6 text-green-500" />
                        Mes Diplômes
                    </h2>
                    <div className="p-4 text-center bg-slate-900/30 border border-slate-800 rounded-2xl text-slate-500 text-sm">
                        Aucun diplôme rattaché.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
