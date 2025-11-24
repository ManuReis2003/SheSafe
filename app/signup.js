import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg'; // Adicionado 'Line' para o ícone EyeOff

// ================================================================
// 1. IMPORTAR AS FUNÇÕES DO FIREBASECONFIG.JS
// ================================================================
import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from '../firebaseConfig';
// ================================================================


// ================================================================
// 2. ÍCONES DE VISIBILIDADE DE SENHA (NOVOS)
// ================================================================
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
// ================================================================


// Componente do Pop-up de Sucesso (mantido o mesmo)
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

// Este é o componente da tela de Cadastro (Signup)
export default function SignupScreen() {
    const router = useRouter(); 

    // Estados para armazenar os dados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    
    // ================================================================
    // 3. NOVOS ESTADOS PARA CONFIRMAÇÃO E VISIBILIDADE
    // ================================================================
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // ================================================================

    const [modalVisible, setModalVisible] = useState(false); 
    const [loading, setLoading] = useState(false); 

    // Função que será chamada quando o botão "Cadastrar" for pressionado
    const handleSignup = async () => {
        // ================================================================
        // 4. ATUALIZAÇÃO DA VALIDAÇÃO
        // ================================================================
        // Validação básica (incluindo o novo campo)
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Atenção: Por favor, preencha todos os campos.');
            return;
        }

        // Validação de Senha (verificar se são iguais)
        if (password !== confirmPassword) {
            alert('Erro: As senhas não conferem.');
            return;
        }

        // Validação de E-mail
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            alert('Atenção: Por favor, insira um e-mail válido (ex: usuaria@dominio.com).');
            return;
        }
        
        // ================================================================

        
        setLoading(true);

        try {
            // 1. Crie o usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Salve os dados adicionais no Firestore (usando campos em português)
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
            <View style={styles.container}>
                
                <View style={[styles.iconContainer, { marginTop: 40 }]}>
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
                
                {/* Campo Senha com Ícone */}
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: secondaryColor, 
                                textAlign: 'left', 
                                paddingLeft: 20, 
                                paddingRight: 60, 
                                marginVertical: 0 
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

                {/* Texto de Ajuda (Novo) */}
                <Text style={styles.passwordHelper}>
                    A senha deve ter pelo menos 6 caracteres.
                </Text>

                {/* Campo Confirmar Senha com Ícone (Novo) */}
                <View style={styles.passwordWrapper}>
                    <TextInput
                        style={[
                            styles.input, 
                            { 
                                backgroundColor: secondaryColor, 
                                textAlign: 'left', 
                                paddingLeft: 20, 
                                paddingRight: 60,
                                marginVertical: 0 
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

                {/* ================================================================ */}
                {/* CORREÇÃO DO RODAPÉ (REMOVIDO POSITION ABSOLUTE) */}
                {/* ================================================================ */}
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>
                        Atenção! O aplicativo SheSafe é exclusivamente destinado às mulheres. Saiba mais sobre o SheSafe nas redes sociais. 
                    </Text>
                    <Text style={styles.footerHandle}>@SheSafe</Text>
                </View>
                {/* ================================================================ */}

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

// Estilos de Componentes
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', 
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff', 
        paddingHorizontal: 30, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20, 
        // PaddingBottom aumentado para garantir espaço para o rodapé em fluxo normal
        paddingBottom: 40, 
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
        marginVertical: 10, // Mantém a margem para os inputs normais
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
        textAlign: 'left',
        width: '100%',
        paddingLeft: 10, 
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
        // marginBottom diminuído para dar espaço ao rodapé
        marginBottom: 20, 
    },
    loginLinkText: {
        color: '#6a0a25',
        fontSize: 18,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    // ================================================================
    // ESTILO DO RODAPÉ CORRIGIDO
    // ================================================================
    footerTextContainer: {
        // position: 'absolute', // REMOVIDO
        // bottom: 20,          // REMOVIDO
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        // Adiciona margem para separá-lo do link de Login
        marginTop: 10, 
    },
    // ================================================================
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
    // Estilos do Modal (Sem alterações)
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