import { initializeApp ,getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCyEtUVwkWZT8iKn-xk3rUWp08AcI8u8Yw",
  authDomain: "notes-55847.firebaseapp.com",
  projectId: "notes-55847",
  storageBucket: "notes-55847.firebasestorage.app",
  messagingSenderId: "860391005058",
  appId: "1:860391005058:web:04cbfdb45d16c2eca84d9b",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };
