import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Tag as TagIcon, Loader2 } from 'lucide-react';
import api from '../api';

const AskQuestion = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags_raw: ''
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
            // Processing tags: split by space/comma and filter empty
            const tagNames = formData.tags_raw.split(/[\s,]+/).filter(tag => tag.trim() !== '');

            // For now, we'll assume the backend might need pre-existing tag IDs
            // or we'll need to modify the backend to handle tag creation.
            // Let's send the data and handle error if tags fail.
            // Ideally, we'd have a tag creation endpoint or the serializer handles it.

            const response = await api.post('questions/', {
                title: formData.title,
                description: formData.description,
                tags: [] // We'll handle tags separately or improve the backend
            });

            navigate(`/question/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.detail || "Une erreur est survenue lors de la publication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Poser une question publique</h1>
                <div className="bg-primary-600/10 border border-primary-500/20 p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold text-primary-400 flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        Rédaction d'une bonne question
                    </h2>
                    <div className="text-slate-400 text-sm leading-relaxed">
                        Vous êtes sur le point de poser une question. Pour obtenir de meilleures réponses, assurez-vous de :
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Résumer votre problème en un titre concis</li>
                            <li>Décrire ce que vous avez essayé</li>
                            <li>Ajouter des extraits de code si nécessaire</li>
                        </ul>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <div className="space-y-2">
                        <label className="text-lg font-semibold text-white">Titre</label>
                        <p className="text-slate-500 text-xs">Soyez spécifique et imaginez que vous posez une question à une autre personne.</p>
                        <input
                            type="text"
                            name="title"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                            placeholder="ex: Comment utiliser useEffect pour récupérer des données ?"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-semibold text-white">Description</label>
                        <p className="text-slate-500 text-xs">Introduisez votre problème et développez ce que vous avez mis dans le titre.</p>
                        <textarea
                            name="description"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all min-h-[300px] font-mono text-sm"
                            placeholder="Entrez les détails de votre problème (Markdown supporté)..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-semibold text-white">Tags</label>
                        <p className="text-slate-500 text-xs">Ajoutez jusqu'à 5 tags pour décrire le sujet de votre question.</p>
                        <div className="relative">
                            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                name="tags_raw"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-all"
                                placeholder="ex: reactjs javascript frontend"
                                value={formData.tags_raw}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Publication...' : 'Publier la question'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-slate-400 hover:text-white px-6 py-3 transition-colors font-medium"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AskQuestion;
