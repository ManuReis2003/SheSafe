import { useState } from 'react';
// ===== CORREÇÃO 1/3: Imports corretos do React Native =====
import {
    ActivityIndicator,
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// ===== CORREÇÃO 2/3: Importar SafeAreaView do 'safe-area-context' =====
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// ===== CORREÇÃO 3/3: Importar 'Line' que estava faltando para o ícone =====
import Svg, { Line, Path } from 'react-native-svg';

// Importar funções do Firebase
// (Garante que 'collection' e 'addDoc' estão sendo exportados do firebaseConfig.js)
import { addDoc, auth, collection, db } from './firebaseConfig';


// Ícone de "Usuário" para o cabeçalho (agora com 'Line' importado)
const UserPlusIcon = ({ color }) => (
    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    const [relacao, setRelacao] = useState(''); // Ex: Mãe, Amiga, Irmã
    
    const [loading, setLoading] = useState(false); 

    // Função para salvar o contato no Firestore
    const handleSalvarContato = async () => {
        // Validação básica
        if (!nome || !telefone || !relacao) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        // LÓGICA DE SALVAMENTO NO FIRESTORE
        try {
            // Primeiro, pegamos o ID da usuária atualmente logada
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Erro", "Você precisa estar logada para adicionar contatos.");
                setLoading(false);
                router.replace('/'); // Envia para o login se não estiver logada
                return;
            }

            // O caminho para a subcoleção é: 'usuarios' -> (ID da Usuária) -> 'contatos'
            const contatosRef = collection(db, 'usuarios', user.uid, 'contatos');

            // Adicionamos o novo documento (contato) nessa subcoleção
            await addDoc(contatosRef, {
                nome: nome,
                telefone: telefone,
                relacao: relacao
            });

            setLoading(false);
            Alert.alert("Sucesso!", "Contato de confiança salvo.");
            
            // Limpa os campos e volta para a tela anterior
            setNome('');
            setTelefone('');
            setRelacao('');
            router.back(); // Volta para a tela de onde veio (ex: telaPrincipal)

        } catch (error) {
            setLoading(false);
            console.error("Erro ao salvar contato:", error);
            // Verifica se o erro é de permissão (que corrigimos nas regras)
            if (error.code === 'permission-denied') {
                 Alert.alert("Erro de Permissão", "Falha ao salvar. Verifique as regras do Firestore.");
            } else {
                Alert.alert("Erro", "Não foi possível salvar o contato. Tente novamente.");
            }
        }
    };

    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        // Usando o SafeAreaView corrigido
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                
                <View style={[styles.iconContainer, { marginTop: 40 }]}>
                    <UserPlusIcon color={mainColor} />
                </View>

                <Text style={styles.title}>Adicionar Contato</Text>
                <View style={styles.divider}/>

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

                {/* Link para Voltar */}
                <TouchableOpacity 
                    style={styles.link}
                    onPress={() => router.back()} // Volta para a tela anterior
                >
                    <Text style={styles.linkText}>Cancelar</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

// Estilos (baseados no signup.js para consistência)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // Corrigido para fundo branco, que é o padrão do app
        backgroundColor: '#fff', 
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff', 
        paddingHorizontal: 30, 
        // Remove o padding do StatusBar pois o SafeAreaView cuida disso
    },
    iconContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
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
        marginTop: 30, 
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
    link: {
        marginTop: 20,
        marginBottom: 20, 
    },
    linkText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});