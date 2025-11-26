import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from './constants';
import { CourseData, Subtopic, ViewMode, getYouTubeId } from './types';
import AdminPanel from './components/AdminPanel';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [data, setData] = useState<CourseData>(INITIAL_DATA);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.STUDENT);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'content' | 'professor'>('home');
  const [activeSubtopic, setActiveSubtopic] = useState<Subtopic | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  // Restore state from local storage
  useEffect(() => {
    const saved = localStorage.getItem('kartesiaData');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load local data");
      }
    }
  }, []);

  const handleUpdateData = (newData: CourseData) => {
    setData(newData);
    localStorage.setItem('kartesiaData', JSON.stringify(newData));
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleAnswer = (exId: string) => {
    setShowAnswer(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  const handleNavigateToSubtopic = (sub: Subtopic) => {
    setActiveSubtopic(sub);
    setCurrentView('content');
  };

  const handleNavigateToHome = () => {
    setActiveSubtopic(null);
    setCurrentView('home');
  };

  const handleNavigateToProfessor = () => {
    setActiveSubtopic(null);
    setCurrentView('professor');
  };

  const handleModeSwitch = () => {
    if (viewMode === ViewMode.STUDENT) {
      const password = window.prompt("Digite a senha de administrador:");
      if (password === "OtigOc$947") {
        setViewMode(ViewMode.CREATOR);
      } else if (password !== null) {
        alert("Acesso negado: Senha incorreta.");
      }
    } else {
      setViewMode(ViewMode.STUDENT);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation - Dark Navy for Contrast */}
      <aside className="w-full md:w-80 bg-kartesia-900 text-white flex flex-col h-screen sticky top-0 overflow-hidden shadow-2xl z-10">
        <div className="p-6 border-b border-white/10 cursor-pointer" onClick={handleNavigateToHome}>
          <Logo variant="light" className="h-10" />
          <p className="text-xs text-slate-300 mt-3 uppercase tracking-[0.2em] font-medium pl-1 opacity-80">
            Mecânica & Razão
          </p>
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {/* Institutional Links */}
          <div className="mb-6 pb-6 border-b border-white/10">
             <button 
                onClick={handleNavigateToProfessor}
                className={`flex items-center w-full text-left px-3 py-3 rounded transition-colors group ${currentView === 'professor' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className="mr-3 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <span className={`font-semibold text-base tracking-wide ${currentView === 'professor' ? 'text-white' : 'text-slate-100'}`}>Sobre o Professor</span>
              </button>
          </div>

          <div className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Conteúdo
          </div>

          {data.topics.map(topic => (
            <div key={topic.id} className="mb-3">
              <button 
                onClick={() => toggleTopic(topic.id)}
                className="flex items-center w-full text-left px-3 py-3 hover:bg-white/10 rounded transition-colors group"
              >
                <span className={`mr-3 text-sm text-slate-300 transform transition-transform duration-200 ${expandedTopics.includes(topic.id) ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                <span className="font-semibold text-slate-100 group-hover:text-white text-base tracking-wide">{topic.title}</span>
              </button>
              
              {expandedTopics.includes(topic.id) && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-white/10 pl-3">
                  {topic.subtopics.length === 0 && <span className="text-xs text-slate-400 italic px-3 py-2 block">Sem subtópicos</span>}
                  {topic.subtopics.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleNavigateToSubtopic(sub)}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded transition-all duration-200 font-medium ${
                        activeSubtopic?.id === sub.id && currentView === 'content'
                          ? 'bg-white text-kartesia-900 font-bold shadow-sm translate-x-1' 
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-5 border-t border-white/10 bg-kartesia-950/30">
          <button 
            onClick={handleModeSwitch}
            className={`w-full text-xs font-bold uppercase tracking-widest py-4 border-2 rounded transition-all duration-300 ${
              viewMode === ViewMode.CREATOR 
                ? 'bg-white text-kartesia-900 border-white hover:bg-slate-100' 
                : 'border-slate-600 text-slate-300 hover:border-white hover:text-white hover:bg-white/5'
            }`}
          >
            Modo: {viewMode === ViewMode.STUDENT ? 'Estudante' : 'Criador'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[#f8fafc]">
        {viewMode === ViewMode.CREATOR ? (
           <div className="p-4 md:p-10">
             <AdminPanel data={data} onUpdate={handleUpdateData} />
           </div>
        ) : (
          <div className="max-w-5xl mx-auto p-4 md:p-10">
            
            {/* HOME VIEW */}
            {currentView === 'home' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <div className="opacity-10 mb-8 grayscale">
                  <Logo variant="dark" className="scale-150" />
                </div>
                <h2 className="text-3xl font-bold text-kartesia-900 mb-4 tracking-tight">Bem-vindo à Kartesia</h2>
                <div className="w-16 h-1 bg-kartesia-900 mb-6"></div>
                <p className="text-slate-700 max-w-lg mx-auto leading-relaxed text-lg font-medium">
                  Selecione um tópico no menu à esquerda para iniciar sua jornada lógica.
                  <br/>
                  <span className="text-sm text-slate-500 mt-2 block italic">"Cogito, ergo sum."</span>
                </p>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                  <div className="bg-white p-6 border-t-4 border-kartesia-900 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-kartesia-900 mb-2 uppercase tracking-wide text-sm">Teoria</h3>
                    <p className="text-slate-600 font-medium">Videoaulas fundamentadas na lógica e dedução.</p>
                  </div>
                  <div className="bg-white p-6 border-t-4 border-slate-400 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-kartesia-900 mb-2 uppercase tracking-wide text-sm">Prática</h3>
                    <p className="text-slate-600 font-medium">Banco de questões para exercitar o método.</p>
                  </div>
                   <div className="bg-white p-6 border-t-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-kartesia-900 mb-2 uppercase tracking-wide text-sm">Correção</h3>
                    <p className="text-slate-600 font-medium">Gabaritos detalhados e resoluções em vídeo.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PROFESSOR VIEW */}
            {currentView === 'professor' && data.professor && (
              <div className="animate-fade-in pb-20">
                 <header className="mb-10 pb-6 border-b border-slate-200">
                  <h2 className="text-4xl font-bold text-kartesia-900 tracking-tight">Sobre o Professor</h2>
                </header>
                
                <div className="bg-white border border-slate-200 shadow-sm p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
                   <div className="w-full md:w-1/3 flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-kartesia-900 transform translate-x-2 translate-y-2"></div>
                        <img 
                            src={data.professor.photoUrl} 
                            alt={data.professor.name} 
                            className="relative z-10 w-64 h-64 object-cover border-4 border-white shadow-lg grayscale hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      
                      <div className="mt-8 w-full space-y-3">
                         {data.professor.socials?.youtube && (
                             <a href={data.professor.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-sm uppercase tracking-wide transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                                YouTube
                             </a>
                         )}
                         {data.professor.socials?.instagram && (
                             <a href={data.professor.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-bold text-sm uppercase tracking-wide transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                Instagram
                             </a>
                         )}
                         {data.professor.socials?.linkedin && (
                             <a href={data.professor.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-sm uppercase tracking-wide transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                LinkedIn
                             </a>
                         )}
                      </div>
                   </div>

                   <div className="w-full md:w-2/3">
                      <h3 className="text-3xl font-bold text-kartesia-900 mb-2">{data.professor.name}</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-6 border-b border-slate-200 pb-4 inline-block">{data.professor.title}</p>
                      
                      <div className="prose prose-slate max-w-none text-slate-700">
                          {data.professor.bio.split('\n').map((paragraph, idx) => (
                              <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                          ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* CONTENT VIEW */}
            {currentView === 'content' && activeSubtopic && (
              <div className="animate-fade-in pb-20">
                <header className="mb-10 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <span className="bg-slate-200 px-2 py-1 rounded-sm">Módulo</span>
                    <span>/</span>
                    <span>{activeSubtopic.title}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-kartesia-900 tracking-tight">{activeSubtopic.title}</h2>
                </header>

                {/* Theory Section */}
                {activeSubtopic.theoryVideoUrl && (
                  <section className="mb-16">
                    <h3 className="text-lg font-bold text-kartesia-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 bg-kartesia-900 text-white flex items-center justify-center font-mono text-sm">01</span>
                      Fundamentação Teórica
                    </h3>
                    <div className="bg-black aspect-video w-full shadow-lg">
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeId(activeSubtopic.theoryVideoUrl)}`}
                        title="Videoaula"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </section>
                )}

                {/* Exercises Section */}
                <section>
                   <h3 className="text-lg font-bold text-kartesia-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 bg-slate-200 text-kartesia-900 flex items-center justify-center font-mono text-sm">02</span>
                      Exercícios de Fixação
                    </h3>
                    
                    <div className="space-y-8">
                      {activeSubtopic.exercises.map((exercise, idx) => (
                        <div key={exercise.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-bold bg-kartesia-900 text-white px-2 py-1">Q.{idx + 1}</span>
                              <span className="font-semibold text-slate-800">{exercise.title}</span>
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-8">
                            {/* Question Image */}
                            <div className="mb-8 border border-slate-100 bg-slate-50/50 p-4 flex justify-center">
                               <img 
                                src={exercise.imageUrl} 
                                alt={exercise.title}
                                className="max-w-full max-h-[600px] object-contain shadow-sm"
                              />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-6">
                              <button 
                                onClick={() => toggleAnswer(exercise.id)}
                                className={`px-6 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                  showAnswer[exercise.id] 
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'bg-kartesia-900 text-white hover:bg-kartesia-800 hover:shadow-lg'
                                }`}
                              >
                                {showAnswer[exercise.id] ? (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    Ocultar Gabarito
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    Ver Resolução
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Solution Area */}
                            {showAnswer[exercise.id] && (
                              <div className="mt-8 animate-fade-in">
                                <div className="bg-slate-50 border-l-4 border-kartesia-900 p-5 mb-6">
                                  <h4 className="font-bold text-kartesia-900 text-xs uppercase tracking-wider mb-2">Gabarito Comentado</h4>
                                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{exercise.answerKey}</p>
                                </div>
                                
                                {exercise.resolutionVideoUrl && (
                                  <div>
                                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Vídeo de Resolução</h4>
                                    <div className="aspect-video max-w-2xl bg-black shadow-md">
                                       <iframe 
                                          className="w-full h-full"
                                          src={`https://www.youtube.com/embed/${getYouTubeId(exercise.resolutionVideoUrl)}`}
                                          title="Resolução"
                                          allowFullScreen
                                        ></iframe>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {activeSubtopic.exercises.length === 0 && (
                        <div className="text-center py-16 border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                          <p className="font-medium">Nenhum exercício cadastrado neste tópico.</p>
                          <p className="text-sm mt-2">Acesse o modo criador para adicionar conteúdo.</p>
                        </div>
                      )}
                    </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;