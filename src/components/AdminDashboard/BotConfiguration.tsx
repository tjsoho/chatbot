/*********************************************************************
                            IMPORTS
*********************************************************************/
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import CustomToast from '@/components/Toast/CustomToast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

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
  logoUrl: string;
  profilePhotoUrl: string;
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
  welcomeMessage: '',
  logoUrl: '/images/logo1.png',
  profilePhotoUrl: '/images/profile.png',
};

/*********************************************************************
                        HELPER FUNCTIONS
*********************************************************************/
const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Verify storage is available
    if (!storage) {
      throw new Error('Firebase Storage is not initialized');
    }

    console.log('Starting upload for:', path, 'Storage:', storage); // Debug log
    const storageRef = ref(storage, path);
    
    if (!storageRef) {
      throw new Error('Failed to create storage reference');
    }

    const snapshot = await uploadBytes(storageRef, file);
    console.log('Upload successful:', snapshot); // Debug log
    
    const url = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', url); // Debug log
    
    return url;
  } catch (error) {
    console.error('Upload error details:', {
      error,
      storageInitialized: !!storage,
      filePath: path,
      fileName: file.name,
      fileSize: file.size
    });
    throw error;
  }
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'profile'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const path = `images/${type}/${Date.now()}_${file.name}`;
      const url = await uploadImage(file, path);
      
      setConfig(prev => ({
        ...prev,
        [`${type}Url`]: url
      }));

      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Image uploaded successfully!"
          buttons={[
            {
              label: 'Close',
              onClick: () => toast.dismiss(t.id),
              variant: 'primary'
            }
          ]}
        />
      ));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error uploading image:', error);
      
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={`Failed to upload image: ${errorMessage}`}
          buttons={[
            {
              label: 'Dismiss',
              onClick: () => toast.dismiss(t.id),
              variant: 'danger'
            }
          ]}
        />
      ));
    } finally {
      setIsSaving(false);
    }
  };

  /*********************************************************************
                            RENDER
  *********************************************************************/
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-zinc-800">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-4 transition-all duration-300 ${
              activeTab === 'general'
                ? 'border-b-2 border-cyan-500 text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2 px-4 transition-all duration-300 ${
              activeTab === 'faqs'
                ? 'border-b-2 border-cyan-500 text-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            FAQs
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6 opacity-100">
        {activeTab === 'general' ? (
          // General Settings Tab
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bot Name</label>
              <input
                type="text"
                value={config.botName}
                onChange={(e) => setConfig(prev => ({ ...prev, botName: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300"
                placeholder="e.g., Sal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Name</label>
              <input
                type="text"
                value={config.businessName}
                onChange={(e) => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Background</label>
              <textarea
                value={config.businessBackground}
                onChange={(e) => setConfig(prev => ({ ...prev, businessBackground: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300 min-h-[100px]"
                placeholder="Tell us about your business..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Welcome Message</label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300"
                placeholder="Welcome message for users..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bot Goal</label>
              <input
                type="text"
                value={config.botGoal}
                onChange={(e) => setConfig(prev => ({ ...prev, botGoal: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300"
                placeholder="What is the bot's main purpose?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Fallback Response</label>
              <input
                type="text"
                value={config.fallbackResponse}
                onChange={(e) => setConfig(prev => ({ ...prev, fallbackResponse: e.target.value }))}
                className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                  focus:border-cyan-500/50 transition-all duration-300"
                placeholder="Response when bot can't answer"
              />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  {config.logoUrl && (
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50">
                      <Image
                        src={config.logoUrl}
                        alt="Company Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-cyan-500/10 file:text-cyan-400
                      hover:file:bg-cyan-500/20
                      file:transition-all file:duration-300
                      cursor-pointer"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bot Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  {config.profilePhotoUrl && (
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800/50">
                      <Image
                        src={config.profilePhotoUrl}
                        alt="Bot Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-cyan-500/10 file:text-cyan-400
                      hover:file:bg-cyan-500/20
                      file:transition-all file:duration-300
                      cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // FAQs Tab
          <div>
            <div className="space-y-4">
              {config.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                          focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Question"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        className="w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-gray-200 
                          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
                          focus:border-cyan-500/50 transition-all duration-300 min-h-[100px]"
                        placeholder="Answer"
                        rows={4}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 hover:bg-red-500/10 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFAQ}
                className="w-full p-3 border border-dashed border-zinc-700 rounded-lg text-gray-400 
                  hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5
                  transition-all duration-300 mt-4"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-zinc-800">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 
              text-zinc-900 font-medium rounded-md
              hover:from-cyan-400 hover:to-cyan-300
              focus:outline-none focus:ring-2 focus:ring-cyan-500/50 
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:from-cyan-500 disabled:hover:to-cyan-400
              ${isSaving ? 'animate-pulse' : ''}`}
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 