import React, { useState } from 'react';
// ================================================================
// 1. ADICIONAMOS KeyboardAvoidingView E ScrollView
// ================================================================
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Platform, StatusBar, ActivityIndicator, Alert,
    KeyboardAvoidingView, ScrollView // <--- Importações novas
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 

import Svg, { Path, Line } from 'react-native-svg';

import { auth, signInWithEmailAndPassword } from '../firebaseConfig';


// --- ÍCONES ---

const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
        <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
        <Path d="M12 12v3" /><Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
    </Svg>
);

const EyeIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></Path>
        <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></Path>
    </Svg>
);

const EyeOffIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></Path>
        <Line x1="1" y1="1" x2="23" y2="23"></Line>
    </Svg>
);


// Componente da Tela de Login
export default function LoginScreen() {
    const router = useRouter(); 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Atenção", "Por favor, preencha o E-mail e a Senha.");
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace('/telaPrincipal');
        } catch (error) {
            console.error("Erro no Login:", error.code);
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

    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            
            {/* 2. ESTRUTURA RESPONSIVA (KeyboardAvoidingView + ScrollView) */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        
                        <View style={styles.logoContainer}>
                            <LockIcon />
                            <Text style={styles.appName}>SheSafe</Text>
                        </View>

                        {/* Input Email */}
                        <TextInput
                            style={[styles.input, { backgroundColor: secondaryColor }]}
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        
                        {/* Input Senha com Ícone */}
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[
                                    styles.input, 
                                    { 
                                        backgroundColor: secondaryColor, 
                                        marginVertical: 0, 
                                        paddingRight: 50,
                                        paddingLeft: 50,
                                        textAlign: 'center' 
                                    }
                                ]}
                                placeholder="Senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword} 
                            />
                            
                            <TouchableOpacity 
                                style={styles.eyeIcon} 
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </TouchableOpacity>
                        </View>

                        {/* Botão Entrar */}
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: mainColor }]} 
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>
                        
                        {/* Links */}
                        <TouchableOpacity 
                            onPress={() => router.push('/recuperacaoSenha')}
                            style={styles.forgotPasswordLink}
                        >
                            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.registerButton]}
                            onPress={() => router.push('/signup')}
                        >
                            <Text style={[styles.buttonText, styles.registerButtonText]}>Fazer cadastro</Text>
                        </TouchableOpacity>

                        {/* Rodapé agora faz parte do fluxo, não sobrepõe */}
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.footerText}>
                                O SheSafe é exclusivamente destinado às mulheres. 
                                Saiba mais sobre o SheSafe nas redes sociais.
                            </Text>
                            <Text style={styles.footerHandle}>@SheSafe</Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', 
    },
    // Estilo para o ScrollView centralizar o conteúdo quando houver espaço
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        // Removemos flex: 1 daqui para o ScrollView funcionar
        alignItems: 'center',
        justifyContent: 'center', 
        paddingHorizontal: 30,
        paddingBottom: 20, 
        width: '100%',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20, // Margem extra para telas pequenas
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
    passwordWrapper: {
        width: '100%',
        position: 'relative', 
        justifyContent: 'center',
        marginVertical: 10, 
    },
    eyeIcon: {
        position: 'absolute', 
        right: 15, 
        padding: 5, 
        justifyContent: 'center',
        height: '100%', 
    },
    button: {
        width: '100%', 
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
    registerButton: {
        marginTop: 15,
        backgroundColor: '#fff', 
        borderWidth: 2,
        borderColor: '#6a0a25', 
        elevation: 5, 
    },
    registerButtonText: {
        color: '#6a0a25', 
        fontSize: 18,
    },
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
    // Rodapé modificado para não ser absoluto
    footerTextContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 40, // Espaço seguro do último botão
        marginBottom: 10,
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