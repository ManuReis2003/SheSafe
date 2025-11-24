import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList, // Componente principal para listas com rolagem
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// Importar o SafeAreaView correto
import { useRouter } from 'expo-router';
import { SafeAreaView as SafeContextView } from 'react-native-safe-area-context';
import Svg, { Line, Path, Polyline } from 'react-native-svg'; // Importações de SVG adicionadas

// Importações do Firebase
import { auth, collection, db, deleteDoc, doc, onSnapshot } from './firebaseConfig';

// --- ÍCONES (Baseados no Protótipo) ---

// Ícone de Cadeado Principal (do protótipo)
const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
        <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
        <Path d="M12 12v3" /><Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
    </Svg>
);

// Botão Adicionar (do protótipo)
const UserPlusIcon = ({ color }) => (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></Path>
        <Path d="M8.5 7a4 4 0 100-8 4 4 0 000 8z"></Path>
        <Line x1="20" y1="8" x2="20" y2="14"></Line>
        <Line x1="17" y1="11" x2="23" y2="11"></Line>
    </Svg>
);

// Ícones da Lista
const ListUserIcon = () => (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></Path>
        <Path d="M12 11a4 4 0 100-8 4 4 0 000 8z"></Path>
    </Svg>
);
const TrashIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C1B32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="3 6 5 6 21 6"></Polyline>
        <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></Path>
        <Line x1="10" y1="11" x2="10" y2="17"></Line>
        <Line x1="14" y1="11" x2="14" y2="17"></Line>
    </Svg>
);

// Ícones da Barra de Navegação (para consistência)
const HomeIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill={focused ? "#7C1B32" : "none"} stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <Path d="M9 22V12h6v10"/>
    </Svg>
);
const UserNavIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <Path d="M12 11a4 4 0 100-8 4 4 0 000 8z"/>
    </Svg>
);
const SmallLockIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5z"/>
    </Svg>
);
const LocationIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/>
        <Path d="M12 10a3 3 0 100-6 3 3 0 000 6z"/>
    </Svg>
);

export default function ContatosScreen() {
    const router = useRouter(); 
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Erro", "Usuária não autenticada.");
            router.replace('/');
            return;
        }

        const contatosRef = collection(db, 'usuarios', user.uid, 'contatos');

        const unsubscribe = onSnapshot(contatosRef, (querySnapshot) => {
            const listaDeContatos = [];
            querySnapshot.forEach((doc) => {
                listaDeContatos.push({ id: doc.id, ...doc.data() });
            });
            setContatos(listaDeContatos); 
            setLoading(false); 
        }, (error) => {
            console.error("Erro ao buscar contatos: ", error);
            Alert.alert("Erro", "Não foi possível carregar os contatos.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []); 

    const handleDeletarContato = (contatoId, contatoNome) => {
        Alert.alert(
            "Excluir Contato",
            `Tem certeza que deseja excluir "${contatoNome}" da sua lista?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            const docRef = doc(db, 'usuarios', user.uid, 'contatos', contatoId);
                            await deleteDoc(docRef);
                            Alert.alert("Sucesso", "Contato excluído.");
                        } catch (error) {
                            console.error("Erro ao excluir contato: ", error);
                            Alert.alert("Erro", "Não foi possível excluir o contato.");
                        }
                    } 
                }
            ]
        );
    };

    const ItemContato = ({ nome, relacao, id }) => (
        <View style={styles.itemContainer}>
            <ListUserIcon/>
            <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{nome}</Text>
                {relacao ? <Text style={styles.itemRelacao}>{relacao}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => handleDeletarContato(id, nome)}>
                <TrashIcon/>
            </TouchableOpacity>
        </View>
    );

    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        <SafeContextView style={styles.safeArea}>
            {/* Usando o SafeContextView (o SafeAreaView correto) */}
            <StatusBar barStyle="dark-content"/>
            
            <View style={styles.container}>
                {/* NOVO CABEÇALHO (do protótipo) */}
                <View style={styles.logoContainer}>
                    <LockIcon/>
                    <Text style={styles.title}>Contatos</Text>
                </View>
                
                {/* Botão Adicionar Novo Contato (Linkado) */}
                <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: secondaryColor }]}
                    onPress={() => router.push('/cadastroContato')}>
                    <UserPlusIcon color={mainColor}/>
                    <Text style={styles.addButtonText}>Adicionar novo contato</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>Minha lista</Text>

                {/* LISTA COM BARRA DE ROLAGEM (FLATLIST) */}
                {loading ? (
                    <ActivityIndicator size="large" color={mainColor} style={{ marginTop: 20 }}/>
                ) : (
                    <FlatList
                        data={contatos}
                        renderItem={({ item }) => (
                            <ItemContato nome={item.nome} relacao={item.relacao} id={item.id}/>
                        )}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>Sua lista de contatos está vazia.</Text>
                        )}
                    />
                )}
            </View>

            {/* Barra de Navegação (do protótipo) */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/telaPrincipal')}>
                    <HomeIcon/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton}>
                    <UserNavIcon focused={true} /> {/* Focado aqui */}
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => router.push('/mapa')}>
                    <LocationIcon/>
                </TouchableOpacity>
            </View>
        </SafeContextView>
    );
}

// Estilos (Atualizados para o novo protótipo)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30, 
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? 20 : 0,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    addButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 30, 
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    itemRelacao: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#888',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F2F2F2',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 30,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    navButton: {
        alignItems: 'center',
    },
});
