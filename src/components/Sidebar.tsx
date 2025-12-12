import { PencilLine, MessageSquare, Trash2, AlertTriangle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { Conversation, User } from '../App';
import logoIcon from 'figma:asset/711b07452f9ceeebad06c172d59a868f3a364fe8.png';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onExportConversation: (id: string) => void;
  user: User;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearAll,
  onExportConversation,
  user,
}: SidebarProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [hoveredConvId, setHoveredConvId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) return '今天';
    if (diffInHours < 48) return '昨天';
    if (diffInHours < 168) return '最近七天';
    return '更早';
  };

  const groupedConversations = conversations.reduce((acc, conv) => {
    const group = formatDate(conv.lastUpdated);
    if (!acc[group]) acc[group] = [];
    acc[group].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const sortOrder = ['今天', '昨天', '最近七天', '更早'];

  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-gradient-to-b from-white via-neutral-50/50 to-white border-r border-neutral-200/80 flex flex-col shadow-sm"
    >
      {/* Logo & User */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05, type: 'spring', damping: 20, stiffness: 300 }}
        className="px-5 pt-5 pb-4 border-b border-neutral-200/60"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
              className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer shadow-md"
            >
              <img src={logoIcon} alt="LintChat" className="w-full h-full" />
            </motion.div>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-neutral-900 text-[18px] tracking-tight" style={{ fontWeight: 600 }}>LintChat</h1>
            </motion.div>
          </div>

          {conversations.length > 1 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          )}
        </div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100/50 border border-neutral-200/60"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px]" style={{ fontWeight: 600 }}>
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-neutral-900 truncate">{user.name}</div>
            <div className="text-[11px] text-neutral-500">{user.plan === 'pro' ? 'Pro 会员' : '免费版'}</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="px-5 pt-4 pb-4">
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }}
          whileTap={{ scale: 0.98, y: 0 }}
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white rounded-xl shadow-lg transition-shadow"
        >
          <PencilLine className="w-4 h-4" strokeWidth={2} />
          <span className="text-[15px]" style={{ fontWeight: 500 }}>新对话</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {sortOrder.map((group, groupIndex) => {
          const convs = groupedConversations[group];
          if (!convs || convs.length === 0) return null;
          
          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + groupIndex * 0.05, duration: 0.3 }}
              className="mb-5"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + groupIndex * 0.05 }}
                className="px-3 py-2 text-[11px] text-neutral-500 uppercase tracking-wider" style={{ fontWeight: 600 }}
              >
                {group}
              </motion.div>
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {convs.map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ 
                        opacity: 0, 
                        x: -20, 
                        height: 0,
                        transition: { duration: 0.2 }
                      }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                        delay: index * 0.02,
                      }}
                      layout
                      onHoverStart={() => setHoveredConvId(conv.id)}
                      onHoverEnd={() => setHoveredConvId(null)}
                      className="group relative overflow-hidden"
                    >
                      <motion.button
                        onClick={() => onSelectConversation(conv.id)}
                        whileHover={{ x: 3, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                          conv.id === currentConversationId
                            ? 'bg-gradient-to-r from-neutral-100 via-neutral-50 to-white text-neutral-900 shadow-sm border border-neutral-200/60'
                            : 'text-neutral-600 hover:bg-neutral-50/80'
                        }`}
                        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                      >
                        <motion.div 
                          animate={{
                            scale: conv.id === currentConversationId ? 1 : 0.8,
                          }}
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            conv.id === currentConversationId
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-sm'
                              : 'bg-neutral-300'
                          }`} 
                        />
                        <span className="flex-1 truncate text-[13.5px]">
                          {conv.title}
                        </span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {hoveredConvId === conv.id && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1"
                          >
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onExportConversation(conv.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-neutral-400 hover:text-blue-600 transition-colors"
                              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                            >
                              <Download className="w-3.5 h-3.5" strokeWidth={2} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Clear All Confirmation */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center mx-auto mb-5"
              >
                <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={2} />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-neutral-900 text-[18px] text-center mb-2" style={{ fontWeight: 600 }}
              >
                清空所有对话？
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-neutral-500 text-[14px] text-center mb-6 leading-relaxed"
              >
                此操作无法撤销，所有对话记录将被永久删除
              </motion.p>

              <div className="flex gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-[15px] hover:bg-neutral-200 transition-colors"
                >
                  取消
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-[15px] shadow-lg hover:shadow-xl transition-shadow"
                >
                  清空
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
