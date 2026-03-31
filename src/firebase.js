import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "여기에_API_KEY",
  authDomain: "여기에.firebaseapp.com",
  projectId: "여기에",
  storageBucket: "여기에.appspot.com",
  messagingSenderId: "여기에",
  appId: "여기에"
};

const app = initializeApp(firebaseConfig);

export default app;