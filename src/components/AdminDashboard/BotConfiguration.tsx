/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import CustomToast from '@/components/Toast/CustomToast';

/*********************************************************************
                            INTERFACES
*********************************************************************/
interface FAQ {
  question: string;
  answer: string;
}

interface BotConfig {
  botName: string;
  businessName: string;
  businessBackground: string;
  faqs: FAQ[];
  fallbackResponse: string;
  contactUrl: string;
  signUpUrl: string;
  botGoal: string;
  welcomeMessage: string;
}

const defaultConfig: BotConfig = {
  botName: '',
  businessName: '',
  businessBackground: '',
  faqs: [{ question: '', answer: '' }],
  fallbackResponse: '',
  contactUrl: '',
  signUpUrl: '',
  botGoal: '',
  welcomeMessage: ''
};

/*********************************************************************
                            COMPONENT
*********************************************************************/
export default function BotConfiguration() {
  const [config, setConfig] = useState<BotConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'faqs'>('general');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const configRef = doc(db, 'botConfig', 'settings');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        setConfig(configSnap.data() as BotConfig);
      } else {
        // Initialize with default config if none exists
        await setDoc(configRef, defaultConfig);
        setConfig(defaultConfig);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
      setError('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const configRef = doc(db, 'botConfig', 'settings');
      await setDoc(configRef, config);
      
      // Replace alert with custom toast
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Configuration saved successfully!"
          buttons={[
            {
              label: 'Close',
              onClick: () => toast.dismiss(t.id),
              variant: 'primary'
            }
          ]}
        />
      ), {
        duration: 3000,
        position: 'top-right',
      });

    } catch (err) {
      console.error('Error saving config:', err);
      setError('Failed to save configuration');
      
      // Error toast
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Failed to save configuration. Please try again."
          buttons={[
            {
              label: 'Dismiss',
              onClick: () => toast.dismiss(t.id),
              variant: 'danger'
            }
          ]}
        />
      ), {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addFAQ = () => {
    setConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index: number) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        message="Are you sure you want to delete this FAQ? This cannot be undone."
        buttons={[
          {
            label: 'Delete',
            onClick: () => {
              setConfig(prev => ({
                ...prev,
                faqs: prev.faqs.filter((_, i) => i !== index)
              }));
              toast.dismiss(t.id);
            },
            variant: 'danger'
          },
          {
            label: 'Cancel',
            onClick: () => toast.dismiss(t.id),
            variant: 'cancel'
          }
        ]}
      />
    ), {
      duration: 5000,
      position: 'top-right',
    });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setConfig(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  /*********************************************************************
                            RENDER
  *********************************************************************/
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Bot Configuration</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Add Tab Navigation */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-4 ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2 px-4 ${
              activeTab === 'faqs'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
          >
            FAQs
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {activeTab === 'general' ? (
          // General Settings Tab
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Bot Name</label>
              <input
                type="text"
                value={config.botName}
                onChange={(e) => setConfig(prev => ({ ...prev, botName: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="e.g., Sal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Business Name</label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Business Background</label>
              <textarea
                value={config.businessBackground}
                onChange={(e) => setConfig(prev => ({ ...prev, businessBackground: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="Tell us about your business..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Welcome Message</label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="Welcome message for users..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Bot Goal</label>
              <input
                type="text"
                value={config.botGoal}
                onChange={(e) => setConfig(prev => ({ ...prev, botGoal: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="What is the bot's main purpose?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Fallback Response</label>
              <input
                type="text"
                value={config.fallbackResponse}
                onChange={(e) => setConfig(prev => ({ ...prev, fallbackResponse: e.target.value }))}
                className="w-full p-2 border rounded-md text-black"
                placeholder="Response when bot can't answer"
              />
            </div>
          </div>
        ) : (
          // FAQs Tab
          <div>
            <label className="block text-sm font-medium text-black mb-2">FAQs</label>
            <div className="space-y-4">
              {config.faqs.map((faq, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full p-2 border rounded-md text-black mb-2"
                      placeholder="Question"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="Answer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFAQ}
                className="text-blue-500 hover:text-blue-700"
              >
                Add FAQ
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
} 