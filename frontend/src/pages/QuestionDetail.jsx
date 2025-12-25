import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(`questions/${id}/`);
                setQuestion(response.data);
            } catch (err) {
                setError("Question non trouvée ou erreur serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleVote = async (value) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await api.post(`questions/${id}/vote/`, { value });
            setQuestion({ ...question, votes: response.data.votes });
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                alert("Erreur lors du vote. Veuillez réessayer.");
            }
        }
    };

    const handlePostAnswer = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!newAnswer.trim()) return;
        setSubmitting(true);
        try {
            const response = await api.post('answers/', {
                question: id,
                content: newAnswer
            });
            // Refresh question to show new answer
            const refreshed = await api.get(`questions/${id}/`);
            setQuestion(refreshed.data);
            setNewAnswer('');
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                alert("Erreur lors de la publication de la réponse.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400">
                {error || "Une erreur est survenue."}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white mb-4">{question.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>Posée le {new Date(question.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                        {question.tags_detail?.map(tag => (
                            <span key={tag.id} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex flex-col items-center gap-4 pt-2">
                    <button
                        onClick={() => handleVote(1)}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:border-primary-500 transition-all"
                    >
                        <ThumbsUp className="w-5 h-5 text-slate-400 hover:text-primary-500" />
                    </button>
                    <span className="text-xl font-bold text-slate-200">{question.votes}</span>
                    <button
                        onClick={() => handleVote(-1)}
                        className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:border-primary-500 transition-all"
                    >
                        <ThumbsDown className="w-5 h-5 text-slate-400 hover:text-red-500" />
                    </button>
                </div>

                <div className="flex-1 text-slate-300 prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {question.description}
                    </ReactMarkdown>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6">{question.answers?.length || 0} Réponses</h2>
                {question.answers?.map((answer) => (
                    <div key={answer.id} className="flex gap-6 pb-8 border-b border-slate-900 last:border-0 pt-4">
                        <div className="flex flex-col items-center gap-4">
                            {answer.is_best_answer && <CheckCircle className="w-6 h-6 text-green-500" />}
                            <div className="p-2 bg-slate-900 border border-slate-800 rounded-full">
                                <span className="font-bold text-slate-200">{answer.votes}</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-slate-300 mb-6 prose prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {answer.content}
                                </ReactMarkdown>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-sm">
                                    <div className="text-slate-500 mb-1">répondu par</div>
                                    <div className="flex items-center gap-2">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.author}`} className="w-6 h-6 rounded-full" alt="avatar" />
                                        <span className="text-primary-400 font-medium">{answer.author_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8">
                <h3 className="text-xl font-bold text-white mb-4">Votre réponse</h3>
                <textarea
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:border-primary-500 min-h-[200px]"
                    placeholder="Rédigez votre réponse ici (Markdown supporté)..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                />
                <button
                    onClick={handlePostAnswer}
                    disabled={submitting || !newAnswer.trim()}
                    className="mt-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {submitting ? 'Publication...' : 'Publier ma réponse'}
                </button>
            </div>
        </div>
    );
};

export default QuestionDetail;
