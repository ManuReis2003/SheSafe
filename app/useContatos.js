// useContatos.js
import { useEffect, useState } from "react";
import { auth, collection, db, onSnapshot } from "../firebaseConfig";
// Ajuste o caminho para onde está seu firebaseConfig.js

export function useContatos() {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return; // não tenta buscar se ninguém está logado

    const ref = collection(db, "usuarios", user.uid, "contatos");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContatos(lista);
    });

    return unsubscribe;
  }, []);

  return contatos;
}
