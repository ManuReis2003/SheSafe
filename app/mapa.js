import { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// Adicionar a importação do useRouter do Expo Router
import { useRouter } from 'expo-router';

// É NECESSÁRIO INSTALAR ESTA BIBLIOTECA PARA O MAPA FUNCIONAR
// Rode no seu terminal: npm install react-native-maps
import MapView, { Marker } from 'react-native-maps';

// O Svg nos permite desenhar os ícones diretamente no código
import Svg, { Line, Path } from 'react-native-svg';

// --- COMPONENTES DE ÍCONES (SVG) ---
// Ícones da barra de navegação, reutilizados da tela principal para consistência.
const HomeIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill={focused ? "#7C1B32" : "none"} stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <Path d="M9 22V12h6v10" />
    </Svg>
);
const UserIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <Path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </Svg>
);

const LocationIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
        <Path d="M12 10a3 3 0 100-6 3 3 0 000 6z" />
    </Svg>
);

// Ícone de cadeado principal
const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
        <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
        <Path d="M12 12v3" /><Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
    </Svg>
);

// Ícone de adição para o botão
const PlusIcon = () => (
    <Svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <Line x1="12" y1="5" x2="12" y2="19" />
        <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
);


// --- COMPONENTE PRINCIPAL DA TELA DE MAPA ---
export default function TelaMapa() {
    // ----------------------------------------------------
    // INÍCIO DA ALTERAÇÃO PARA NAVEGAÇÃO
    // ----------------------------------------------------
    // Inicializa o roteador do Expo Router
    const router = useRouter(); 
    // Removemos os states 'modalVisible' e 'infoLocal' pois a lógica foi para 'infoMapa.js'
    // ----------------------------------------------------
    // FIM DA ALTERAÇÃO PARA NAVEGAÇÃO
    // ----------------------------------------------------

    // State com uma lista de marcadores de exemplo.
    // No futuro, isso virá do banco de dados (Firestore).
    const [marcadores, setMarcadores] = useState([
        {
            id: 1,
            coordinate: { latitude: -23.550520, longitude: -46.633308 },
            title: 'Local Seguro',
            description: 'Posto policial com movimento 24h. Bem iluminado.'
        },
        {
            id: 2,
            coordinate: { latitude: -23.5613, longitude: -46.6565 },
            title: 'Atenção neste local',
            description: 'Rua um pouco escura à noite, melhor evitar passar sozinha.'
        }
    ]);

    // A função handleSalvarInfo e o Modal foram removidos, pois a lógica está em infoMapa.js
    
    // Função para simular a navegação (caso seja necessária em outro lugar)
    const handleSalvarInfo = () => {
        Alert.alert("Atenção", "Esta função foi movida para a tela Info Mapa.");
    };


    // --- RENDERIZAÇÃO DA TELA ---
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* O Modal foi removido daqui */}

            {/* Conteúdo da tela */}
            <View style={styles.header}>
                <LockIcon />
                <Text style={styles.headerTitle}>Mapa</Text>
            </View>

            {/* Componente do Mapa */}
            <MapView
                style={styles.map}
                // Região inicial do mapa (ex: centro de São Paulo)
                initialRegion={{
                    latitude: -23.550520,
                    longitude: -46.633308,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Mapeia e exibe todos os marcadores da nossa lista */}
                {marcadores.map(marcador => (
                    <Marker
                        key={marcador.id}
                        coordinate={marcador.coordinate}
                        title={marcador.title}
                        description={marcador.description}
                        onCalloutPress={() => Alert.alert(marcador.title, marcador.description)}
                    />
                ))}
            </MapView>
            
            {/* Botão para abrir a tela de Adicionar Informação */}
            {/* ---------------------------------------------------- */}
            {/* INÍCIO DA ALTERAÇÃO (Substitui setModalVisible) */}
            {/* ---------------------------------------------------- */}
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => router.push('/infoMapa')} // Navega para a rota infoMapa.js
            >
                <PlusIcon />
                <Text style={styles.addButtonText}>Adicionar informação sobre a localidade</Text>
            </TouchableOpacity>
            {/* ---------------------------------------------------- */}
            {/* FIM DA ALTERAÇÃO */}
            {/* ---------------------------------------------------- */}

            {/* Barra de Navegação Inferior */}
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar para Home */ }}>
                    <HomeIcon />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar para Contatos */ }}>
                    <UserIcon />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => { /* Já estamos aqui */ }}>
                    <LocationIcon focused={true}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// --- ESTILOS DA TELA ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
        marginTop: 5,
    },
    map: {
        flex: 1, // Faz o mapa ocupar o espaço disponível
        marginHorizontal: 15,
        borderRadius: 20,
        overflow: 'hidden', // Garante que as bordas arredondadas sejam aplicadas
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#7C1B32',
        margin: 20,
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Estilos da Barra de Navegação (idênticos ao da Tela Principal)
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F2F2F2',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 30,
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    navButton: {
        alignItems: 'center',
    },
    // Estilos da Pop-up (Modal) foram removidos pois a funcionalidade foi movida
    modalContainer: {
        // ... Estilos removidos
    },
    modalView: {
        // ... Estilos removidos
    },
    modalTitle: {
        // ... Estilos removidos
    },
    modalInput: {
        // ... Estilos removidos
    },
    modalButton: {
        // ... Estilos removidos
    },
    modalButtonText: {
        // ... Estilos removidos
    },
    closeButton: {
        // ... Estilos removidos
    },
    closeButtonText: {
        // ... Estilos removidos
    }
});
