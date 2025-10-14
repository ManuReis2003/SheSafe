import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Tela de Recuperação de Senha
export default function RecuperacaoSenhaScreen() {
    const router = useRouter(); 
    
    // Estados para armazenar as senhas
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mainColor = '#6a0a25'; // Cor principal do SheSafe
    const secondaryColor = '#d9c7d0'; // Cor dos campos de input

    // Função que será chamada ao clicar em 'Confirmar'
    const handleConfirmation = () => {
        // --- INÍCIO DA INTEGRAÇÃO COM FIREBASE AUTH ---
        
        // Aqui deve entrar a lógica real do Firebase para:
        // 1. Reautenticar o usuário com a senha antiga (oldPassword).
        // 2. Chamar a função 'updatePassword' com a senha nova (newPassword).
        
        if (newPassword !== confirmPassword) {
            alert('Atenção: A nova senha e a confirmação não coincidem.');
            return;
        }

        // SIMULAÇÃO: Se for bem-sucedido, volta para a tela de Login
        alert('Senha atualizada com sucesso!');
        router.replace('/'); 

        // --- FIM DA INTEGRAÇÃO COM FIREBASE AUTH ---
    };
    
    // Configuração de cores e ícones (mantida do login/cadastro)
    const logoContainerStyle = {
        alignItems: 'center', 
        marginBottom: 40,
        marginTop: 40,
    };
    const logoTextStyle = {
        fontSize: 30, 
        fontWeight: '600',
        color: mainColor, 
        marginTop: 5,
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Cabeçalho SheSafe (Ícone e Título) */}
                <View style={logoContainerStyle}>
                    <Svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                    </Svg>
                    <Text style={logoTextStyle}>SheSafe</Text>
                </View>

                {/* Título da Tela */}
                <Text style={styles.screenTitle}>Recuperação de senha</Text>
                <View style={styles.divider} />
                
                {/* Campo Senha Antiga */}
                <Text style={styles.inputLabel}>Senha antiga:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder=" "
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                />

                {/* Campo Nova Senha */}
                <Text style={styles.inputLabel}>Senha nova:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder=" "
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                {/* Campo Confirmação de Senha */}
                <Text style={styles.inputLabel}>Confirme sua senha:</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: secondaryColor }]}
                    placeholder=" "
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {/* Botão Confirmar */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: mainColor }]}
                    onPress={handleConfirmation}
                >
                    <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>

                {/* Rodapé (Mantido o mesmo que no Login) */}
                <View style={styles.footerTextContainer}>
                    <Text style={styles.footerText}>
                        Atenção! O aplicativo SheSafe é exclusivamente destinado às mulheres. Saiba mais sobre o SheSafe nas redes sociais. 
                    </Text>
                    <Text style={styles.footerHandle}>@SheSafe</Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

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
        paddingBottom: 150, // Garante que o rodapé não seja cortado
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
    inputLabel: {
        width: '100%',
        textAlign: 'left',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30, 
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
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
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
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
