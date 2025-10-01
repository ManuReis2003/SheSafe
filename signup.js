import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Importação essencial para navegação com Expo Router
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Componente do Pop-up de Sucesso (mantido o mesmo)
const SuccessModal = ({ isVisible, onClose, router }) => {
    // Componente de modal simples que aparece após o cadastro ser concluído com sucesso.
    if (!isVisible) return null;

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Cadastro realizado.</Text>
                <Text style={styles.modalWelcome}>Bem-vinda ao <Text style={{ fontWeight: 'bold', color: '#6a0a25' }}>SheSafe!</Text></Text>
                {/* Botão para continuar e navegar para a tela principal (Login, por enquanto) */}
                <TouchableOpacity 
                    onPress={() => {
                        onClose();
                        router.replace('/'); // Navega para a rota inicial (Login)
                    }} 
                    style={styles.modalButton}
                >
                    <Text style={styles.modalButtonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Este é o componente da tela de Cadastro (Signup)
export default function SignupScreen() {
    // Inicializa o roteador do Expo Router
    const router = useRouter(); 

    // Estados para armazenar os dados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do pop-up

    // Função que será chamada quando o botão "Cadastrar" for pressionado
    const handleSignup = async () => {
        // Validação básica
        if (!name || !email || !phone || !password) {
            alert('Atenção: Por favor, preencha todos os campos.');
            return;
        }

        // --- INÍCIO DA INTEGRAÇÃO COM FIREBASE AUTHENTICATION E FIRESTORE ---
        // AQUI você irá adicionar a lógica real para criar o usuário no Firebase Auth
        // e salvar os dados adicionais no Firestore.

        /* try {
            // 1. Crie o usuário no Firebase Authentication
            // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // const user = userCredential.user;

            // 2. Salve os dados adicionais no Firestore
            // await setDoc(doc(db, "users", user.uid), {
            //     name: name,
            //     phone: phone,
            //     email: email
            // });

            // Se o cadastro for bem-sucedido:
            // setModalVisible(true); 
            
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro ao cadastrar. Tente novamente.");
        }
        */

        // SIMULAÇÃO DE SUCESSO (REMOVER APÓS INTEGRAR COM FIREBASE)
        console.log('Dados simulados:', { name, email, phone, password });
        setModalVisible(true);
        // FIM DA SIMULAÇÃO DE SUCESSO
        
        // --- FIM DA INTEGRAÇÃO COM FIREBASE ---
    };

    // Função para navegar para a tela de Login
    const navigateToLogin = () => {
        // USANDO EXPO ROUTER: Navega para a rota inicial que definimos como Login
        router.replace('/'); 
    };

    // A cor principal (vinho/borgonha) e a cor secundária (rosa claro/pêssego) do protótipo
    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        // SafeAreaView e Platform/StatusBar para garantir que o conteúdo não fique sob a barra de status do celular.
        <SafeAreaView style={styles.safeArea}>
            {/* O ScrollView (ou apenas View com altura) é ajustado para permitir rolagem se necessário */}
            <View style={styles.container}>
                
                {/* Ícone do Cadeado (Desenho em SVG - precisa do react-native-svg instalado) */}
                <View style={[styles.iconContainer, { marginTop: 40 }]}>
                    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                    </Svg>
                </View>

                {/* Título da Tela */}
                <Text style={styles.title}>Cadastro usuária</Text>
                <View style={styles.divider} />

                {/* Campos de Input */}
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="Telefone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Esconde o texto digitado
                />

                {/* Botão de Cadastro */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: mainColor }]}
                    onPress={handleSignup}
                >
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                {/* Link para Login */}
                <TouchableOpacity 
                    style={styles.loginLink}
                    onPress={navigateToLogin}
                >
                    <Text style={styles.loginLinkText}>Login</Text>
                    
                    {/* --- INÍCIO DA INTEGRAÇÃO COM TELA DE LOGIN DA COLEGA ---
                    AQUI o Expo Router fará o trabalho. O 'router.replace("/")' acima é a integração.
                    --- FIM DA INTEGRAÇÃO COM TELA DE LOGIN DA COLEGA --- */}

                </TouchableOpacity>

                {/* Mensagem legal */}
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>
                        Atenção! O aplicativo SheSafe é exclusivamente destinado às mulheres. Saiba mais sobre o SheSafe nas redes sociais. 
                    </Text>
                    <Text style={styles.footerHandle}>@SheSafe</Text>
                </View>

            </View>

            {/* Pop-up de Sucesso (Fixo) */}
            <SuccessModal 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                router={router}
            />

        </SafeAreaView>
    );
}

// Estilos de Componentes (Mantendo a estética do protótipo)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // Define um fundo escuro para simular a borda do celular (como no protótipo)
        backgroundColor: '#000', 
    },
    container: {
        flex: 1,
        // CORREÇÃO: Remove justify-content: center para evitar corte
        alignItems: 'center',
        backgroundColor: '#fff', 
        paddingHorizontal: 30, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20, 
        // CORREÇÃO: Adiciona padding extra para o rodapé e rolagem
        paddingBottom: 150,
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
        borderRadius: 30, // Bordas arredondadas do protótipo
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        width: '80%', // Botão Cadastrar mais largo e centralizado
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5.46,
        elevation: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginLink: {
        marginTop: 20,
        marginBottom: 40,
    },
    loginLinkText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footerTextContainer: {
        // Posicionado absoluto para ficar no final do container principal
        position: 'absolute', 
        bottom: 20,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    footerHandle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6a0a25',
        marginTop: 2,
    },
    // Estilos do Modal (Pop-up de Sucesso)
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150, // Altura do pop-up
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Fundo claro semitransparente
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    modalContent: {
        alignItems: 'center',
        marginTop: 40, // Desce o conteúdo para não ficar sob o notch/barra de status
    },
    modalText: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
    },
    modalWelcome: {
        fontSize: 18,
        color: '#555',
        marginTop: 5,
    },
    modalButton: {
        marginTop: 15,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#6a0a25',
        borderRadius: 20,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
