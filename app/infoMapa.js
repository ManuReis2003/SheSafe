import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Tela para adicionar informações sobre a segurança de um local no mapa
export default function InfoMapaScreen() {
    // Inicializa o roteador para navegação
    const router = useRouter(); 
    // Estado para armazenar o texto digitado pela usuária
    const [infoText, setInfoText] = useState('');

    const mainColor = '#6a0a25'; // Cor principal do SheSafe (marrom escuro)
    const secondaryColor = '#d9c7d0'; // Cor do input (cinza/rosa claro)
    const inactiveIconColor = '#888'; // Cor dos ícones inativos no rodapé
    
    // --- FUNÇÃO DE SALVAMENTO ---
    const handleSave = () => {
        if (!infoText.trim()) {
            alert('Por favor, adicione uma informação antes de salvar.');
            return;
        }

        console.log('Informação a ser salva:', infoText);

        // =========================================================
        // === INÍCIO DO ESPAÇO PARA INTEGRAÇÃO COM FIREBASE/DB ===
        // =========================================================
        
        // Nesta área, você irá integrar a lógica para:
        // 1. Obter a localização atual ou a localização do ponto no mapa.
        // 2. Chamar uma função do Firebase Firestore (ex: addDoc) para salvar:
        //    - userId (ID da usuária logada)
        //    - text (o conteúdo de 'infoText')
        //    - location (Latitude e Longitude)
        //    - timestamp (Data e hora do registro)

        // Exemplo de como ficaria a chamada (usando a estrutura SafeSpots que discutimos):
        /*
        try {
            await addDoc(collection(db, "safeSpots"), {
                userId: auth.currentUser.uid,
                text: infoText,
                location: { lat: 0, lng: 0 }, // Substituir por localização real
                timestamp: serverTimestamp()
            });
            alert('Informação salva com sucesso!');
            router.back(); // Volta para a tela anterior (o mapa)
        } catch (error) {
            console.error("Erro ao salvar no banco de dados:", error);
            alert('Falha ao salvar. Tente novamente.');
        }
        */

        // =======================================================
        // === FIM DO ESPAÇO PARA INTEGRAÇÃO COM FIREBASE/DB ===
        // =======================================================

        // Simulação de sucesso
        alert('Informação salva com sucesso (Simulação).');
        setInfoText(''); // Limpa o campo após o salvamento simulado
        // router.back(); 
    };
    // --- FIM DA FUNÇÃO DE SALVAMENTO ---


    // Componente do Menu de Navegação Inferior (Rodapé)
    const FooterNav = () => {
        return (
            <View style={styles.footerNavContainer}>
                {/* Ícone Home - Inativo */}
                <TouchableOpacity onPress={() => router.push('/home')} style={styles.navItem}>
                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={inactiveIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><Path d="M9 22V12h6v10"/>
                    </Svg>
                </TouchableOpacity>

                {/* Ícone Perfil - Inativo */}
                <TouchableOpacity onPress={() => {}} style={styles.navItem}>
                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={inactiveIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><Circle cx="12" cy="7" r="4"/>
                    </Svg>
                </TouchableOpacity>

                {/* Ícone Cadeado - Inativo */}
                <TouchableOpacity onPress={() => {}} style={styles.navItem}>
                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={inactiveIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                    </Svg>
                </TouchableOpacity>

                {/* Ícone Mapa - ATIVO (Cor principal) */}
                <TouchableOpacity onPress={() => {}} style={styles.navItem}>
                    <Svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 21.7c-3.1 0-5.7-2.5-5.7-5.7 0-3.4 5.7-11.4 5.7-11.4S17.7 12.6 17.7 16c0 3.1-2.5 5.7-5.7 5.7z"/><Circle cx="12" cy="16" r="3"/>
                    </Svg>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* --- CABEÇALHO --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        {/* Ícone Menu (3 Barras) - Usando Path para desenho */}
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M3 12h18M3 6h18M3 18h18"/>
                        </Svg>
                    </TouchableOpacity>
                    {/* Ícone Notificação (Sino) */}
                    <TouchableOpacity onPress={() => {}}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><Path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </Svg>
                    </TouchableOpacity>
                </View>

                {/* --- ÍCONE E TÍTULO --- */}
                <View style={styles.logoContainer}>
                    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 2C9.243 2 7 4.243 7 7v3h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                    </Svg>
                    <Text style={styles.title}>Mapa</Text>
                </View>

                {/* --- INPUT DE INFORMAÇÃO --- */}
                <Text style={styles.instructionText}>
                    Adicione informações sobre a segurança deste local:
                </Text>

                <TextInput
                    style={styles.inputArea}
                    placeholder="Sua informação sobre o local (ex: iluminação, movimento, perigo)"
                    placeholderTextColor="#a0a0a0"
                    multiline
                    numberOfLines={4}
                    value={infoText}
                    onChangeText={setInfoText}
                    textAlignVertical="top" // Garante que o texto comece no topo
                />

                {/* --- BOTÃO SALVAR --- */}
                <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: mainColor }]}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                {/* Adiciona padding na parte inferior para que o rodapé não cubra o botão */}
                <View style={{ height: 100 }} /> 

            </View>
            
            {/* --- RODAPÉ DE NAVEGAÇÃO --- */}
            <FooterNav />
        </SafeAreaView>
    );
}

// LOCAL ONDE FIZ A ALTERAÇÃO APÓS TOMAR O ERRO 

// Variável de cor do texto do botão (usada no StyleSheet)
const buttonTextColor = '#fff';


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', 
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff', 
        paddingHorizontal: 30, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    logoContainer: {
        alignItems: 'center', 
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    instructionText: {
        width: '100%',
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
        fontWeight: '500',
        textAlign: 'left',
    },
    inputArea: {
        width: '100%',
        height: 150, // Altura fixa para o retângulo
        padding: 15,
        backgroundColor: '#e5e5e5', // Cor cinza do protótipo
        borderRadius: 15, 
        fontSize: 16,
        color: '#333',
        borderColor: '#6a0a25', // Borda sutil na cor principal
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 30,
    },
    saveButton: {
        width: '80%', 
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5.46,
        elevation: 10,
    },
    buttonText: {
        color: buttonTextColor,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerNavContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80, 
        backgroundColor: '#fff', 
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Ajuste para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 10,
        borderRadius: 25,
    },
    navItem: {
        padding: 10,
    }
});
