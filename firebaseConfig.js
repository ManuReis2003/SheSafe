import { initializeApp } from 'firebase/app';

// ================================================================
// 1. IMPORTAÇÕES DE AUTH ATUALIZADAS
// ================================================================
import {
    createUserWithEmailAndPassword,
    getReactNativePersistence,
    // Importa o 'initializeAuth' e o 'getReactNativePersistence'
    initializeAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
// Importa o AsyncStorage que você instalou
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// ================================================================

// Importações do FIRESTORE (Banco de Dados)
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    setDoc
} from 'firebase/firestore';


// Seus dados do Firebase (COLOQUE SUAS CHAVES AQUI)
const firebaseConfig = {
    apiKey: "AIzaSyB3vmgu16M9Dv_92rg-TZZb1BatW4z4Qdg",
    authDomain: "shesafe-e9ec0.firebaseapp.com",
    projectId: "shesafe-e9ec0",
    storageBucket: "shesafe-e9ec0.firebasestorage.app",
    messagingSenderId: "923936152297",
    appId: "1:923936152297:web:c110ca62a46d49b29a6e78"
};


// ================================================================
// 2. INICIALIZAÇÃO ATUALIZADA
// ================================================================
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com PERSISTÊNCIA (para "lembrar" o login)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializa o Firestore
const db = getFirestore(app);

// EXPORTE TUDO QUE IMPORTAMOS
export {
    addDoc, auth, collection, createUserWithEmailAndPassword, db, deleteDoc, doc, onSnapshot, setDoc, signInWithEmailAndPassword
};
// ================================================================