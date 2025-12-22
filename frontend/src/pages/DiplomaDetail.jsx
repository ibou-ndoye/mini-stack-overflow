import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Download, Share2, ShieldCheck, QrCode, Loader2 } from 'lucide-react';
import api from '../api';

const DiplomaDetail = () => {
    const { id } = useParams();
    const [diploma, setDiploma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiploma = async () => {
            try {
                const response = await api.get(`diplomas/${id}/`);
                setDiploma(response.data);
            } catch (err) {
                setError("Diplôme non trouvé ou erreur serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiploma();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error || !diploma) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400">
                {error || "Une erreur est survenue."}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Détails du Diplôme</h1>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-800 transition-all font-medium">
                        <Printer className="w-4 h-4" />
                        Imprimer
                    </button>
                    <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary-900/20">
                        <Download className="w-4 h-4" />
                        Télécharger PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Virtual Diploma Card */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-2xl relative overflow-hidden aspect-[1.414/1] flex flex-col items-center justify-center text-slate-900 border-[12px] border-slate-100">
                        <div className="absolute top-12 left-12 w-24 h-24 opacity-20">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${diploma.institution_name}`} alt="University Logo" />
                        </div>

                        <h2 className="text-4xl font-serif font-bold mb-2 text-center">{diploma.institution_name || 'Université'}</h2>
                        <p className="text-xl font-serif italic mb-12">Le Recteur de l'Université</p>

                        <p className="text-lg mb-8 uppercase tracking-widest font-semibold">Certifie que</p>

                        <h3 className="text-5xl font-serif font-bold mb-8 text-center px-4">{diploma.student_name}</h3>

                        <div className="text-xl text-center leading-relaxed">
                            a obtenu le grade de <br />
                            <span className="text-3xl font-bold block mt-2">{diploma.degree_name}</span>
                            {diploma.specialization && <span className="text-lg block mt-1">Spécialité : {diploma.specialization}</span>}
                        </div>

                        <div className="mt-16 flex justify-between w-full px-12">
                            <div className="text-center">
                                <div className="w-32 h-1 bg-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-400">Le Secrétaire Général</p>
                            </div>
                            <div className="text-center">
                                <div className="w-32 h-1 bg-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-400">Le Recteur</p>
                            </div>
                        </div>

                        <div className="absolute bottom-12 left-12">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <QrCode className="w-16 h-16 text-slate-900" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Vérification Numérique</p>
                        </div>

                        <div className="absolute bottom-12 right-12 text-right">
                            <p className="text-xs text-slate-400">N° de série : {diploma.serial_number}</p>
                            <p className="text-xs text-slate-400">Délivré le : {new Date(diploma.graduation_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            Vérification d'Intégrité
                        </h4>
                        <p className="text-sm text-slate-400">Ce diplôme est certifié numériquement. Toute modification du document original invaliderait la signature.</p>

                        <div className="space-y-2 pt-2">
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Hachage du document</div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] break-all text-slate-400">
                                {diploma.signature_hash}
                            </div>
                        </div>

                        <div className={`text-xs font-bold uppercase p-2 rounded text-center ${diploma.is_signed ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {diploma.is_signed ? 'Signé et Validé' : 'En attente de signature'}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h4 className="text-lg font-bold text-white">Partager</h4>
                        <p className="text-sm text-slate-400">Partagez ce diplôme via un lien public de vérification.</p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Lien copié !");
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all font-medium"
                        >
                            <Share2 className="w-4 h-4" />
                            Copier le lien
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiplomaDetail;
