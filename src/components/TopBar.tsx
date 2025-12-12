import { Menu, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import type { User as UserType, AIModel } from '../App';

interface TopBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: UserType;
  onOpenSettings: () => void;
  onOpenModelPanel: () => void;
  conversationTitle: string;
  currentModel: AIModel;
}

export function TopBar({
  isSidebarOpen,
  onToggleSidebar,
  user,
  onOpenSettings,
  onOpenModelPanel,
  conversationTitle,
  currentModel,
}: TopBarProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="h-16 border-b border-neutral-200/60 flex items-center justify-between px-6 flex-shrink-0 bg-white/80 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 transition-colors"
          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </motion.button>
        
        <motion.div
          key={conversationTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="text-[15px] text-neutral-900"
        >
          {conversationTitle || '新对话'}
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenModelPanel}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-neutral-100 hover:to-neutral-200 flex items-center gap-2.5 transition-all shadow-sm border border-neutral-200/60"
          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" strokeWidth={2} />
          </motion.div>
          <span className="text-[13px] text-neutral-700">{currentModel.name}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-300 hover:from-neutral-300 hover:to-neutral-400 flex items-center justify-center transition-colors shadow-sm"
          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        >
          <User className="w-4 h-4 text-neutral-700" strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}
