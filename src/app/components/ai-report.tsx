import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export function AiReport() {
    const [reportText, setReportText] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/generate-ai-report')
            .then(res => res.json())
            .then(data => {
                setReportText(data.report);
            })
            .catch(err => {
                console.error(err);
                setReportText("Failed to generate report due to backend error.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex justify-center items-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">AI Feedback Analyst</h2>
                    <p className="text-sm text-indigo-600 font-medium">Auto-Generated Performance Review</p>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-white/40 shadow-sm min-h-[140px] relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-3" />
                        <span className="text-sm font-medium animate-pulse">Running AI diagnostic models...</span>
                    </div>
                ) : (
                    <div className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                        {reportText}
                    </div>
                )}
            </div>
        </div>
    );
}
