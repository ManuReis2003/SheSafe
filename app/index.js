import { useState } from 'react';
// ================================================================
// 1. CORREÇÃO DO SAFEAREADVIEW E ADIÇÃO DO ACTIVITYINDICATOR
// ================================================================
import {
    ActivityIndicator, Alert,
    Platform, StatusBar,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// ================================================================
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// ================================================================
// 2. IMPORTAR FUNÇÕES DE LOGIN DO FIREBASE
// ================================================================
import { auth, signInWithEmailAndPassword } from '../firebaseConfig';
// ================================================================


// Ícone do Cadeado (SVG)
const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
        <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
        <Path d="M12 12v3" /><Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
    </Svg>
);

// Componente da Tela de Login (Rota principal "/")
export default function LoginScreen() {
    const router = useRouter(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ================================================================
    // 3. ESTADO DE CARREGAMENTO (LOADING)
    // ================================================================
    const [loading, setLoading] = useState(false);
    // ================================================================

    // ================================================================
    // 4. FUNÇÃO DE LOGIN REAL (handleLogin ATUALIZADA)
    // ================================================================
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Atenção", "Por favor, preencha o E-mail e a Senha.");
            return;
        }

        setLoading(true);

        try {
            // Tenta fazer o login com o Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);
            
            // Sucesso! Navega para a tela principal
            router.replace('/telaPrincipal');

        } catch (error) {
            console.error("Erro no Login:", error.code);
            // Trata erros comuns de login
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                Alert.alert("Erro", "E-mail ou senha inválidos.");
            } else if (error.code === 'auth/invalid-email') {
                 Alert.alert("Erro", "O formato do e-mail é inválido.");
            } else {
                Alert.alert("Erro", "Não foi possível fazer o login. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };
    // ================================================================


    // A cor principal (vinho/borgonha) e a cor secundária (rosa claro/pêssego) do protótipo
    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        // Corrigido para o novo SafeAreaView
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                
                {/* Logo e Nome do App */}
                <View style={styles.logoContainer}>
                    <LockIcon />
                    <Text style={styles.appName}>SheSafe</Text>
                </View>

                {/* Campos de Input */}
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
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // Esconde o texto digitado
                />

                {/* Botão Entrar */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: mainColor }]} 
                    onPress={handleLogin}
                    disabled={loading} // Desativa o botão durante o carregamento
                >
                    {/* ================================================================ */}
                    {/* 5. MOSTRAR "Entrando..." OU "Entrar" */}
                    {/* ================================================================ */}
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                    {/* ================================================================ */}
                </TouchableOpacity>
                
                {/* Link: Esqueci a Senha */}
                <TouchableOpacity 
                    onPress={() => router.push('/recuperacaoSenha')}
                    style={styles.forgotPasswordLink}
                >
                    <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
                </TouchableOpacity>

                {/* Botão Novo Cadastro */}
                <TouchableOpacity 
                    style={[styles.button, styles.registerButton]}
                    onPress={() => router.push('/signup')} // Navega para a tela de cadastro
                >
                    <Text style={[styles.buttonText, styles.registerButtonText]}>Fazer cadastro</Text>
                </TouchableOpacity>

                {/* Rodapé */}
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>
                        O SheSafe é exclusivamente destinado às mulheres. 
                        Saiba mais sobre o SheSafe nas redes sociais.
                    </Text>
                    <Text style={styles.footerHandle}>@SheSafe</Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

// --- ESTILOS DA TELA (Atualizados) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Fundo branco
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Centraliza o conteúdo
        paddingHorizontal: 30,
        paddingBottom: 20, // Garante espaço para o rodapé
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    appName: {
        fontSize: 48,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
        color: '#000000',
        marginTop: 10,
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
        width: '100%', // Botões com largura total
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
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
    // Botão de Cadastro (estilo secundário)
    registerButton: {
        marginTop: 15,
        backgroundColor: '#fff', // Fundo branco
        borderWidth: 2,
        borderColor: '#6a0a25', // Borda na cor principal
        elevation: 5, // Sombra menor
    },
    registerButtonText: {
        color: '#6a0a25', // Texto na cor principal
        fontSize: 18,
    },
    // Link "Esqueci a Senha"
    forgotPasswordLink: {
        marginTop: 15,
        padding: 5,
    },
    forgotPasswordText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    // Rodapé
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