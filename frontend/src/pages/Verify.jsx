import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../api';

const Verify = () => {
    const [serial, setSerial] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [verifiedDiploma, setVerifiedDiploma] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!serial.trim()) return;

        setStatus('loading');
        setVerifiedDiploma(null);

        try {
            // Using the verify action on DiplomaViewSet
            // The endpoint is likely /api/diplomas/{serial}/verify/
            const response = await api.get(`diplomas/${serial.trim()}/verify/`);
            setVerifiedDiploma(response.data);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center bg-green-500/10 p-4 rounded-full mb-2">
                    <ShieldCheck className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-4xl font-bold text-white">Vérification de Diplôme</h1>
                <p className="text-slate-400">Système officiel de vérification des diplômes.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
                <form onSubmit={handleVerify} className="space-y-4">
                    <label className="text-sm font-medium text-slate-300 ml-1">Numéro de série du diplôme</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all text-lg placeholder:text-slate-700 font-mono"
                            placeholder="ex: DIP-12345"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2"
                    >
                        {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
                        {status === 'loading' ? 'Recherche en cours...' : 'Vérifier le diplôme'}
                    </button>
                </form>

                {status === 'success' && verifiedDiploma && (
                    <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Diplôme Authentique</h3>
                                    <p className="text-green-400/80 text-sm">Ce document a été officiellement délivré et signé.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-500/20">
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Titulaire</span>
                                        <p className="text-slate-200 font-medium">{verifiedDiploma.student_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Diplôme</span>
                                        <p className="text-slate-200 font-medium">{verifiedDiploma.degree_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Date Graduation</span>
                                        <p className="text-slate-200 font-medium">{new Date(verifiedDiploma.graduation_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Statut</span>
                                        <p className="text-green-400 font-medium">{verifiedDiploma.is_signed ? 'Signé' : 'En attente'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-white">Diplôme Non Trouvé</h3>
                                <p className="text-red-400/80 text-sm">Le numéro de série saisi ne correspond à aucun diplôme authentifié dans notre base de données.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-center text-slate-500 text-xs px-12 leading-relaxed">
                Ce système utilise des signatures cryptographiques pour garantir l'authenticité des diplômes.
                Pour toute question, contactez le service de la scolarité.
            </p>
        </div>
    );
};

export default Verify;
