import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Clock, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get('questions/');
                setQuestions(response.data);
            } catch (err) {
                setError("Impossible de charger les questions. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

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
                    <h1 className="text-3xl font-bold text-white mb-2">Toutes les Questions</h1>
                    <p className="text-slate-400">Explorez les questions techniques et aidez la communauté.</p>
                </div>
                <Link to="/ask" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-900/20 w-fit">
                    <PlusCircle className="w-5 h-5" />
                    Poser une question
                </Link>
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
                <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Populaires
                </button>
                <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Récents
                </button>
                <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Non résolues
                </button>
            </div>

            {error && (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
                    {error}
                </div>
            )}

            {!loading && questions.length === 0 && !error && (
                <div className="p-12 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aucune question n'a été posée pour le moment.</p>
                    <Link to="/ask" className="text-primary-500 hover:underline mt-2 inline-block">Soyez le premier à poser une question !</Link>
                </div>
            )}

            <div className="space-y-4">
                {questions.map((question) => (
                    <div key={question.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-primary-500/50 transition-all group">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex md:flex-col gap-4 text-center text-slate-400 min-w-[80px]">
                                <div>
                                    <div className="text-white font-bold">{question.votes}</div>
                                    <div className="text-xs">votes</div>
                                </div>
                                <div>
                                    <div className={`font-bold rounded px-1 ${question.answers_count > 0 ? 'text-primary-500 border border-primary-500/30' : 'text-slate-500 border border-slate-800'}`}>
                                        {question.answers_count}
                                    </div>
                                    <div className={`text-xs ${question.answers_count > 0 ? 'text-primary-500' : 'text-slate-500'}`}>réponses</div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <Link to={`/question/${question.id}`} className="text-xl font-bold text-slate-200 group-hover:text-primary-400 transition-colors mb-2 block">
                                    {question.title}
                                </Link>
                                <p className="text-slate-400 line-clamp-2 mb-4">
                                    {question.description}
                                </p>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex gap-2">
                                        {question.tags_detail?.map((tag) => (
                                            <span key={tag.id} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs hover:bg-slate-700 cursor-pointer transition-colors">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${question.author}`} className="w-6 h-6 rounded-full" alt="avatar" />
                                        <span className="text-slate-300 font-medium">{question.author_name}</span>
                                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
