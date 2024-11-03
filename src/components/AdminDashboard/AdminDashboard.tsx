/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useSearchParams, useRouter } from 'next/navigation';
import ChatHistory from './ChatHistory';
import BotConfiguration from './BotConfiguration';
import SatisfactionSummary from './SatisfactionSummary';
import TotalChatsCard from './TotalChatsCard';

/*********************************************************************
                            COMPONENT
*********************************************************************/
export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view') || 'chats';

  const setView = (newView: 'chats' | 'config') => {
    router.push(`/admin?view=${newView}`);
  };

  /*********************************************************************
                            RENDER
  *********************************************************************/
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SatisfactionSummary />
        <TotalChatsCard />
      </div>

      {/* Navigation Cards */}
      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setView('chats')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            view === 'chats'
              ? 'bg-blue-500 text-white scale-105'
              : 'bg-white text-black hover:bg-blue-50'
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">Chat Management</h2>
          <p className="text-sm opacity-80">
            View and manage chat history with users
          </p>
        </button>

        <button
          onClick={() => setView('config')}
          className={`p-6 rounded-lg shadow-md transition-all ${
            view === 'config'
              ? 'bg-blue-500 text-white scale-105'
              : 'bg-white text-black hover:bg-blue-50'
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">ChatBot Configuration</h2>
          <p className="text-sm opacity-80">
            Configure your AI chatbot settings
          </p>
        </button>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {view === 'chats' ? <ChatHistory /> : <BotConfiguration />}
      </div>
    </div>
  );
}
