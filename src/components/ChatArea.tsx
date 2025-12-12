import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Globe, Link, Image as ImageIcon, Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from './ChatMessage';
import type { Conversation, AIModel, AppSettings } from '../App';
import logoIcon from 'figma:asset/711b07452f9ceeebad06c172d59a868f3a364fe8.png';

interface ChatAreaProps {
  conversation?: Conversation;
  onSendMessage: (content: string, options?: { searchWeb?: boolean; searchUrl?: string; images?: string[] }) => void;
  currentModel: AIModel;
  settings: AppSettings;
}

export function ChatArea({ conversation, onSendMessage, currentModel, settings }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchWeb, setSearchWeb] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [sendingText, setSendingText] = useState('');
  const [textStartPos, setTextStartPos] = useState({ x: 0, y: 0 });
  const [textEndPos, setTextEndPos] = useState({ x: 0, y: 0 });
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() && uploadedImages.length === 0) return;

    if (inputContainerRef.current && chatContainerRef.current) {
      const inputRect = inputContainerRef.current.getBoundingClientRect();
      const chatRect = chatContainerRef.current.getBoundingClientRect();
      
      setTextStartPos({ 
        x: inputRect.left + 60, 
        y: inputRect.top + 15 
      });
      
      setTextEndPos({ 
        x: chatRect.left + 100, 
        y: chatRect.bottom - 150 
      });
      
      setSendingText(input || '上传了图片');
    }

    const options: any = {};
    if (searchWeb) options.searchWeb = true;
    if (searchUrl.trim()) options.searchUrl = searchUrl.trim();
    if (uploadedImages.length > 0) options.images = uploadedImages;

    setTimeout(() => {
      onSendMessage(input || '请分析这张图片', options);
      setSendingText('');
    }, 600);

    setInput('');
    setSearchWeb(false);
    setSearchUrl('');
    setShowUrlInput(false);
    setUploadedImages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setSelectedSuggestion(index);
    setInput(suggestion);
    
    setTimeout(() => {
      setSelectedSuggestion(null);
      handleSend();
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const suggestions = [
    '什么是多模态语言模型',
    '如何利用 LintIntelligent 提高效率',
    '访问 X.com 调用今日热点',
  ];

  const isEmpty = !conversation?.messages || conversation.messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-white via-neutral-50/30 to-white relative">
      {/* 发送文本飞行动画 */}
      <AnimatePresence>
        {sendingText && (
          <motion.div
            initial={{ 
              x: textStartPos.x, 
              y: textStartPos.y,
              opacity: 1,
              scale: 1,
            }}
            animate={{ 
              x: textEndPos.x,
              y: textEndPos.y,
              opacity: 0,
              scale: 0.9,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200,
              opacity: { duration: 0.5, delay: 0.1 }
            }}
            className="fixed pointer-events-none z-50 bg-white rounded-2xl px-5 py-3 text-[15px] text-neutral-700 shadow-2xl border border-neutral-200"
            style={{ maxWidth: '400px' }}
          >
            {sendingText}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-center justify-center pt-32 pb-16"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: 'spring', damping: 10, stiffness: 300 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 200,
                    delay: 0.2,
                  }}
                  className="relative mb-8 cursor-pointer group"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -inset-8 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 blur-3xl"
                  />
                  <div className="relative w-28 h-28 rounded-[28px] overflow-hidden shadow-2xl">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                      src={logoIcon} 
                      alt="LintChat" 
                      className="w-full h-full"
                    />
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-neutral-900 text-[40px] tracking-tight mb-3"
                  style={{ fontWeight: 600 }}
                >
                  LintChat
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-neutral-500 text-[16px] mb-14"
                >
                  由 {currentModel.name} 提供支持
                </motion.p>
                
                <div className="grid gap-3 w-full max-w-xl">
                  {suggestions.map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ 
                        opacity: selectedSuggestion === i ? 0 : 1, 
                        y: 0, 
                        scale: selectedSuggestion === i ? 0.95 : 1,
                      }}
                      transition={{
                        delay: 0.5 + i * 0.1,
                        type: 'spring',
                        damping: 20,
                        stiffness: 250,
                      }}
                      whileHover={{
                        y: -6,
                        scale: 1.02,
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98, y: -2 }}
                      onClick={() => handleSuggestionClick(suggestion, i)}
                      className="px-6 py-4 bg-white rounded-2xl text-neutral-700 text-[15px] text-left border border-neutral-200 shadow-sm relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="relative">{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {conversation.messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    index={index}
                    modelName={currentModel.name}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 250 }}
        className="flex-shrink-0 border-t border-neutral-200/60 bg-white/80 backdrop-blur-xl"
      >
        <div className="max-w-3xl mx-auto px-8 py-5">
          {/* Uploaded Images */}
          <AnimatePresence>
            {uploadedImages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 flex-wrap">
                  {uploadedImages.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-neutral-200 shadow-sm group"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" strokeWidth={2} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Options */}
          <AnimatePresence>
            {(searchWeb || showUrlInput) && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2">
                  {showUrlInput && (
                    <motion.input
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      type="text"
                      value={searchUrl}
                      onChange={(e) => setSearchUrl(e.target.value)}
                      placeholder="输入网址，例如：wikipedia.org"
                      className="flex-1 px-4 py-2.5 text-[14px] bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  )}
                  {searchWeb && !showUrlInput && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, x: -10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.95, opacity: 0, x: -10 }}
                      className="px-4 py-2.5 text-[14px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl flex items-center gap-2 border border-blue-200"
                    >
                      <Globe className="w-4 h-4" strokeWidth={2} />
                      <span>将使用 Google 搜索</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={inputContainerRef}>
            <motion.div
              animate={{
                boxShadow: isFocused 
                  ? '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(99, 102, 241, 0.2)' 
                  : '0 2px 12px rgba(0, 0, 0, 0.06)',
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative rounded-2xl bg-white border border-neutral-200"
            >
              <div className="flex items-end gap-3 px-4 py-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex gap-2 pb-1">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-neutral-100 text-neutral-600 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-500 hover:text-white transition-all"
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <ImageIcon className="w-4 h-4" strokeWidth={2} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={() => {
                      setSearchWeb(!searchWeb);
                      setShowUrlInput(false);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                      searchWeb 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <Globe className="w-4 h-4" strokeWidth={2} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={() => {
                      setShowUrlInput(!showUrlInput);
                      setSearchWeb(false);
                    }}
                    className={`p-2 rounded-xl transition-all ${
                      showUrlInput 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <Link className="w-4 h-4" strokeWidth={2} />
                  </motion.button>

                  {settings.voiceInput && (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95, y: 0 }}
                      onClick={() => setIsVoiceRecording(!isVoiceRecording)}
                      className={`p-2 rounded-xl transition-all ${
                        isVoiceRecording 
                          ? 'bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-200' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                    >
                      <Mic className="w-4 h-4" strokeWidth={2} />
                    </motion.button>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="有什么可以帮你"
                  className="flex-1 px-2 py-2 bg-transparent resize-none focus:outline-none text-neutral-900 placeholder-neutral-400 text-[15px]"
                  rows={1}
                />
                
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSend}
                  disabled={!input.trim() && uploadedImages.length === 0}
                  animate={{
                    opacity: (input.trim() || uploadedImages.length > 0) ? 1 : 0.5,
                    y: (input.trim() || uploadedImages.length > 0) ? 0 : 2,
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                  className="w-9 h-9 mb-0.5 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-neutral-900 to-neutral-700 text-white shadow-lg disabled:from-neutral-300 disabled:to-neutral-200"
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
