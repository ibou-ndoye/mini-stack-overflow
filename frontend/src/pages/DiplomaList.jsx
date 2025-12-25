import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, GraduationCap, Download, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const DiplomaList = () => {
    const [diplomas, setDiplomas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchDiplomas = async () => {
            try {
                const response = await api.get('diplomas/');
                setDiplomas(response.data);
            } catch (err) {
                setError("Erreur lors de la récupération des diplômes.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await api.get('profile/');
                setUser(response.data);
            } catch (error) {
                console.log("Utilisateur non connecté ou erreur profile");
            }
        };

        fetchDiplomas();
        fetchUser();
    }, []);

    const filteredDiplomas = diplomas.filter(d =>
        d.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gestion des Diplômes</h1>
                    <p className="text-slate-400">Consultez et gérez les diplômes.</p>
                </div>
                {/* Only accessible for STAFF/ADMIN roles */}
                {user && user.is_staff && (
                    <Link to="/admin" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-900/20 w-fit">
                        <Plus className="w-5 h-5" />
                        Nouveau Diplôme
                    </Link>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, matricule ou numéro de série..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-6 py-3 rounded-xl hover:bg-slate-800 transition-all">
                    <Filter className="w-5 h-5" />
                    Filtres
                </button>
            </div>

            {error && (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
                    {error}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Étudiant</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Diplôme</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Date Graduation</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Statut</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredDiplomas.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        Aucun diplôme trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredDiplomas.map((diploma) => (
                                    <tr key={diploma.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-800 p-2 rounded-lg text-primary-500">
                                                    <GraduationCap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{diploma.student_name}</div>
                                                    <div className="text-slate-500 text-xs">ID: {diploma.student_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-300">{diploma.degree_name}</div>
                                            <div className="text-slate-500 text-xs">Série: {diploma.serial_number}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(diploma.graduation_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${diploma.is_signed
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {diploma.is_signed ? 'Signé' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <Link to={`/diploma/${diploma.id}`} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary-400 transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DiplomaList;
