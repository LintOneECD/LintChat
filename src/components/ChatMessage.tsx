import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '../App';

interface ChatMessageProps {
  message: Message;
  index: number;
  modelName: string;
}

export function ChatMessage({ message, index, modelName }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const handleCopy = async () => {
    if (message.isThinking || !message.content) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 250,
        delay: index * 0.08,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.08 + 0.1,
              duration: 0.4,
            }}
            className="flex items-center gap-2.5"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                isUser 
                  ? 'bg-gradient-to-br from-neutral-700 to-neutral-900' 
                  : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
              }`}
            >
              <span className="text-white text-[12px]" style={{ fontWeight: 600 }}>
                {isUser ? '你' : 'AI'}
              </span>
            </motion.div>
            <span className="text-[14px] text-neutral-600">
              {isUser ? '你' : modelName}
            </span>
            {message.searchQuery && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.3 }}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg text-[12px] flex items-center gap-1.5 border border-blue-200"
              >
                <ExternalLink className="w-3 h-3" strokeWidth={2} />
                <span>搜索</span>
              </motion.div>
            )}
          </motion.div>

          <div className="flex items-center gap-1">
            {!isUser && message.thinking && !message.isThinking && (
              <AnimatePresence>
                {isHovered && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    whileHover={{ scale: 1.1, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowThinking(!showThinking)}
                    className="p-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    {showThinking ? (
                      <ChevronUp className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <ChevronDown className="w-4 h-4" strokeWidth={2} />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {!isUser && !message.isThinking && (
              <AnimatePresence>
                {isHovered && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    whileHover={{ scale: 1.1, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                        >
                          <Check className="w-4 h-4 text-green-600" strokeWidth={2} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                        >
                          <Copy className="w-4 h-4" strokeWidth={2} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Images */}
        {message.images && message.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 flex gap-2 flex-wrap"
          >
            {message.images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 20, stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-sm cursor-pointer"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Thinking Process */}
        <AnimatePresence>
          {showThinking && message.thinking && !message.isThinking && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-2xl px-4 py-3.5 border border-neutral-200 shadow-sm">
                <div className="text-[12px] text-neutral-500 mb-3 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                  />
                  思考过程
                </div>
                {message.thinking.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', damping: 20, stiffness: 300 }}
                    className="flex items-start gap-2.5 text-[13px] text-neutral-600 mb-2 last:mb-0"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.1, type: 'spring', damping: 15, stiffness: 300 }}
                      className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0"
                    />
                    <span className="leading-relaxed">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * 0.08 + 0.15,
            duration: 0.4,
          }}
          className="text-[15.5px] leading-[1.7] text-neutral-800"
        >
          {message.isThinking ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 py-2"
            >
              <motion.div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"
                  />
                ))}
              </motion.div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-neutral-500 text-[14px]"
              >
                {message.thinking?.[message.thinking.length - 1] || '正在思考'}
              </motion.span>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="whitespace-pre-wrap break-words"
              >
                {message.content.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.003,
                      duration: 0.08,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: 'spring', damping: 20, stiffness: 250 }}
                  className="mt-6 space-y-2"
                >
                  <div className="text-[13px] text-neutral-500 mb-3 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                    />
                    参考来源
                  </div>
                  {message.sources.map((source, i) => (
                    <motion.a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.7 + i * 0.1, 
                        type: 'spring', 
                        damping: 20, 
                        stiffness: 250 
                      }}
                      whileHover={{ 
                        y: -3,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-neutral-200 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4.5 h-4.5 text-neutral-600" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] text-neutral-800 truncate group-hover:text-neutral-900 transition-colors">{source.title}</div>
                        <div className="text-[12px] text-neutral-400 truncate mt-0.5">{source.url}</div>
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                      >
                        <ChevronUp className="w-4 h-4 text-neutral-400 rotate-90 flex-shrink-0" strokeWidth={2} />
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
