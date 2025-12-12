import { X, Moon, Sun, Globe, Shield, Info, Bell, Mic, Save, User as UserIcon, Crown, MessageSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { User, AppSettings } from '../App';

interface SettingsPanelProps {
  user: User;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdateUser: (user: User) => void;
}

export function SettingsPanel({ user, settings, onClose, onUpdateSettings, onUpdateUser }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'about'>('account');
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleSaveName = () => {
    onUpdateUser({ ...user, name: userName });
    setIsEditingName(false);
  };

  const tabs = [
    { id: 'account' as const, label: '账号', icon: UserIcon },
    { id: 'preferences' as const, label: '偏好设置', icon: Zap },
    { id: 'about' as const, label: '关于', icon: Info },
  ];

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
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-5 border-b border-neutral-200/60 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-white to-neutral-50/50"
        >
          <h2 className="text-neutral-900 text-[20px]" style={{ fontWeight: 600 }}>设置</h2>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgb(245 245 245)', y: -1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            transition={{ type: 'spring', damping: 15, stiffness: 400 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-neutral-200/60 flex gap-2 flex-shrink-0">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neutral-900 to-neutral-700 text-white shadow-lg'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <tab.icon className="w-4 h-4" strokeWidth={2} />
              <span className="text-[14px]">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="p-6 space-y-6"
              >
                {/* User Profile */}
                <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-5 border border-neutral-200/60 shadow-sm">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 400 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      <span className="text-white text-[20px]" style={{ fontWeight: 600 }}>{user.name.charAt(0)}</span>
                    </motion.div>
                    <div className="flex-1">
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-xl text-[15px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                            autoFocus
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveName}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-[14px] shadow-sm"
                          >
                            保存
                          </motion.button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[18px] text-neutral-900 mb-1" style={{ fontWeight: 600 }}>{user.name}</div>
                          <div className="text-[14px] text-neutral-500 mb-2">{user.email}</div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditingName(true)}
                            className="text-[13px] text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            编辑资料
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Plan */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-[16px] text-neutral-900" style={{ fontWeight: 600 }}>
                        {user.plan === 'pro' ? 'Pro 会员' : '免费版'}
                      </div>
                      <div className="text-[13px] text-amber-700">
                        {user.plan === 'pro' ? '享受无限对话' : '升级解锁更多功能'}
                      </div>
                    </div>
                  </div>
                  {user.plan !== 'pro' && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-[14px] shadow-lg"
                    >
                      升级到 Pro
                    </motion.button>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/60">
                    <MessageSquare className="w-6 h-6 text-blue-600 mb-2" strokeWidth={2} />
                    <div className="text-[24px] text-neutral-900" style={{ fontWeight: 600 }}>{user.messageCount || 0}</div>
                    <div className="text-[13px] text-blue-700">总消息数</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/60">
                    <Zap className="w-6 h-6 text-purple-600 mb-2" strokeWidth={2} />
                    <div className="text-[24px] text-neutral-900" style={{ fontWeight: 600 }}>∞</div>
                    <div className="text-[13px] text-purple-700">剩余额度</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="p-6 space-y-3"
              >
                <SettingToggle
                  icon={settings.theme === 'dark' ? Moon : Sun}
                  label="外观"
                  description={settings.theme === 'dark' ? '深色模式' : '浅色模式'}
                  value={settings.theme === 'dark'}
                  onChange={(value) => onUpdateSettings({ ...settings, theme: value ? 'dark' : 'light' })}
                  delay={0.1}
                />

                <SettingToggle
                  icon={Globe}
                  label="语言"
                  description="简体中文"
                  value={settings.language === 'zh-CN'}
                  onChange={(value) => onUpdateSettings({ ...settings, language: value ? 'zh-CN' : 'en-US' })}
                  delay={0.15}
                />

                <SettingToggle
                  icon={Mic}
                  label="语音输入"
                  description="启用语音输入功能"
                  value={settings.voiceInput}
                  onChange={(value) => onUpdateSettings({ ...settings, voiceInput: value })}
                  delay={0.2}
                />

                <SettingToggle
                  icon={Save}
                  label="自动保存"
                  description="自动保存对话记录"
                  value={settings.autoSave}
                  onChange={(value) => onUpdateSettings({ ...settings, autoSave: value })}
                  delay={0.25}
                />

                <SettingToggle
                  icon={Bell}
                  label="通知"
                  description="接收系统通知"
                  value={true}
                  onChange={() => {}}
                  delay={0.3}
                />

                <SettingToggle
                  icon={Shield}
                  label="隐私模式"
                  description="加强隐私保护"
                  value={false}
                  onChange={() => {}}
                  delay={0.35}
                />
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="p-6 space-y-4"
              >
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
                  >
                    <span className="text-white text-[28px]" style={{ fontWeight: 600 }}>L</span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[24px] text-neutral-900 mb-2" style={{ fontWeight: 600 }}
                  >
                    LintChat
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-[14px] text-neutral-500 mb-1"
                  >
                    版本 1.0.0
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[14px] text-neutral-400"
                  >
                    由 LintIntelligent 提供支持
                  </motion.p>
                </div>

                <div className="space-y-2">
                  <AboutLink label="服务条款" delay={0.35} />
                  <AboutLink label="隐私政策" delay={0.4} />
                  <AboutLink label="帮助中心" delay={0.45} />
                  <AboutLink label="反馈建议" delay={0.5} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="text-center text-[12px] text-neutral-400 pt-4"
                >
                  © 2024 LintChat. All rights reserved.
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-4 border-t border-neutral-200/60 bg-neutral-50/50 flex-shrink-0"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-red-500 hover:text-red-600 text-[15px] transition-colors rounded-xl hover:bg-red-50"
          >
            退出登录
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface SettingToggleProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  delay?: number;
}

function SettingToggle({ icon: Icon, label, description, value, onChange, delay = 0 }: SettingToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 300 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onChange(!value)}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-neutral-200/60"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
        value ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-neutral-100 text-neutral-600'
      }`}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      <div className="flex-1 text-left">
        <div className="text-[15px] text-neutral-900" style={{ fontWeight: 500 }}>{label}</div>
        <div className="text-[13px] text-neutral-500">{description}</div>
      </div>
      <motion.div
        animate={{ backgroundColor: value ? '#6366f1' : '#e5e7eb' }}
        className="relative w-12 h-7 rounded-full shadow-inner"
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', damping: 20, stiffness: 500 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </motion.div>
    </motion.button>
  );
}

interface AboutLinkProps {
  label: string;
  delay?: number;
}

function AboutLink({ label, delay = 0 }: AboutLinkProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', damping: 20, stiffness: 300 }}
      whileHover={{ x: 4, backgroundColor: 'rgb(249 250 251)' }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors"
    >
      <span className="text-[14px] text-neutral-700">{label}</span>
      <motion.div
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
      >
        <ChevronUp className="w-4 h-4 text-neutral-400 rotate-90" strokeWidth={2} />
      </motion.div>
    </motion.button>
  );
}

function ChevronUp({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}
