import React, { useState } from 'react';
// ================================================================
// 1. IMPORTAR COMPONENTES DE RESPONSIVIDADE
// ================================================================
import { 
    Platform, 
    SafeAreaView, 
    StatusBar, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    ActivityIndicator,
    KeyboardAvoidingView, // Ajusta a tela com o teclado
    ScrollView // Adiciona rolagem
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Line } from 'react-native-svg';

// Importar funções do Firebase
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from '../firebaseConfig';


// --- ÍCONES ---

// Ícone de Olho Aberto
const EyeIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></Path>
        <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></Path>
    </Svg>
);

// Ícone de Olho Fechado
const EyeOffIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></Path>
        <Line x1="1" y1="1" x2="23" y2="23"></Line>
    </Svg>
);


// Componente do Pop-up de Sucesso
const SuccessModal = ({ isVisible, onClose, router }) => {
    if (!isVisible) return null;
    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Cadastro realizado.</Text>
                <Text style={styles.modalWelcome}>Bem-vinda ao <Text style={{ fontWeight: 'bold', color: '#6a0a25' }}>SheSafe!</Text></Text>
                <TouchableOpacity 
                    onPress={() => {
                        onClose();
                        router.replace('/'); 
                    }} 
                    style={styles.modalButton}
                >
                    <Text style={styles.modalButtonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Componente da Tela de Cadastro
export default function SignupScreen() {
    const router = useRouter(); 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [modalVisible, setModalVisible] = useState(false); 
    const [loading, setLoading] = useState(false); 

    const handleSignup = async () => {
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Atenção: Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Erro: As senhas não conferem.');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            alert('Atenção: Por favor, insira um e-mail válido (ex: usuaria@dominio.com).');
            return;
        }
        
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                nome: name,
                telefone: phone,
                email: email
            });

            setModalVisible(true); 
            
        } catch (error) {
            console.error("Erro no cadastro:", error.code, error.message);
            if (error.code === 'auth/email-already-in-use') {
                alert('Erro: Este e-mail já está em uso.');
            } else if (error.code === 'auth/weak-password') {
                alert('Erro: A senha deve ter pelo menos 6 caracteres.');
            } else {
                alert("Erro ao cadastrar. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.replace('/'); 
    };

    const mainColor = '#6a0a25'; 
    const secondaryColor = '#d9c7d0'; 

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 2. ESTRUTURA RESPONSIVA: Envolve tudo com KeyboardAvoidingView e ScrollView */}
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
                        
                        <View style={[styles.iconContainer, { marginTop: 20 }]}>
                            <Svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                            </Svg>
                        </View>

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

                        {/* Senha */}
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

                        <Text style={styles.passwordHelper}>
                            A senha deve ter pelo menos 6 caracteres.
                        </Text>

                        {/* Confirmar Senha */}
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
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity 
                                style={styles.eyeIcon} 
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </TouchableOpacity>
                        </View>

                        {/* Botão de Cadastro */}
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: mainColor }]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>

                        {/* Link para Login */}
                        <TouchableOpacity 
                            style={styles.loginLink}
                            onPress={navigateToLogin}
                        >
                            <Text style={styles.loginLinkText}>Login</Text>
                        </TouchableOpacity>

                        {/* 3. Rodapé movido para o fluxo normal (Relativo) */}
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.footerText}>
                                Atenção! O aplicativo SheSafe é exclusivamente destinado às mulheres. Saiba mais sobre o SheSafe nas redes sociais. 
                            </Text>
                            <Text style={styles.footerHandle}>@SheSafe</Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Pop-up de Sucesso */}
            <SuccessModal 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                router={router}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', 
    },
    // Estilo para o ScrollView garantir que o conteúdo fique centralizado se houver espaço
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        // Removemos flex: 1 para o scroll funcionar corretamente
        alignItems: 'center',
        backgroundColor: '#fff', 
        paddingHorizontal: 30, 
        paddingBottom: 20, 
        width: '100%',
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
        padding: 10, 
        height: '100%', 
        justifyContent: 'center',
    },
    passwordHelper: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center', 
        width: '100%',
        marginTop: -5, 
        marginBottom: 10, 
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
    loginLink: {
        marginTop: 20,
        marginBottom: 20,
    },
    loginLinkText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    // Rodapé agora é relativo (flui com a lista)
    footerTextContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
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
        zIndex: 1000, 
    },
    modalContent: {
        alignItems: 'center',
        marginTop: 40, 
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