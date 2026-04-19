import React, { useEffect, useState, useRef } from 'react'
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
  const messagesEndRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const currentMessages = chats[currentChatId]?.messages || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, currentChatId])

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
    chat.handleOpenChat(null, chats)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage(e);
    }
  }

  const activeTitle = chats[currentChatId]?.title

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121] text-gray-100 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-[260px] bg-[#171717] hidden md:flex flex-col h-screen shrink-0 leading-relaxed font-sans z-50">
        <div className="p-3">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-[#202123] transition-colors group cursor-pointer text-sm font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="material-symbols-outlined text-black text-[18px]">add</span>
            </div>
            <span className="text-gray-200 group-hover:text-white">New chat</span>
            <span className="material-symbols-outlined text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">edit_square</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
          {Object.keys(chats).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 px-2 pb-2 mb-1">Recent</h3>
              <div className="space-y-0.5">
                {Object.values(chats).map((c, index) => (
                  <button
                    key={c.id || index}
                    onClick={() => openChat(c.id)}
                    className={`w-full text-left flex items-center gap-3 py-2 px-2.5 rounded-lg transition-colors text-sm truncate ${
                      currentChatId === c.id ? 'bg-[#343541] text-white' : 'text-gray-300 hover:bg-[#2A2B32]'
                    }`}
                  >
                    <span className="truncate flex-1">{c.title || `Chat ${index + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Area */}
        <div className="p-3 border-t border-white/10">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#2A2B32] transition-colors cursor-pointer text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold uppercase shrink-0">
               {authUser?.username?.charAt(0) || "U"}
            </div>
            <span className="truncate text-gray-200">{authUser?.username || "Upgrade Plan"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Mobile Header / Model Select Desktop Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#212121]">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#2F2F2F] cursor-pointer transition-colors text-lg font-semibold text-gray-200">
                 <span>NovaAI</span>
                 <span className="material-symbols-outlined text-gray-400 mt-0.5 text-xl">expand_more</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold uppercase shrink-0 md:hidden">
               {authUser?.username?.charAt(0) || "U"}
             </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 w-full">
          {!currentChatId || currentMessages.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto px-6">
                <div className="">
                   {/* <svg width="40" height="40" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M37.595 19.5524C37.595 19.5524 37.6087 19.3496 37.6087 19.1417C37.6087 14.5323 33.8741 10.7977 29.2647 10.7977C27.5029 10.7977 25.8698 11.3402 24.5021 12.2472C23.0185 8.761 19.6455 6.27966 15.6833 6.27966C10.7303 6.27966 6.70588 10.3041 6.70588 15.257C6.70588 15.6599 6.73357 16.0592 6.78652 16.4526C3.09062 17.5144 0.392578 20.9324 0.392578 25.0441C0.392578 29.6534 4.12716 33.388 8.73656 33.388C10.3708 33.388 11.8906 32.9099 13.1873 32.1009C14.6738 35.4093 17.9254 37.7667 21.7588 37.7667C26.7118 37.7667 30.7362 33.7423 30.7362 28.7893C30.7362 28.4354 30.7101 28.0838 30.665 27.7361C34.5085 26.7314 37.3361 23.238 37.595 19.5524ZM29.2647 12.6394C32.8532 12.6394 35.767 15.5532 35.767 19.1417C35.767 19.349 35.7533 19.5518 35.7268 19.7497L25.9644 14.1136C26.0463 13.91 26.0886 13.6934 26.0886 13.4735V2.13328C27.0855 2.13328 28.0561 2.30232 28.9715 2.62888C31.5436 3.5414 33.642 5.37894 34.8217 7.74937C32.893 9.49755 31.0664 11.2458 29.2647 12.6394ZM15.6833 8.1214C18.6659 8.1214 21.238 9.94511 22.3838 12.6074H15.0063C14.1593 12.6074 13.3421 12.9439 12.7428 13.5431L6.15582 20.1301C5.45781 18.6687 5.09312 17.0097 5.09312 15.257C5.09312 11.3236 8.32982 8.1214 12.3333 8.1214H15.6833ZM6.70588 28.7893C6.70588 28.7893 5.48514 27.5686 4.38289 25.5901C4.38289 25.5901 3.53589 25.5901 2.68888 25.5901C1.65089 24.5521 1.04278 23.0907 1.04278 21.4577C1.04278 20.3554 1.34688 19.3308 1.86016 18.4419L11.6226 24.078C11.5407 24.2816 11.4984 24.4982 11.4984 24.7181V36.0583C10.5015 36.0583 9.5309 35.8893 8.61546 35.5627C6.04337 34.6502 3.94501 32.8127 2.76527 30.4422C4.69395 28.6941 6.5206 26.9458 8.32228 25.5523C6.70588 28.7893 6.70588 28.7893 6.70588 28.7893ZM21.7588 35.925C18.7762 35.925 16.2041 34.1012 15.0583 31.439H22.4357C23.2828 31.439 24.1 31.1024 24.6993 30.5032L31.2863 23.9162C31.9843 25.3776 32.3489 27.0366 32.3489 28.7893C32.3489 32.7228 29.1122 35.925 25.1088 35.925H21.7588ZM30.7362 13.4735V24.7181C30.7362 25.7656 30.3429 26.7725 29.626 27.4894L23.0391 34.0764C24.1678 35.1009 25.5925 35.808 27.1852 36.1423C27.1852 36.1423 28.4059 34.9216 29.5082 32.943C29.5082 32.943 30.3552 32.943 31.2022 32.943C32.2402 33.981 32.8483 35.4424 32.8483 37.0754C32.8483 38.1777 32.5442 39.2023 32.0309 40.0912L22.2685 34.4551C22.3504 34.2515 22.3927 34.0349 22.3927 33.815V22.4748C23.3896 22.4748 24.3602 22.6438 25.2756 22.9704C27.8477 23.8829 29.9461 25.7204 31.1258 28.0908C29.1971 29.839 27.3705 31.5873 25.5688 32.9808C27.1852 36.1423 30.7362 13.4735 30.7362 13.4735Z" fill="black"/>
                   </svg> */}
                </div>
                <h1 className="text-2xl font-semibold mb-8">How can I help you today?</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                   <button className="flex flex-col text-left py-3 px-4 border border-white/10 rounded-xl hover:bg-[#2F2F2F] text-sm text-gray-300">
                      <span className="font-semibold text-gray-200">Explain quantum computing</span>
                      <span className="text-gray-400 opacity-80">to a high school student</span>
                   </button>
                   <button className="flex flex-col text-left py-3 px-4 border border-white/10 rounded-xl hover:bg-[#2F2F2F] text-sm text-gray-300">
                      <span className="font-semibold text-gray-200">Write a clean React component</span>
                      <span className="text-gray-400 opacity-80">using standard Tailwind CSS</span>
                   </button>
                   <button className="hidden md:flex flex-col text-left py-3 px-4 border border-white/10 rounded-xl hover:bg-[#2F2F2F] text-sm text-gray-300">
                      <span className="font-semibold text-gray-200">Brainstorm project ideas</span>
                      <span className="text-gray-400 opacity-80">for an AI startup</span>
                   </button>
                   <button className="hidden md:flex flex-col text-left py-3 px-4 border border-white/10 rounded-xl hover:bg-[#2F2F2F] text-sm text-gray-300">
                      <span className="font-semibold text-gray-200">Draft an impressive email</span>
                      <span className="text-gray-400 opacity-80">inviting a speaker to a tech event</span>
                   </button>
                </div>
            </div>
          ) : (
            // Chat History View
            <div className="max-w-3xl mx-auto pt-6 pb-36 px-4">
              {currentMessages.map((msg, index) => (
                <div key={index} className={`flex w-full mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-[#2F2F2F] text-gray-100 rounded-3xl py-2.5 px-5 max-w-[85%] md:max-w-[70%] break-words shadow-sm font-medium">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="flex w-full gap-4 max-w-[100%] md:max-w-[85%]">
                      <div className="">
                        {/* <svg width="20" height="20" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M37.595 19.5524C37.595 19.5524 37.6087 19.3496 37.6087 19.1417C37.6087 14.5323 33.8741 10.7977 29.2647 10.7977C27.5029 10.7977 25.8698 11.3402 24.5021 12.2472C23.0185 8.761 19.6455 6.27966 15.6833 6.27966C10.7303 6.27966 6.70588 10.3041 6.70588 15.257C6.70588 15.6599 6.73357 16.0592 6.78652 16.4526C3.09062 17.5144 0.392578 20.9324 0.392578 25.0441C0.392578 29.6534 4.12716 33.388 8.73656 33.388C10.3708 33.388 11.8906 32.9099 13.1873 32.1009C14.6738 35.4093 17.9254 37.7667 21.7588 37.7667C26.7118 37.7667 30.7362 33.7423 30.7362 28.7893C30.7362 28.4354 30.7101 28.0838 30.665 27.7361C34.5085 26.7314 37.3361 23.238 37.595 19.5524ZM29.2647 12.6394C32.8532 12.6394 35.767 15.5532 35.767 19.1417C35.767 19.349 35.7533 19.5518 35.7268 19.7497L25.9644 14.1136C26.0463 13.91 26.0886 13.6934 26.0886 13.4735V2.13328C27.0855 2.13328 28.0561 2.30232 28.9715 2.62888C31.5436 3.5414 33.642 5.37894 34.8217 7.74937C32.893 9.49755 31.0664 11.2458 29.2647 12.6394ZM15.6833 8.1214C18.6659 8.1214 21.238 9.94511 22.3838 12.6074H15.0063C14.1593 12.6074 13.3421 12.9439 12.7428 13.5431L6.15582 20.1301C5.45781 18.6687 5.09312 17.0097 5.09312 15.257C5.09312 11.3236 8.32982 8.1214 12.3333 8.1214H15.6833ZM6.70588 28.7893C6.70588 28.7893 5.48514 27.5686 4.38289 25.5901C4.38289 25.5901 3.53589 25.5901 2.68888 25.5901C1.65089 24.5521 1.04278 23.0907 1.04278 21.4577C1.04278 20.3554 1.34688 19.3308 1.86016 18.4419L11.6226 24.078C11.5407 24.2816 11.4984 24.4982 11.4984 24.7181V36.0583C10.5015 36.0583 9.5309 35.8893 8.61546 35.5627C6.04337 34.6502 3.94501 32.8127 2.76527 30.4422C4.69395 28.6941 6.5206 26.9458 8.32228 25.5523C6.70588 28.7893 6.70588 28.7893 6.70588 28.7893ZM21.7588 35.925C18.7762 35.925 16.2041 34.1012 15.0583 31.439H22.4357C23.2828 31.439 24.1 31.1024 24.6993 30.5032L31.2863 23.9162C31.9843 25.3776 32.3489 27.0366 32.3489 28.7893C32.3489 32.7228 29.1122 35.925 25.1088 35.925H21.7588ZM30.7362 13.4735V24.7181C30.7362 25.7656 30.3429 26.7725 29.626 27.4894L23.0391 34.0764C24.1678 35.1009 25.5925 35.808 27.1852 36.1423C27.1852 36.1423 28.4059 34.9216 29.5082 32.943C29.5082 32.943 30.3552 32.943 31.2022 32.943C32.2402 33.981 32.8483 35.4424 32.8483 37.0754C32.8483 38.1777 32.5442 39.2023 32.0309 40.0912L22.2685 34.4551C22.3504 34.2515 22.3927 34.0349 22.3927 33.815V22.4748C23.3896 22.4748 24.3602 22.6438 25.2756 22.9704C27.8477 23.8829 29.9461 25.7204 31.1258 28.0908C29.1971 29.839 27.3705 31.5873 25.5688 32.9808C27.1852 36.1423 30.7362 13.4735 30.7362 13.4735Z" fill="black"/>
                        </svg> */}
                      </div>
                      <div className="flex-1 text-[15px] leading-relaxed text-gray-200 mt-0.5 space-y-4">
                        {msg.content === "" ? (
                           <div className="w-3 h-4 bg-red-500/50 animate-pulse rounded-sm mt-1" title="NovaAI is taking longer than usual..."></div>
                        ) : (
                          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-xl prose-pre:my-4 prose-code:text-gray-200 max-w-none">
                            <ReactMarkdown
                              components={{
                                pre: ({ children }) => <pre className='overflow-x-auto rounded-lg bg-[#0D0D0D] p-4 text-sm font-mono mt-2 mb-4'>{children}</pre>,
                                code: ({ inline, children }) => inline ? <code className='bg-gray-800 rounded px-1.5 py-0.5 text-sm'>{children}</code> : <code>{children}</code>,
                                p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
                                ul: ({ children }) => <ul className='list-disc pl-5 mb-4 space-y-1'>{children}</ul>,
                                ol: ({ children }) => <ol className='list-decimal pl-5 mb-4 space-y-1'>{children}</ol>,
                                h1: ({ children }) => <h1 className='text-2xl font-bold mb-4 mt-6'>{children}</h1>,
                                h2: ({ children }) => <h2 className='text-xl font-bold mb-3 mt-5'>{children}</h2>,
                                h3: ({ children }) => <h3 className='text-lg font-bold mb-2 mt-4'>{children}</h3>,
                              }}
                              remarkPlugins={[remarkGfm]}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="absolute bottom-0 left-0 right-0 pt-6 pb-4 px-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pointer-events-none">
           <div className="max-w-3xl mx-auto pointer-events-auto">
              <form onSubmit={handleSubmitMessage} className="relative flex items-end w-full rounded-2xl bg-[#2F2F2F] p-2 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                 <button type="button" className="p-2 mb-1 text-gray-400 hover:text-white rounded-full transition-colors flex shrink-0 items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined font-light text-xl">add</span>
                 </button>
                 
                 <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message NovaAI..."
                    rows={1}
                    className="flex-1 max-h-[200px] bg-transparent border-0 text-white placeholder-gray-400 resize-none outline-none py-3 px-2 text-[15px] m-0 custom-scrollbar leading-relaxed"
                 />
                 
                 <div className="flex items-center self-end mb-1 ml-1">
                    <button 
                       type="submit"
                       disabled={!chatInput.trim()}
                       className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                         chatInput.trim() ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#404040] text-gray-600 cursor-not-allowed'
                       }`}
                    >
                       <span className="material-symbols-outlined text-lg">arrow_upward</span>
                    </button>
                 </div>
              </form>
              <div className="flex justify-center mt-2">
                 <p className="text-[11px] text-gray-400 font-sans tracking-wide">
                    NovaAI can make mistakes. Consider verifying important information.
                 </p>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard