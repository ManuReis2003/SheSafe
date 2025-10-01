import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Importação essencial para navegação com Expo Router
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Componente da Tela de Login (Rota principal "/")
export default function LoginScreen() {
    // Inicializa o roteador para permitir a navegação
    const router = useRouter(); 

    // Estados para armazenar os dados de email e senha
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função que será chamada quando o botão "Entrar" for pressionado
    const handleLogin = () => {
        // Validação básica
        if (!email || !password) {
            alert('Atenção: Por favor, preencha o E-mail e a Senha.');
            return;
        }

        // --- INÍCIO DA INTEGRAÇÃO COM FIREBASE AUTHENTICATION ---
        // AQUI você adicionará a lógica real para autenticar o usuário no Firebase.

        /* try {
            // Exemplo: await signInWithEmailAndPassword(auth, email, password);
            // Se sucesso: router.replace('/home'); 
        } catch (error) {
            alert("Erro no Login. Verifique suas credenciais.");
        }
        */

        // SIMULAÇÃO DE LOGIN (REMOVER APÓS INTEGRAR COM FIREBASE)
        console.log('Tentativa de Login:', { email, password });
        // Simula login bem-sucedido navegando para uma rota Home (se existir)
        // Por enquanto, vamos apenas navegar para o Cadastro para testar a função:
        alert('Login simulado com sucesso. Indo para a tela Home (se for criada).');
        // Você usará router.replace('/home') quando tiver a tela principal.
        
        // FIM DA SIMULAÇÃO
        // --- FIM DA INTEGRAÇÃO COM FIREBASE ---
    };

    // Função para navegar para a tela de Cadastro (rota "/signup")
    const navigateToSignup = () => {
        // Usa 'push' ou 'replace' para ir para a rota /signup
        // 'push' permite que o usuário volte para o Login.
        router.push('/signup'); 
    };

    // Definição de cores do protótipo
    const mainColor = '#6a0a25'; // Vinho/Borgonha
    const secondaryColor = '#d9c7d0'; // Rosa claro/Pêssego

    return (
        // SafeAreaView e Platform/StatusBar para garantir que o conteúdo não fique sob a barra de status do celular
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Ícone do Cadeado */}
                <View style={styles.iconContainer}>
                    <Svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                    </Svg>
                </View>

                {/* Nome do Aplicativo */}
                <Text style={styles.appName}>SheSafe</Text>

                {/* Campo de E-mail */}
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="E-mail"
                    placeholderTextColor="#555"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                {/* Campo de Senha */}
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder="Senha"
                    placeholderTextColor="#555"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry 
                />

                {/* Botão de Entrar */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: mainColor }]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                {/* Novo Botão de Fazer Cadastro */}
                <TouchableOpacity 
                    style={styles.signupLink}
                    onPress={navigateToSignup}
                >
                    <Text style={styles.signupLinkText}>Fazer cadastro</Text>
                </TouchableOpacity>

                {/* Mensagem de Rodapé */}
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>
                        O SheSafe é exclusivamente destinado às mulheres. Saiba mais sobre o SheSafe nas redes sociais. 
                    </Text>
                    <Text style={styles.footerHandle}>@SheSafe</Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

// Estilos de Componentes (Ajustados para celular)
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Fundo principal branco
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        // Garante que o conteúdo fique centrado verticalmente em telas menores
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 30, 
    },
    iconContainer: {
        marginBottom: 20,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30, 
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
        width: '100%', 
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
    signupLink: {
        marginTop: 20,
    },
    signupLinkText: {
        color: '#6a0a25',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footerTextContainer: {
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
});