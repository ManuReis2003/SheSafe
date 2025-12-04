import React, { useState, useEffect } from 'react';
// ===== CORREÇÃO 1/3: Imports corretos do React Native =====
import { 
    Platform, 
    StatusBar, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    ActivityIndicator, 
    Alert,
    ScrollView // Adicionado ScrollView para garantir que o balão caiba na tela pequena
} from 'react-native';
// ===== CORREÇÃO 2/3: Importar SafeAreaView do 'safe-area-context' =====
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// ===== CORREÇÃO 3/3: Importar 'Line' que estava faltando para o ícone =====
import Svg, { Path, Line } from 'react-native-svg';

// Importar funções do Firebase
// ADICIONADO: onSnapshot para verificar quantos contatos já existem
import { auth, db, collection, addDoc, onSnapshot } from '../firebaseConfig';


// Ícone de "Usuário" para o cabeçalho
const UserPlusIcon = ({ color }) => (
    <Svg width="60" height="70" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></Path>
        <Path d="M8.5 7a4 4 0 100-8 4 4 0 000 8z"></Path>
        <Line x1="20" y1="8" x2="20" y2="14"></Line>
        <Line x1="17" y1="11" x2="23" y2="11"></Line>
    </Svg>
);


// Componente da tela de Cadastro de Contato
export default function CadastroContatoScreen() {
    const router = useRouter(); 

    // Estados para os campos do formulário
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [relacao, setRelacao] = useState(''); 
    
    const [loading, setLoading] = useState(false); 
    const [contatosCount, setContatosCount] = useState(0); // Estado para contar contatos

    // -------------------------------------------------------------
    // 1. EFEITO PARA CONTAR CONTATOS EXISTENTES
    // -------------------------------------------------------------
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const contatosRef = collection(db, 'usuarios', user.uid, 'contatos');
        
        // Ouve em tempo real quantos contatos existem
        const unsubscribe = onSnapshot(contatosRef, (snapshot) => {
            setContatosCount(snapshot.size);
        });

        return () => unsubscribe();
    }, []);


    // Função para salvar o contato no Firestore
    const handleSalvarContato = async () => {
        // Validação básica
        if (!nome || !telefone || !relacao) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        // -------------------------------------------------------------
        // 2. BLOQUEIO DE LIMITE (VERSÃO BETA)
        // -------------------------------------------------------------
        if (contatosCount >= 1) {
            Alert.alert(
                "ATENÇÃO!", 
                "Prezada usuária, este projeto está na versão beta. Por esse motivo, só é possível adicionar 1 contato de confiança, devido ao envio manual das mensagens.\n\nA opção de adicionar +1 contato de confiança estará disponível em breve."
            );
            return;
        }

        setLoading(true);

        // LÓGICA DE SALVAMENTO NO FIRESTORE
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Erro", "Você precisa estar logada para adicionar contatos.");
                setLoading(false);
                router.replace('/'); 
                return;
            }

            const contatosRef = collection(db, 'usuarios', user.uid, 'contatos');

            await addDoc(contatosRef, {
                nome: nome,
                telefone: telefone,
                relacao: relacao
            });

            setLoading(false);
            Alert.alert("Sucesso!", "Contato de confiança salvo.");
            
            setNome('');
            setTelefone('');
            setRelacao('');
            router.back(); 

        } catch (error) {
            setLoading(false);
            console.error("Erro ao salvar contato:", error);
            if (error.code === 'permission-denied') {
                 Alert.alert("Erro de Permissão", "Falha ao salvar. Verifique as regras do Firestore.");
            } else {
                Alert.alert("Erro", "Não foi possível salvar o contato. Tente novamente.");
            }
        }
    };

    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    // Texto do aviso para reuso
    const avisoTexto = "Prezada usuária, este projeto está na versão beta. Por esse motivo, só é possível adicionar 1 contato de confiança, devido ao envio manual das mensagens.\nA opção de adicionar +1 contato de confiança estará disponível em breve.";

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    
                    <View style={[styles.iconContainer, { marginTop: 40 }]}>
                        <UserPlusIcon color={mainColor} />
                    </View>

                    <Text style={styles.title}>Adicionar Contato</Text>
                    <View style={styles.divider} />

                    {/* Campos de Input */}
                    <TextInput
                        style={[styles.input, { backgroundColor: secondaryColor, textAlign: 'left', paddingLeft: 20 }]}
                        placeholder="Nome do Contato"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: secondaryColor, textAlign: 'left', paddingLeft: 20 }]}
                        placeholder="Telefone (com DDD)"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: secondaryColor, textAlign: 'left', paddingLeft: 20 }]}
                        placeholder="Relação (Ex: Mãe, Amiga...)"
                        value={relacao}
                        onChangeText={setRelacao}
                    />

                    {/* Botão de Salvar */}
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: mainColor }]}
                        onPress={handleSalvarContato}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Salvar Contato</Text>
                        )}
                    </TouchableOpacity>

                    {/* ------------------------------------------------------------- */}
                    {/* 3. BALÃO DE AVISO (VISUAL) */}
                    {/* ------------------------------------------------------------- */}
                    <View style={styles.warningBalloon}>
                        <Text style={styles.warningTitle}>ATENÇÃO!</Text>
                        <Text style={styles.warningText}>
                            {avisoTexto}
                        </Text>
                    </View>

                    {/* Link para Voltar */}
                    <TouchableOpacity 
                        style={styles.link}
                        onPress={() => router.back()} 
                    >
                        <Text style={styles.linkText}>Cancelar</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', 
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 30, 
        paddingBottom: 40, 
    },
    iconContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30, 
        fontSize: 18,
        marginVertical: 10, 
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        width: '80%', 
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5.46,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // Estilos do Balão de Aviso
    warningBalloon: {
        width: '100%',
        backgroundColor: '#FADBD8', // Vermelho claro
        borderColor: '#C0392B', // Vermelho vivo
        borderWidth: 1.5,
        borderRadius: 15,
        padding: 15,
        marginTop: 30,
        marginBottom: 10,
    },
    warningTitle: {
        color: '#C0392B',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
    warningText: {
        color: '#7C1B32', // Um tom escuro de vermelho/vinho para leitura
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    link: {
        marginTop: 10,
        marginBottom: 20, 
    },
    linkText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});