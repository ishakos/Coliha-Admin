import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmapcJw0wzmjLrIokIz-9PLk7aqsxm-Ko",
  authDomain: "e-com-dav.firebaseapp.com",
  projectId: "e-com-dav",
  storageBucket: "e-com-dav.appspot.com",
  messagingSenderId: "118788884916",
  appId: "1:118788884916:web:d1382a6341773e2b204ae1",
  measurementId: "G-JHRGPGWJWN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
