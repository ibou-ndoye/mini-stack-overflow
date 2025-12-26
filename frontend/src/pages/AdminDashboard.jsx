import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, GraduationCap, Download, ExternalLink, Users, FileText, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('diplomas');
    const [diplomas, setDiplomas] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDiploma, setNewDiploma] = useState({
        student_name: '',
        student_id: '',
        degree_name: '',
        major: '',
        graduation_date: new Date().toISOString().split('T')[0],
        is_signed: false
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [diplomasRes, usersRes] = await Promise.all([
                api.get('diplomas/'),
                api.get('users/')
            ]);
            const diplomaData = diplomasRes.data.results || diplomasRes.data;
            const userData = usersRes.data.results || usersRes.data;
            setDiplomas(Array.isArray(diplomaData) ? diplomaData : []);
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            setError("Erreur lors de la récupération des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateDiploma = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('diplomas/', newDiploma);
            setShowModal(false);
            setNewDiploma({
                student_name: '',
                student_id: '',
                degree_name: '',
                major: '',
                graduation_date: new Date().toISOString().split('T')[0],
                is_signed: false
            });
            fetchData();
        } catch (err) {
            alert("Erreur lors de la création du diplôme.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredDiplomas = Array.isArray(diplomas) ? diplomas.filter(d =>
        d.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const filteredUsers = Array.isArray(users) ? users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tableau de Bord Admin</h1>
                    <p className="text-slate-400">Gérez les diplômes et les utilisateurs.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-900/20 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Diplôme
                </button>
            </div>

            {/* Modal de création */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Nouveau Diplôme</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleCreateDiploma} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nom de l'étudiant</label>
                                <input
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:border-primary-500 outline-none"
                                    value={newDiploma.student_name}
                                    onChange={e => setNewDiploma({ ...newDiploma, student_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Numéro Matricule</label>
                                <input
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:border-primary-500 outline-none"
                                    value={newDiploma.student_id}
                                    onChange={e => setNewDiploma({ ...newDiploma, student_id: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nom du Diplôme</label>
                                <input
                                    required
                                    placeholder="ex: Licence en Informatique"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:border-primary-500 outline-none"
                                    value={newDiploma.degree_name}
                                    onChange={e => setNewDiploma({ ...newDiploma, degree_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Spécialité</label>
                                <input
                                    required
                                    placeholder="ex: Génie Logiciel"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:border-primary-500 outline-none"
                                    value={newDiploma.major}
                                    onChange={e => setNewDiploma({ ...newDiploma, major: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Date de Graduation</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white focus:border-primary-500 outline-none"
                                    value={newDiploma.graduation_date}
                                    onChange={e => setNewDiploma({ ...newDiploma, graduation_date: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-8">
                                <input
                                    type="checkbox"
                                    id="is_signed"
                                    className="w-5 h-5 accent-primary-600"
                                    checked={newDiploma.is_signed}
                                    onChange={e => setNewDiploma({ ...newDiploma, is_signed: e.target.checked })}
                                />
                                <label htmlFor="is_signed" className="text-sm font-medium text-slate-300">Signer numériquement</label>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Créer le Diplôme
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-primary-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-primary-500/10 p-3 rounded-xl">
                            <GraduationCap className="w-6 h-6 text-primary-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{diplomas.length}</div>
                    <div className="text-sm text-slate-400">Diplômes Émis</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-500/10 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{users.length}</div>
                    <div className="text-sm text-slate-400">Utilisateurs</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-green-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-500/10 p-3 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{diplomas.filter(d => d.is_signed).length}</div>
                    <div className="text-sm text-slate-400">Signés</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-500/10 p-3 rounded-xl">
                            <FileText className="w-6 h-6 text-orange-500" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{diplomas.filter(d => !d.is_signed).length}</div>
                    <div className="text-sm text-slate-400">En Attente</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
                <button
                    onClick={() => setActiveTab('diplomas')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'diplomas'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Diplômes
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Utilisateurs
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder={activeTab === 'diplomas' ? "Rechercher par nom, matricule ou numéro de série..." : "Rechercher par nom ou email..."}
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

            {/* Table */}
            {activeTab === 'diplomas' ? (
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
                                {filteredDiplomas.map((diploma) => (
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
                                                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Télécharger">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <Link to={`/diploma/${diploma.id}`} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary-400 transition-colors" title="Voir détails">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/50 border-b border-slate-800">
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Utilisateur</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Email</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Rôle</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400">Inscription</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-10 h-10 rounded-full" alt="avatar" />
                                                <div>
                                                    <div className="text-white font-medium">{user.username}</div>
                                                    {/* User doesn't have a Bio in simple serializer, but has role */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {user.role || 'Étudiant'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(user.date_joined).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/user/${user.id}`} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary-400 transition-colors" title="Voir profil">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
