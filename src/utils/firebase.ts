import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAoSOrfrgcd5AKvVt2tLxNzTYdrdDNGtwQ",
  authDomain: "mises-search.firebaseapp.com",
  projectId: "mises-search",
  storageBucket: "mises-search.firebasestorage.app",
  messagingSenderId: "11135754351",
  appId: "1:11135754351:web:97b110085a59d64a3d2d9a",
  measurementId: "G-3QN1FF9GKS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };
