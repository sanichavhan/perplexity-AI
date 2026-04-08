import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const authUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event?.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }

  const startNewChat = () => {
    // Assuming clearing currentChatId handles new chat in logic by passing null
    chat.handleOpenChat(null, chats)
  }

  // Determine active title based on current chat
  const activeTitle = chats[currentChatId]?.title || "New Thread"

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body text-on-surface">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1F1F1F] dark:bg-[#1F1F1F] hidden md:flex flex-col py-8 px-4 font-['Inter'] leading-relaxed tracking-tight text-sm z-50">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-bold tracking-tighter text-white uppercase">Neuro AI</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#00FFFF] mt-1"></p>
        </div>
        <button 
          onClick={startNewChat}
          className="mb-8 w-full flex items-center justify-center gap-3 bg-primary text-on-primary py-2.5 px-4 rounded-lg font-bold transition-transform hover:opacity-90 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>New Search</span>
        </button>
        <nav className="flex-1 space-y-1 custom-scrollbar overflow-y-auto pr-2">
          <a className="flex items-center gap-3 py-2 px-3 rounded text-[#00FFFF] font-bold border-r-2 border-[#00FFFF] bg-[#353535] transition-colors duration-200" href="#">
            <span className="material-symbols-outlined">search</span>
            <span>Research</span>
          </a>
          <a className="flex items-center gap-3 py-2 px-3 rounded text-[#E2E2E2] opacity-70 hover:opacity-100 hover:bg-[#353535] transition-colors duration-200" href="#">
            <span className="material-symbols-outlined">explore</span>
            <span>Discover</span>
          </a>
          
          <div className="pt-6 pb-2 px-3">
             <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Recent Threads</span>
          </div>
          {Object.values(chats).map((c, index) => (
             <button
                key={c.id || index}
                onClick={() => openChat(c.id)}
                className="w-full text-left flex items-center gap-3 py-2 px-3 rounded text-[#E2E2E2] opacity-70 hover:opacity-100 hover:bg-[#353535] transition-colors duration-200 truncate text-xs"
             >
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="truncate">{c.title || `Thread ${index + 1}`}</span>
             </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-outline-variant/20 pt-4 space-y-1">
          <div className="flex items-center gap-3 px-3 mt-6">
            <div className="w-8 h-8 rounded bg-surface-container-highest border border-outline-variant/30 overflow-hidden flex items-center justify-center text-xs font-bold text-outline uppercase">
               {authUser?.username?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
               <p className="text-xs font-bold truncate text-white">{authUser?.username || "Guest"}</p>
               <p className="text-[10px] text-outline truncate transition-colors duration-200 hover:text-white cursor-pointer">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 bg-background h-screen relative overflow-y-auto custom-scrollbar">
        {!currentChatId ? (
          // Home / Discovery View
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-20 pb-40">
             <div className="max-w-3xl w-full mb-12 text-center">
                 <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-tight mb-4">
                     Where knowledge begins.
                 </h1>
                 <p className="text-on-surface-variant text-lg font-light tracking-wide">
                     Search across specialized journals, technical archives, and the open web.
                 </p>
             </div>
             
             {/* Main Search Container */}
             <form onSubmit={handleSubmitMessage} className="max-w-3xl w-full relative group">
                 <div className="relative flex flex-col bg-surface-container-low rounded-xl border border-outline-variant/30 focus-within:border-primary-container transition-all duration-300 p-4 shadow-2xl">
                     <textarea 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                             e.preventDefault();
                             handleSubmitMessage(e);
                           }
                        }}
                        className="w-full bg-transparent border-none focus:ring-0 text-xl text-on-surface placeholder:text-outline/50 resize-none font-body font-light leading-relaxed outline-none" 
                        placeholder="Ask anything..." 
                        rows="3"
                     />
                     <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-2">
                             <button type="button" className="p-2 hover:bg-surface-container-highest rounded-lg text-outline transition-colors group-btn">
                                 <span className="material-symbols-outlined text-xl">attach_file</span>
                             </button>
                             <div className="h-4 w-[1px] bg-outline-variant/30 mx-1"></div>
                             <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-container-highest rounded-lg text-outline transition-colors text-xs font-medium uppercase tracking-wider">
                                 <span className="material-symbols-outlined text-sm">tune</span>
                                 Focus
                             </button>
                         </div>
                         <button 
                            type="submit" 
                            disabled={!chatInput.trim()}
                            className="bg-primary-container text-on-primary-container p-2.5 rounded-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
                         >
                             <span className="material-symbols-outlined font-bold">arrow_forward</span>
                         </button>
                     </div>
                 </div>
                 
                 {/* Suggested Filters / Modes */}
                 <div className="flex flex-wrap justify-center gap-3 mt-8">
                     <button type="button" className="px-5 py-2 rounded-full border border-outline-variant/20 bg-surface-container hover:border-primary-fixed/50 transition-all text-xs font-semibold tracking-widest uppercase flex items-center gap-2 text-on-surface cursor-pointer">
                         <span className="material-symbols-outlined text-[16px] text-primary-fixed">auto_awesome</span>
                         Pro Mode
                     </button>
                     <button type="button" className="px-5 py-2 rounded-full border border-outline-variant/20 bg-surface-container hover:border-primary-fixed/50 transition-all text-xs font-semibold tracking-widest uppercase flex items-center gap-2 text-on-surface cursor-pointer">
                         <span className="material-symbols-outlined text-[16px]">school</span>
                         Academic
                     </button>
                     <button type="button" className="px-5 py-2 rounded-full border border-outline-variant/20 bg-surface-container hover:border-primary-fixed/50 transition-all text-xs font-semibold tracking-widest uppercase flex items-center gap-2 text-on-surface cursor-pointer">
                         <span className="material-symbols-outlined text-[16px]">code</span>
                         Writing
                     </button>
                 </div>
             </form>
          </div>
        ) : (
          // Search Results View
          <div className="pt-24 pb-48 px-6 md:px-12 max-w-5xl mx-auto">
             {/* Header Query */}
             <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center h-16 px-8 border-b border-[#3A4A49]/20 hidden md:flex">
                 <div className="flex items-center gap-6 flex-1">
                     <div className="relative w-full max-w-xl">
                         <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline-variant text-lg">search</span>
                         <input 
                            className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-primary-container text-sm py-2 pl-8 font-medium outline-none text-white overflow-ellipsis" 
                            type="text" 
                            value={activeTitle} 
                            readOnly
                         />
                     </div>
                 </div>
             </header>

             <section className="mb-12 mt-4 md:mt-0">
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight break-words">
                     {activeTitle}
                 </h1>
             </section>

             {/* Dynamic Answer Section mapped from messages */}
             <section className="space-y-8 max-w-3xl">
                {chats[currentChatId]?.messages?.map((message) => (
                  <div key={message.id} className={`w-full ${message.role === 'user' ? 'opacity-70 mt-6' : 'mt-8'}`}>
                     <div className="flex items-center gap-2 mb-4">
                         {message.role === 'assistant' && (
                             <>
                               <span className="material-symbols-outlined text-[#00FFFF]">auto_awesome</span>
                               <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Archivist Synthesis</h2>
                             </>
                         )}
                         {message.role === 'user' && (
                             <>
                               <span className="material-symbols-outlined text-outline">account_circle</span>
                               <h2 className="text-xs font-bold uppercase tracking-widest text-outline">You</h2>
                             </>
                         )}
                     </div>
                     <div className={`text-lg font-light ${message.role === 'assistant' ? 'text-on-surface prose prose-invert overflow-hidden max-w-none' : 'text-on-surface-variant'}`}>
                         {message.role === 'user' ? (
                            <p>{message.content}</p>
                         ) : (
                            <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className='mb-6 leading-relaxed'>{children}</p>,
                                  ul: ({ children }) => <ul className='mb-6 list-none space-y-4 pl-4 border-l border-outline-variant/30'>{children}</ul>,
                                  ol: ({ children }) => <ol className='mb-6 list-decimal pl-5'>{children}</ol>,
                                  li: ({ children }) => <li className='relative before:content-[""] before:absolute before:-left-[21px] before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary-fixed before:shadow-[0_0_8px_rgba(0,255,255,0.4)]'>{children}</li>,
                                  code: ({ children }) => <code className='rounded bg-surface-container px-1.5 py-0.5 text-primary-fixed'>{children}</code>,
                                  pre: ({ children }) => <pre className='mb-6 overflow-x-auto rounded-xl bg-surface-container-low border border-outline-variant/20 p-4 font-mono text-sm shadow-xl'>{children}</pre>,
                                  h1: ({ children }) => <h1 className='text-3xl font-bold mb-4 mt-8 text-white'>{children}</h1>,
                                  h2: ({ children }) => <h2 className='text-2xl font-bold mb-3 mt-6 text-white'>{children}</h2>,
                                  h3: ({ children }) => <h3 className='text-xl font-bold mb-2 mt-4 text-white'>{children}</h3>,
                                  a: ({ children, href }) => <a href={href} className='text-primary-fixed border-b border-primary-fixed/30 hover:border-primary-fixed transition-colors'>{children}</a>,
                                }}
                                remarkPlugins={[remarkGfm]}
                            >
                                {message.content}
                            </ReactMarkdown>
                         )}
                     </div>
                  </div>
                ))}
             </section>

             {/* Floating Input Bar Section */}
             <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-16rem)] p-4 md:p-8 z-40 bg-gradient-to-t from-background via-background/95 to-transparent">
                 <div className="max-w-4xl mx-auto">
                     {/* Suggested Chips */}
                     <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar no-scrollbar py-2">
                         <button className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium whitespace-nowrap hover:bg-on-secondary-container hover:text-secondary-container transition-colors cursor-pointer">Methodology details</button>
                         <button className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium whitespace-nowrap hover:bg-on-secondary-container hover:text-secondary-container transition-colors cursor-pointer">Review peer comments</button>
                     </div>
                     {/* Main Input */}
                     <form onSubmit={handleSubmitMessage} className="relative flex items-center bg-surface-container-high rounded-xl border border-outline-variant/30 px-6 py-4 shadow-2xl">
                         <span className="material-symbols-outlined text-outline mr-4 hidden sm:block">subdirectory_arrow_right</span>
                         <input 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="flex-1 bg-transparent w-full border-none focus:ring-0 text-white placeholder-outline-variant text-base outline-none" 
                            placeholder="Ask a follow-up..." 
                            type="text"
                         />
                         <div className="flex items-center gap-3">
                             <button type="button" className="hidden sm:flex items-center justify-center w-8 h-8 rounded hover:bg-surface-variant transition-colors">
                                 <span className="material-symbols-outlined text-outline text-lg">attachment</span>
                             </button>
                             <button 
                                type="submit"
                                disabled={!chatInput.trim()}
                                className="bg-primary text-on-primary px-4 py-1.5 rounded font-bold text-xs uppercase tracking-widest transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                             >
                                 Ask
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard