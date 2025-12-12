import { X, Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { AIModel } from '../App';

interface ModelPanelProps {
  models: AIModel[];
  currentModelId: string;
  onClose: () => void;
  onCreateModel: (model: Omit<AIModel, 'id'>) => void;
  onDeleteModel: (id: string) => void;
  onSelectModel: (id: string) => void;
}

export function ModelPanel({
  models,
  currentModelId,
  onClose,
  onCreateModel,
  onDeleteModel,
  onSelectModel,
}: ModelPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelPrompt, setNewModelPrompt] = useState('');
  const [newModelDescription, setNewModelDescription] = useState('');

  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  const handleCreate = () => {
    if (!newModelName.trim() || !newModelPrompt.trim()) return;

    onCreateModel({
      name: newModelName,
      systemPrompt: newModelPrompt,
      description: newModelDescription || '自定义模型',
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    setNewModelName('');
    setNewModelPrompt('');
    setNewModelDescription('');
    setIsCreating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between flex-shrink-0"
        >
          <h2 className="text-neutral-900 text-[17px]">AI 模型</h2>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgb(239 246 255)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(!isCreating)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[13px] flex items-center gap-1.5 transition-colors"
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
            >
              <motion.div
                animate={{ rotate: isCreating ? 45 : 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
              </motion.div>
              <span>新建模型</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgb(245 245 245)' }}
              whileTap={{ scale: 0.9, rotate: 90 }}
              onClick={onClose}
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isCreating && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="border-b border-neutral-200 overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-[13px] text-neutral-600 mb-2">模型名称</label>
                    <input
                      type="text"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="例如：创意写作助手"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-shadow"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-[13px] text-neutral-600 mb-2">描述（可选）</label>
                    <input
                      type="text"
                      value={newModelDescription}
                      onChange={(e) => setNewModelDescription(e.target.value)}
                      placeholder="简短描述这个模型的特点"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-[15px] focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-shadow"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-[13px] text-neutral-600 mb-2">系统提示词</label>
                    <textarea
                      value={newModelPrompt}
                      onChange={(e) => setNewModelPrompt(e.target.value)}
                      placeholder="定义 AI 的人设和行为方式，例如：你是一个专业的创意写作导师，擅长激发灵感���提供建设性反馈..."
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-[15px] resize-none focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-shadow"
                      rows={4}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex gap-2 pt-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreate}
                      disabled={!newModelName.trim() || !newModelPrompt.trim()}
                      className="flex-1 py-2 bg-neutral-900 text-white rounded-lg text-[15px] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                      创建
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsCreating(false);
                        setNewModelName('');
                        setNewModelPrompt('');
                        setNewModelDescription('');
                      }}
                      className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg text-[15px] hover:bg-neutral-200 transition-colors"
                    >
                      取消
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Models List */}
          <div className="p-4 space-y-2">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                }}
                whileHover={{ x: 4, scale: 1.01 }}
                className="group relative"
              >
                <button
                  onClick={() => {
                    onSelectModel(model.id);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    model.id === currentModelId
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 400 }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: model.color + '20' }}
                    >
                      <div
                        className="w-5 h-5 rounded-md"
                        style={{ backgroundColor: model.color }}
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-neutral-900 text-[15px]">{model.name}</div>
                        {model.id === currentModelId && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 400 }}
                          >
                            <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-neutral-500 text-[13px] mt-1">{model.description}</div>
                      <div className="text-neutral-400 text-[12px] mt-2 line-clamp-2">
                        {model.systemPrompt}
                      </div>
                    </div>
                  </div>
                </button>

                {model.id !== 'default' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteModel(model.id);
                    }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 400 }}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </motion.div>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
