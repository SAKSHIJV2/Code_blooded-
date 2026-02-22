import { useState, useEffect, useRef } from 'react';
import { X, Play, CheckCircle, TerminalSquare, RotateCcw, Clock, Target, Maximize2, Timer, ChevronDown, AlertCircle, Loader2, Send, ArrowLeft, Settings } from 'lucide-react';

export interface TestCase {
  input: string;
  expected: string;
  passed?: boolean;
}

export interface ChallengeData {
  id: number;
  level: number;
  type: string;
  title: string;
  description: string;
  starter_code: string;
  test_cases: TestCase[];
}

interface CodeEditorProps {
  challenge?: ChallengeData;
  onClose?: () => void;
}

export function CodeEditor({ challenge, onClose }: CodeEditorProps) {
  const [time, setTime] = useState(900); // 15 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (!isSubmitted && time > 0) {
      timer = setInterval(() => setTime(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, time]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic Data States
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileResult, setCompileResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<any>(null);
  const [explanation, setExplanation] = useState('');
  const [hintLoading, setHintLoading] = useState<string | null>(null);
  const [hints, setHints] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // --- NEW FILE EXPLORER STATES ---
  const [activeFile, setActiveFile] = useState('solution.py');
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [fileCache, setFileCache] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setFileCache(prev => ({ ...prev, [file.name]: evt.target?.result as string }));
          setUploadedFiles(prev => [...new Set([...prev, file.name])]);
        }
      };
      reader.readAsText(file);
    });
  };

  const isSimulatedFile = activeFile !== 'solution.py';
  const getEditorContent = () => {
    if (!isSimulatedFile) return code;
    return fileCache[activeFile] || '// Empty simulated file';
  };
  const setEditorContent = (val: string) => {
    if (!isSimulatedFile) setCode(val);
    else setFileCache(prev => ({ ...prev, [activeFile]: val }));
  };

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Load questions from our shiny new backend!
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const level = challenge?.level || 1;
        const res = await fetch(`http://localhost:3001/api/levels/${level}/questions`);
        const data = await res.json();
        if (data && data.questions && data.questions.length > 0) {
          // Generate Random Question for every try!
          const randomIndex = Math.floor(Math.random() * data.questions.length);
          const q = data.questions[randomIndex];
          setActiveQuestion(q);
          const pyStarter = `# ${q.title}\n# Write your solution here\n\nimport sys\ndef solve():\n    # read from sys.stdin.read() or standard input()\n    pass\n\nif __name__ == '__main__':\n    solve()`;
          setCode(challenge?.starter_code || pyStarter);
        }
      } catch (err) {
        console.error("Backend offline? Fallback to static text", err);
      }
    };
    fetchQuestions();
  }, [challenge]);

  const handleRun = async () => {
    setIsCompiling(true);
    setCompileResult(null);
    try {
      const res = await fetch('http://localhost:3001/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          questionId: activeQuestion?.id || 'L1_Q1'
        })
      });
      const data = await res.json();
      setCompileResult(data);
    } catch (e) {
      console.error("Compilation failed", e);
    }
    setIsCompiling(false);
  };

  const handleGetHint = async (role: string) => {
    setHintLoading(role);
    try {
      const res = await fetch('http://localhost:3001/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          questionId: activeQuestion?.id || 'L1_Q1',
          role: role
        })
      });
      const data = await res.json();
      setHints(prev => ({ ...prev, [role]: data.hint }));
    } catch (e) {
      console.error("Hint failed", e);
      setHints(prev => ({ ...prev, [role]: "I'm having trouble connecting right now." }));
    }
    setHintLoading(null);
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim() || !activeChat) return;

    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');
    setHintLoading(activeChat);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          questionId: activeQuestion?.id || 'L1_Q1',
          role: activeChat,
          message: chatMessage,
          history: chatHistory, // Send the previous context history
          apiKey: apiKey
        })
      });
      const data = await res.json();
      setChatHistory([...newHistory, { role: 'model', content: data.reply }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: 'model', content: "Network error occurred." }]);
    }
    setHintLoading(null);
  };

  const handleSubmit = async () => {
    if (!explanation.trim()) {
      alert("Please provide a Code Explanation before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionFeedback(null);
    try {
      const res = await fetch('http://localhost:3001/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          questionId: activeQuestion?.id || 'L1_Q1',
          level: challenge?.level || 1
        })
      });
      const data = await res.json();
      setSubmissionFeedback(data);
      setIsSubmitted(true);
    } catch (e) {
      console.error("Submission failed", e);
    }
    setIsSubmitting(false);
  };

  const title = activeQuestion?.title || challenge?.title || "1. Calculate Salary After Tax";
  const problemDescription = activeQuestion?.description || challenge?.description || "Loading problem...";
  const testCases = activeQuestion?.test_cases || [];
  const lines = getEditorContent().split('\n');

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-full bg-white overflow-hidden relative font-sans w-full">
        {/* Global Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 text-gray-700 border-b border-gray-200 shrink-0 h-12">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
            </div>
            <span className="ml-2 font-medium text-sm text-gray-800 hidden sm:block bg-gray-100 px-2 py-0.5 rounded">{title}</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-10 flex flex-col items-center justify-start bg-gray-50">
          <div className="text-center mb-8 lg:mb-12">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm ${submissionFeedback?.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {submissionFeedback?.success ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {submissionFeedback?.success ? "Submission Passed!" : "Submission Failed"}
            </h2>
            <p className="text-gray-500 text-lg">
              {submissionFeedback?.success ? "All test cases passed successfully. Great job!" : `Your solution ran into issues on our test cases.`}
            </p>
          </div>

          {!submissionFeedback?.success && submissionFeedback?.results && (
            <div className="w-full max-w-3xl">
              <div className="border border-red-200 rounded-2xl p-6 md:p-8 bg-red-50/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
                <div className="border-b border-red-200 pb-4 mb-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Errors Found</h3>
                  <p className="text-sm text-red-600 font-medium">Please review the failed test cases below</p>
                </div>

                <div className="space-y-4">
                  {submissionFeedback.results.filter((r: any) => !r.passed).map((res: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 lg:p-5 rounded-xl border border-red-100 shadow-sm">
                      <p className="font-bold text-gray-900 text-[15px] mb-3">Failed {res.type} Case</p>
                      <div className="flex flex-col bg-gray-50 p-4 rounded-lg border border-gray-200 gap-3 font-mono text-sm text-gray-700 w-full overflow-x-auto">
                        <div className="pb-2 border-b border-gray-200"><span className="text-gray-400 block text-xs uppercase mb-1">Input</span> {res.input}</div>
                        <div className="pb-2 border-b border-gray-200"><span className="text-gray-400 block text-xs uppercase mb-1">Expected Output</span> <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded inline-block mt-1">{res.expected}</span></div>
                        <div><span className="text-gray-400 block text-xs uppercase mb-1">Your Output / Error</span> <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded inline-block mt-1 whitespace-pre-wrap">{res.actual}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button onClick={() => setIsSubmitted(false)} className="text-gray-500 hover:text-gray-900 font-medium px-5 py-2 hover:bg-gray-200 rounded-lg transition-colors border border-transparent hover:border-gray-300">
              ← Back to Editor
            </button>
            {submissionFeedback?.success && onClose && (
              <button onClick={onClose} className="bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-colors">
                Continue Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative font-sans w-full">
      {/* Global Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-white text-gray-700 border-b border-gray-200 shrink-0 h-12">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
          </div>
          <span className="ml-2 font-medium text-sm text-gray-800 hidden sm:block bg-gray-100 px-2 py-0.5 rounded">{title}</span>
        </div>

        {/* Timer inside Global Header here */}
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-gray-700">
          <Timer className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-mono tracking-wider font-bold">{formatTime(time)}</span>
        </div>

        {onClose ? (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        ) : <div className="w-5 h-5"></div>}
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Panel: Problem Description and Testcases */}
        <div className="hidden lg:flex w-[30%] flex-col h-full border-r border-[#333]-200 bg-white">
          {/* Top Section: Description (White) */}
          <div className="flex-1 bg-white flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Easy</span>
              </div>
              <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 bg-gray-50 border border-gray-100 rounded-lg p-3 px-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Target className="w-4 h-4 text-blue-500" />
                  Attempts: 1
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Execution Time: 32ms
                </div>
              </div>

              {/* Problem Details */}
              <div className="text-[15px] leading-relaxed text-gray-700 space-y-4">
                <p>{problemDescription}</p>

                {/* Dynamic Problem Details */}
                <div className="mt-6 border-t border-gray-100 pt-6">
                  {activeQuestion && (
                    <div className="space-y-4 text-sm">
                      <div><span className="font-bold text-gray-800">Topic:</span> <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded ml-1">{activeQuestion.topic}</span></div>
                      <div><span className="font-bold text-gray-800">Difficulty:</span> <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded ml-1">{activeQuestion.difficulty}</span></div>
                      <div><span className="font-bold text-gray-800">Input Format:</span> <span className="text-gray-600 ml-1 font-mono text-xs">{activeQuestion.input_format}</span></div>
                      <div><span className="font-bold text-gray-800">Output Format:</span> <span className="text-gray-600 ml-1 font-mono text-xs">{activeQuestion.output_format}</span></div>
                      {activeQuestion.constraints && <div><span className="font-bold text-gray-800">Constraints:</span> <span className="text-gray-600 ml-1 font-mono text-xs">{activeQuestion.constraints}</span></div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Test Cases (Light) */}
          <div className="h-[45%] bg-white flex flex-col min-h-[250px] shrink-0 border-t border-gray-200">
            {/* Console Header Tabs */}
            <div className="flex items-center px-4 bg-gray-50 border-b border-gray-200 h-10 gap-6 shrink-0">
              <button className={`text-sm font-medium border-b-2 h-full flex items-center gap-2 ${!compileResult ? 'text-gray-900 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`} onClick={() => setCompileResult(null)}>
                <TerminalSquare className="w-4 h-4" />
                Testcase
              </button>
              <button className={`text-sm font-medium h-full flex items-center gap-2 transition-colors border-b-2 ${compileResult ? 'text-gray-900 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>
                <CheckCircle className={`w-4 h-4 ${compileResult?.success ? 'text-green-500' : (compileResult ? 'text-red-500' : 'text-gray-400')}`} />
                Test Result
              </button>
            </div>

            {/* Test Case Content */}
            <div className="flex-1 p-4 overflow-y-auto bg-white custom-scrollbar">
              {compileResult && compileResult.results ? (
                compileResult.results.map((res: any, index: number) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${res.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Output for Case {index + 1}</div>
                    </div>
                    <div className="bg-white rounded flex border border-gray-200 overflow-hidden mb-2">
                      <div className="w-20 shrink-0 bg-gray-50 p-2 text-xs text-gray-500 font-mono border-r border-gray-200 flex items-center">Input</div>
                      <div className="p-2 text-xs text-gray-700 font-mono flex-1 bg-white break-all whitespace-pre-wrap">{res.input}</div>
                    </div>
                    <div className="bg-white rounded flex border border-gray-200 overflow-hidden mb-2">
                      <div className="w-20 shrink-0 bg-gray-50 p-2 text-xs text-gray-500 font-mono border-r border-gray-200 flex items-center">Expected</div>
                      <div className="p-2 text-xs text-green-600 font-mono flex-1 bg-white break-all whitespace-pre-wrap">{res.expected}</div>
                    </div>
                    <div className="bg-white rounded flex border border-gray-200 overflow-hidden">
                      <div className="w-20 shrink-0 bg-gray-50 p-2 text-xs text-gray-500 font-mono border-r border-gray-200 flex items-center">Your Output</div>
                      <div className={`p-2 text-xs font-mono flex-1 bg-white break-all whitespace-pre-wrap ${res.passed ? 'text-green-600' : 'text-red-500'}`}>{res.actual || "Empty Output"}</div>
                    </div>
                  </div>
                ))
              ) : (
                testCases.map((test: any, index: number) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Case {index + 1}</div>
                    <div className="bg-white rounded flex border border-gray-200 overflow-hidden mb-2">
                      <div className="w-20 shrink-0 bg-gray-50 p-2 text-xs text-gray-500 font-mono border-r border-gray-200 flex items-center">Input</div>
                      <div className="p-2 text-xs text-green-600 font-mono flex-1 bg-white break-all whitespace-pre-wrap">{test.input}</div>
                    </div>
                    <div className="bg-white rounded flex border border-gray-200 overflow-hidden">
                      <div className="w-20 shrink-0 bg-gray-50 p-2 text-xs text-gray-500 font-mono border-r border-gray-200 flex items-center">Expected</div>
                      <div className="p-2 text-xs text-gray-700 font-mono flex-1 bg-white break-all whitespace-pre-wrap">{test.output || test.expected}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- VS CODE FILE EXPLORER SIDEBAR --- */}
        <div className="hidden lg:flex w-[260px] flex-col h-full bg-[#181818] border-r border-[#2d2d2d] overflow-y-auto select-none shrink-0 custom-scrollbar pb-6 relative">
          <div className="px-5 py-3 text-[11px] font-bold tracking-widest text-[#858585] uppercase flex justify-between items-center mb-1 sticky top-0 bg-[#181818]/90 z-10">
            <span>Explorer</span>
            <button onClick={() => fileUploadRef.current?.click()} className="text-[9px] bg-[#2A2D2E] hover:bg-[#37373D] text-[#CCCCCC] px-2 py-1 rounded transition-colors">+ Upload File</button>
            <input type="file" multiple ref={fileUploadRef} className="hidden" onChange={handleFileUpload} />
          </div>

          <div className="flex flex-col text-[13px] text-[#CCCCCC]">
            {uploadedFiles.length === 0 ? (
              <div className="px-6 py-4 text-xs text-[#858585] italic">
                Folder is empty.<br />Upload files to view them here.
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 px-3 py-1 pl-6 cursor-pointer hover:bg-[#2A2D2E]">
                  <ChevronDown className="w-4 h-4 text-[#CCCCCC]" />
                  <span>uploads</span>
                </div>
                {uploadedFiles.map((f: string) => (
                  <div
                    key={f}
                    className={`flex items-center gap-2 px-3 py-[3px] pl-11 cursor-pointer hover:bg-[#2A2D2E] transition-colors ${activeFile === f ? 'bg-[#37373D] text-white' : ''}`}
                    onClick={() => setActiveFile(f)}
                  >
                    <div className="w-3 h-3 shrink-0 flex items-center justify-center text-[7px] text-gray-400 border border-gray-500 rounded-sm">{f.split('.').pop()}</div>
                    <span className={`${activeFile === f ? 'text-white' : 'text-[#CCCCCC]'}`}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Current Active Solution */}
            <div className="mt-8 mb-2 border-t border-[#333333] pt-4">
              <div className="px-5 py-2 text-[11px] font-bold tracking-widest text-[#858585] uppercase">Active Challenge</div>
              <div
                className={`flex items-center gap-2 px-3 py-[5px] pl-6 cursor-pointer hover:bg-[#2A2D2E] transition-colors ${activeFile === 'solution.py' ? 'bg-[#37373D] text-white' : 'text-yellow-400'}`}
                onClick={() => setActiveFile('solution.py')}
              >
                <span className="font-mono text-[11px] bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-1 rounded-sm">py</span>
                <span className={`${activeFile === 'solution.py' ? 'text-white font-medium' : 'text-[#CCCCCC]'}`}>solution.py</span>
              </div>
            </div>

          </div>
        </div>


        {/* Center Panel: Code Editor Only (Dark Theme) */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E]">

          <div className="flex-1 flex flex-col">
            {/* Editor Tabs */}
            <div className="flex bg-[#252526] h-10 border-b border-[#1E1E1E] shrink-0">
              <div className="px-4 flex items-center gap-2 bg-[#1E1E1E] border-t-2 border-t-blue-500 text-gray-300 text-sm cursor-pointer min-w-[140px] border-r border-[#333]">
                <span className={activeFile.endsWith('.py') ? "text-yellow-400 font-mono" : (activeFile.endsWith('.js') || activeFile.endsWith('.cjs') ? "text-yellow-400 font-mono" : "text-blue-400 font-mono")}>
                  {activeFile.split('.').pop()}
                </span>
                {activeFile}
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-auto relative font-mono text-[14px]">
              <textarea
                value={getEditorContent()}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck={false}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent focus:text-transparent active:text-transparent caret-white resize-none outline-none z-10 pl-[3rem] pr-4 py-4 m-0 whitespace-pre overflow-hidden"
                style={{ lineHeight: '1.625' }}
              />
              <div className="pointer-events-none absolute inset-0 w-full py-4 text-left" style={{ lineHeight: '1.625' }}>
                {lines.map((line, index) => {
                  let color = '#D4D4D4'; // default VS code text

                  if (line.includes('#') || line.includes('"""')) {
                    color = '#6A9955'; // Commments
                  } else if (line.trim().startsWith('def ') || line.includes('return ') || line.trim().startsWith('print') || line.trim().startsWith('pass')) {
                    color = '#C586C0'; // Keywords
                  } else if (line.includes('calculate_salary') || line.includes('solve')) {
                    color = '#DCDCAA'; // Functions
                  } else if (line.match(/[0-9]+/)) {
                    color = '#B5CEA8'; // Numbers
                  }

                  // Handle keywords inside the line mapping manually for better fidelity if needed
                  const formattedLine = line
                    .replace('def ', '<span style="color:#569CD6">def </span>')
                    .replace('return ', '<span style="color:#C586C0">return </span>');

                  return (
                    <div key={index} className="flex min-h-[22.75px]">
                      <span className="inline-block w-12 text-right pr-4 text-[#858585] select-none text-[13px] shrink-0">
                        {index + 1}
                      </span>
                      <span
                        className="flex-1 whitespace-pre"
                        style={{ color: line.includes('#') || line.includes('"""') ? '#6A9955' : color }}
                        dangerouslySetInnerHTML={
                          !line.includes('#') && !line.includes('"""')
                            ? { __html: formattedLine || ' ' }
                            : { __html: line || ' ' }
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Working Terminal Below Code Snippet */}
          <div className="h-[200px] bg-[#181818] border-t border-[#333333] flex flex-col shrink-0 font-mono text-[13px]">
            <div className="flex items-center px-4 h-8 bg-[#252526] border-b border-[#333333] text-[#CCCCCC] text-[11px] uppercase tracking-wider gap-4">
              <span className="border-b-2 border-blue-500 h-full flex items-center text-white">Terminal</span>
              <span className="hover:text-white cursor-pointer transition-colors">Output</span>
              <span className="hover:text-white cursor-pointer transition-colors">Problems</span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-gray-300">
              <div className="text-gray-500 mb-2">PowerShell 7.3.4</div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="text-green-500">PS C:\\Users\\candidate\\gamified_project&gt;</span>
                  <span className={compileResult?.success ? 'text-green-400' : (compileResult ? 'text-red-400' : 'text-gray-300')}>
                    {compileResult ? (compileResult.success ? "python solution.py (All Tests Passed!)" : "python solution.py (Test Failures. Check Left Panel Output for details.)") : "Waiting for execution..."}
                  </span>
                </div>
                {compileResult?.message && (
                  <div className="flex gap-2 text-yellow-400 mt-2">
                    &gt; {compileResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel: AI Team & Explanation (Light Theme) */}
        <div className="w-[25%] bg-white flex flex-col h-full border-l border-gray-200 p-5 hidden xl:flex overflow-y-auto">

          <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
            {activeChat ? (
              <div className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900" onClick={() => setActiveChat(null)}>
                <ArrowLeft className="w-4 h-4" />
                <h3 className="text-[15px] font-bold text-gray-900">Chat with {activeChat.split(' ')[0]}</h3>
              </div>
            ) : (
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-2">AI Team <Settings className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-500" onClick={() => setShowSettings(!showSettings)} /></h3>
                <p className="text-xs text-gray-500">Get real-time expert help</p>
              </div>
            )}
          </div>

          {!activeChat && showSettings && (
            <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">Gemini API Key</p>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste AI Key here..." className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-blue-500" />
              <p className="text-[10px] text-gray-400 mt-1">Saved locally to your browser.</p>
            </div>
          )}

          {activeChat ? (
            <div className="flex-1 flex flex-col mb-4 overflow-hidden border border-gray-200 rounded-xl bg-gray-50/50">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatHistory.length === 0 && <div className="text-xs text-center text-gray-400 mt-4">Ask a question to start the code review!</div>}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-lg text-[13px] max-w-[90%] ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none whitespace-pre-wrap'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {hintLoading === activeChat && (
                  <div className="flex items-start">
                    <div className="px-3 py-2 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>
              <div className="p-2 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask about your code..."
                  className="flex-1 text-xs outline-none bg-gray-100 rounded px-3 py-2"
                />
                <button disabled={hintLoading === activeChat || !chatMessage.trim()} onClick={handleSendChat} className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mb-8 flex-1">
              <div onClick={() => { setActiveChat('Senior Developer'); setChatHistory([]); }} className="bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl p-3 flex flex-col cursor-pointer">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#2196F3] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      SC
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-sm">Sarah Chen</div>
                      <div className="text-gray-500 text-xs mt-0.5">Senior Developer</div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                </div>
              </div>

              <div onClick={() => { setActiveChat('QA Engineer'); setChatHistory([]); }} className="bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl p-3 flex flex-col cursor-pointer">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-[#9C27B0] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      MJ
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-sm">Mike Johnson</div>
                      <div className="text-gray-500 text-xs mt-0.5">QA Engineer</div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-5 mt-auto">
            <h3 className="text-[14px] font-bold text-gray-900 mb-2">Code Explanation</h3>
            <p className="text-xs text-gray-500 mb-3">Please explain why you used this code before submitting.</p>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full bg-white text-sm text-gray-800 border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-3 transition-all placeholder:text-gray-400 min-h-[120px] resize-none"
              placeholder="I used this algorithm because..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-white border-t border-gray-200 flex items-center justify-end px-6 py-3 shrink-0 gap-4">
        <div className="flex gap-3 shrink-0">
          <button onClick={handleRun} disabled={isCompiling || isSubmitting} className="bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 border border-gray-200 flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all">
            <Play className="w-4 h-4" />
            {isCompiling ? "Compiling..." : "Run"}
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting || isCompiling} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-2 px-8 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-green-900/30 transition-all">
            {isSubmitting ? "Running All Tests..." : "Submit"}
          </button>
        </div>
      </div>

    </div>
  );
}
