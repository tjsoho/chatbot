import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultConfig = {
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

export async function initializeBotConfig() {
  const configRef = doc(db, 'botConfig', 'settings');
  const configSnap = await getDoc(configRef);

  if (!configSnap.exists()) {
    try {
      await setDoc(configRef, defaultConfig);
      console.log('Bot configuration initialized');
    } catch (error) {
      console.error('Error initializing bot config:', error);
    }
  }
} 