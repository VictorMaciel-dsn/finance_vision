import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyD1uEOixjO8qtuX1AKtxYurhDE4uhRU144',
  authDomain: 'finance-vision-2c35b.firebaseapp.com',
  projectId: 'finance-vision-2c35b',
  storageBucket: 'finance-vision-2c35b.appspot.com',
  messagingSenderId: '808371030298',
  appId: '1:808371030298:web:87f8bfbda395043a7544a3',
  measurementId: 'G-C0FXCTRT5C',
};

export const appFirebase = initializeApp(firebaseConfig);
export const storage = getStorage(appFirebase);
export const auth = getAuth(appFirebase);
export const analytics = getAnalytics(appFirebase);
