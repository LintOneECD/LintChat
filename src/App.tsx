import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { TopBar } from './components/TopBar';
import { SettingsPanel } from './components/SettingsPanel';
import { ModelPanel } from './components/ModelPanel';
import { motion, AnimatePresence } from 'motion/react';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  thinking?: string[];
  isThinking?: boolean;
  sources?: { title: string; url: string }[];
  searchQuery?: string;
  images?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  modelId?: string;
}

export interface AIModel {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
  color: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  messageCount?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  voiceInput: boolean;
  autoSave: boolean;
}

export default function App() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'default',
      name: 'LintIntelligent',
      systemPrompt: '你是一个友好、专业的 AI 助手，致力于为用户提供准确、有用的信息。',
      description: '默认模型',
      color: '#6366f1',
    },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: '新对话',
      messages: [],
      lastUpdated: new Date(),
      modelId: 'default',
    },
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);
  
  const [user, setUser] = useState<User>({
    name: '桃绿',
    email: 'taocatawa@gmail.com',
    plan: 'pro',
    messageCount: 1247,
  });

  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'zh-CN',
    voiceInput: false,
    autoSave: true,
  });

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const currentModel = models.find(m => m.id === currentConversation?.modelId) || models[0];

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      lastUpdated: new Date(),
      modelId: 'default',
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  };

  const handleSendMessage = async (
    content: string, 
    options?: { 
      searchWeb?: boolean; 
      searchUrl?: string;
      images?: string[];
    }
  ) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      searchQuery: options?.searchWeb ? content : options?.searchUrl,
      images: options?.images,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastUpdated: new Date(),
              title: conv.messages.length === 0 ? content.slice(0, 30) : conv.title,
            }
          : conv
      )
    );

    setTimeout(() => {
      const thinkingSteps = options?.images && options.images.length > 0
        ? [
            '正在分析图片内容...',
            '正在识别图片中的元素...',
            '正在理解你的问题...',
            '正在生成回答...',
          ]
        : options?.searchWeb || options?.searchUrl
        ? [
            '正在分析问题...',
            `正在搜索${options.searchUrl ? '指定网站' : 'Google'}...`,
            '正在整理搜索结果...',
            '正在生成回答...',
          ]
        : [
            '正在理解问题...',
            '正在检索知识库...',
            '正在组织回答...',
          ];

      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isThinking: true,
        thinking: [thinkingSteps[0]],
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, thinkingMessage] }
            : conv
        )
      );

      let stepIndex = 0;
      const thinkingInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < thinkingSteps.length) {
          setConversations(prev =>
            prev.map(conv =>
              conv.id === currentConversationId
                ? {
                    ...conv,
                    messages: conv.messages.map(msg =>
                      msg.id === thinkingMessage.id
                        ? { ...msg, thinking: thinkingSteps.slice(0, stepIndex + 1) }
                        : msg
                    ),
                  }
                : conv
            )
          );
        } else {
          clearInterval(thinkingInterval);
          
          setTimeout(() => {
            const aiMessage: Message = {
              id: thinkingMessage.id,
              content: generateMockResponse(content, currentModel.systemPrompt, options),
              role: 'assistant',
              timestamp: new Date(),
              isThinking: false,
              thinking: thinkingSteps,
              sources: (options?.searchWeb || options?.searchUrl) ? generateMockSources(options) : undefined,
            };

            setConversations(prev =>
              prev.map(conv =>
                conv.id === currentConversationId
                  ? {
                      ...conv,
                      messages: conv.messages.map(msg =>
                        msg.id === thinkingMessage.id ? aiMessage : msg
                      ),
                    }
                  : conv
              )
            );

            // Update message count
            setUser(prev => ({ ...prev, messageCount: (prev.messageCount || 0) + 1 }));
          }, 500);
        }
      }, 800);
    }, 600);
  };

  const generateMockResponse = (userInput: string, systemPrompt: string, options?: any): string => {
    if (options?.images && options.images.length > 0) {
      return `我看到你上传了 ${options.images.length} 张图片。让我为你分析一下：\n\n基于图片内容，我可以看到这是一个很有趣的主题。图片中展示了多个视觉元素，这些元素共同构成了一个完整的视觉叙事。\n\n从技术角度来看，这些图片具有以下特点：\n\n1. **构图**：画面布局合理，重点突出\n2. **色彩**：色彩搭配协调，具有视觉冲击力\n3. **细节**：细节丰富，信息量充足\n\n如果你有具体的问题，欢迎继续提问！`;
    }

    if (options?.searchWeb || options?.searchUrl) {
      return `基于${options.searchUrl ? `对 ${options.searchUrl} 的搜索` : 'Google 搜索'}，我为你找到了以下信息：\n\n${userInput} 是一个很好的问题。通过互联网搜索，我发现了几个关键点：\n\n1. **核心概念**：这个主题涉及多个方面的知识，从基础理论到实践应用都有深入的研究。\n\n2. **最新进展**：近期在这个领域有一些重要的突破和发现，为未来发展提供了新的方向。\n\n3. **实践应用**：已经有多个成功的案例证明了其可行性和有效性。\n\n这些信息来自权威来源，可以为你提供可靠的参考。`;
    }

    const responses = [
      '多模态模型（Multimodal Models）是人工智能领域中一种能够理解、处理并融合多种类型数据（即模态，如文本、图像、音频、视频等）的模型。它通过学习不同模态之间内在的关联性和互补信息，将它们映射到一个统一的联合表示空间（Joint Embedding Space）中，从而实现对世界的更全面认知。\n\n其核心机制包括：首先，对每种模态数据使用专用的编码器进行特征提取；其次，通过跨模态注意力机制或融合网络将这些不同模态的特征对齐并整合；最后，利用这种统一的表示来执行如图像问答、图文生成、跨模态检索等任务。\n\n多模态模型的出现标志着人工智能从单一感官理解向更接近人类的多感官理解迈进。',
      '基于你的问题，我认为可以从以下几个方面来分析：\n\n1. **理论基础**：这个领域已经有了相对成熟的理论框架，为实践提供了坚实的支撑。\n\n2. **实践应用**：已有多个成功案例可供参考，这些案例证明了方法的有效性。\n\n3. **发展趋势**：随着技术的进步，未来会有更多可能性。我们可以期待在这个领域看到更多创新。\n\n如果你需要更具体的建议，欢迎继续提问。',
      '这是一个很好的问题。让我为你详细解答：\n\n首先，我们需要理解问题的核心。这涉及到多个层面的考量，包括理论基础、实践经验和未来展望。每个层面都有其独特的价值和意义。\n\n从实践角度来看，最有效的方法通常是采取循序渐进的策略。这样可以确保每一步都是可控的，同时也能够及时调整方向，避免走弯路。\n\n希望这些信息对你有所帮助！如果还有其他问题，随时欢迎提问。',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateMockSources = (options?: any): { title: string; url: string }[] => {
    if (options?.searchUrl) {
      return [
        { title: `${options.searchUrl} - 相关页面`, url: options.searchUrl },
        { title: `${options.searchUrl} - 详细内容`, url: `${options.searchUrl}/details` },
      ];
    }
    
    return [
      { title: 'Wikipedia - 相关条目', url: 'https://wikipedia.org' },
      { title: 'Google Scholar - 学术论文', url: 'https://scholar.google.com' },
      { title: 'Stack Overflow - 技术讨论', url: 'https://stackoverflow.com' },
    ];
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === currentConversationId) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleClearAllConversations = () => {
    setConversations([]);
    handleNewConversation();
  };

  const handleCreateModel = (model: Omit<AIModel, 'id'>) => {
    const newModel: AIModel = {
      ...model,
      id: Date.now().toString(),
    };
    setModels(prev => [...prev, newModel]);
  };

  const handleDeleteModel = (id: string) => {
    if (id === 'default') return;
    setModels(prev => prev.filter(m => m.id !== id));
  };

  const handleSelectModel = (modelId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, modelId }
          : conv
      )
    );
  };

  const handleExportConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;

    const exportData = {
      title: conv.title,
      messages: conv.messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conv.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="w-65 flex-shrink-0"
          >
            <Sidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={setCurrentConversationId}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onClearAll={handleClearAllConversations}
              onExportConversation={handleExportConversation}
              user={user}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex-1 flex flex-col min-w-0"
        animate={{ 
          marginLeft: isSidebarOpen ? 0 : 0,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenModelPanel={() => setIsModelPanelOpen(true)}
          conversationTitle={currentConversation?.title || ''}
          currentModel={currentModel}
        />
        
        <ChatArea
          conversation={currentConversation}
          onSendMessage={handleSendMessage}
          currentModel={currentModel}
          settings={settings}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {isSettingsOpen && (
          <SettingsPanel
            user={user}
            settings={settings}
            onClose={() => setIsSettingsOpen(false)}
            onUpdateSettings={setSettings}
            onUpdateUser={setUser}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isModelPanelOpen && (
          <ModelPanel
            models={models}
            currentModelId={currentModel.id}
            onClose={() => setIsModelPanelOpen(false)}
            onCreateModel={handleCreateModel}
            onDeleteModel={handleDeleteModel}
            onSelectModel={handleSelectModel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
