// Importações necessárias do React e React Native
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Importamos o PROVIDER_GOOGLE e os componentes de Mapa
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// *** BIBLIOTECA DE LOCALIZAÇÃO ***
import * as Location from 'expo-location';

// Importações do Firebase (Reintegradas para garantir o funcionamento do banco)
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// O Svg nos permite desenhar os ícones diretamente no código
import Svg, { Line, Path } from 'react-native-svg';

import { useRouter } from "expo-router";


// --- COMPONENTES DE ÍCONES (SVG) ---
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
const SmallLockIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5z" />
    </Svg>
);
const LocationIcon = ({ focused }) => (
    <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
        <Path d="M12 10a3 3 0 100-6 3 3 0 000 6z" />
    </Svg>
);
const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 28 24" fill="none" stroke="black" strokeWidth="1">
        <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
        <Path d="M12 12v3" />
        <Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
    </Svg>
);
const PlusIcon = () => (
    <Svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <Line x1="12" y1="5" x2="12" y2="19" />
        <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
);

// --- COMPONENTE PRINCIPAL DA TELA DE MAPA ---
export default function TelaMapa() {
    // UI States
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [infoLocal, setInfoLocal] = useState('');
    const [localSelecionado, setLocalSelecionado] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const toastTimer = useRef(null);

    // Data States
    const [marcadores, setMarcadores] = useState([]);
    
    // *** LOCATION STATES ***
    // userLocation: guarda a região (lat, long, zoom) onde a usuária está
    const [userLocation, setUserLocation] = useState(null);
    // errorMsg: caso a usuária negue a permissão
    const [errorMsg, setErrorMsg] = useState(null);
    // isLoading: controla a tela de carregamento enquanto buscamos o GPS
    const [isLoading, setIsLoading] = useState(true);

    // --- EFEITO 1: Busca a Localização Inicial ---
    useEffect(() => {
        (async () => {
            try {
                // 1. Solicita permissão de uso do GPS
                let { status } = await Location.requestForegroundPermissionsAsync();
                
                if (status !== 'granted') {
                    setErrorMsg('Permissão de acesso à localização foi negada.');
                    Alert.alert("Permissão necessária", "Para ver o mapa na sua região, precisamos acesso à localização.");
                    // Se negar, define uma localização padrão (Ex: Centro de SP) para não quebrar o app
                    setUserLocation({
                        latitude: -23.550520,
                        longitude: -46.633308,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                    setIsLoading(false);
                    return;
                }

                // 2. Obtém a posição atual com alta precisão
                let location = await Location.getCurrentPositionAsync({});
                
                // 3. Define a região inicial do mapa
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    // Deltas menores = Zoom mais próximo (nível de rua)
                    latitudeDelta: 0.005, 
                    longitudeDelta: 0.005,
                });
            } catch (error) {
                console.error("Erro ao obter localização:", error);
                Alert.alert("Erro", "Não foi possível obter sua localização.");
            } finally {
                // Remove a tela de carregamento
                setIsLoading(false);
            }
        })();
    }, []);

    // --- EFEITO 2: Conexão com Firebase (Snapshot em tempo real) ---
    useEffect(() => {
        // Verifica autenticação
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Lógica de fallback se não estiver logada (opcional)
            }
        });

        // Conecta na coleção safeSpots
        const q = query(collection(db, "safeSpots"));
        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
            const marcadoresList = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                marcadoresList.push({
                    id: doc.id,
                    ...data // Espalha coordinate, title, description
                });
            });
            setMarcadores(marcadoresList);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFirestore();
        };
    }, []);

    // Função de clique no mapa
    const handleMapPress = (e) => {
        const { coordinate } = e.nativeEvent;
        setLocalSelecionado(coordinate);
    };

    // Função para salvar no Firebase
    const handleSalvarInfo = async () => {
        if (infoLocal.trim().length === 0) {
            Alert.alert("Atenção", "Por favor, escreva alguma informação antes de salvar.");
            return;
        }
        if (!localSelecionado) {
            Alert.alert("Atenção", "Selecione um local no mapa.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Erro", "Você precisa estar logada.");
            return;
        }

        const novoMarcador = {
            coordinate: localSelecionado,
            title: "Informação da Comunidade",
            description: infoLocal,
            createdAt: new Date(),
            userId: user.uid
        };

        try {
            // Salva na coleção safeSpots
            await addDoc(collection(db, "safeSpots"), novoMarcador);
            
            setModalVisible(false);
            setInfoLocal('');
            setLocalSelecionado(null);
            Alert.alert("Sucesso", "Informação salva e compartilhada!");
        } catch (e) {
            console.error("Erro ao salvar:", e);
            Alert.alert("Erro", "Falha ao salvar no banco de dados.");
        }
    };

    const handleFecharModal = () => {
        setModalVisible(false);
        setInfoLocal('');
        setLocalSelecionado(null);
    }

    const handleAddButtonPress = () => {
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }
        if (localSelecionado) {
            setModalVisible(true);
        } else {
            setToastVisible(true);
            toastTimer.current = setTimeout(() => {
                setToastVisible(false);
            }, 3000);
        }
    };

    // --- RENDERIZAÇÃO ---
    
    // Se estiver carregando o GPS, mostra tela de loading
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7C1B32" />
                <Text style={styles.loadingText}>Buscando sua localização...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleFecharModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Adicione informações sobre a segurança deste local:</Text>
                        <TextInput
                            style={styles.modalInput}
                            multiline
                            numberOfLines={4}
                            maxLength={50}
                            onChangeText={setInfoLocal}
                            value={infoLocal}
                            placeholder="Ex: Rua bem iluminada, local seguro..."
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleSalvarInfo}>
                            <Text style={styles.modalButtonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={handleFecharModal}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <LockIcon />
                <Text style={styles.headerTitle}>Mapa</Text>
            </View>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                // Usa a localização obtida do GPS
                initialRegion={userLocation}
                // Ativa a bolinha azul pulsante da localização da usuária
                showsUserLocation={true}
                // Adiciona botão para recentralizar na usuária
                showsMyLocationButton={true}
                onPress={handleMapPress}
            >
                {marcadores.map(marcador => (
                    <Marker
                        key={marcador.id}
                        coordinate={marcador.coordinate}
                        title={marcador.title}
                        description={marcador.description}
                        pinColor="red"
                        onCalloutPress={() => Alert.alert(marcador.title, marcador.description)}
                    />
                ))}

                {localSelecionado && (
                    <Marker
                        coordinate={localSelecionado}
                        pinColor="blue"
                        title="Novo Ponto de Informação"
                        description="Clique no botão abaixo para adicionar detalhes"
                    />
                )}
            </MapView>
            
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddButtonPress}
            >
                <PlusIcon />
                <Text style={styles.addButtonText}>Adicionar informação sobre a localidade</Text>
            </TouchableOpacity>

            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={() => router.push('/telaPrincipal')}>
                    <HomeIcon />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={() => router.push('/contatos')}>
                        <UserIcon />
                </TouchableOpacity>
                

                <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar */ }}>
                    <LocationIcon focused={true} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={toastVisible}
                onRequestClose={() => setToastVisible(false)}
            >
                <View style={styles.toastOverlay}>
                    <View style={styles.toastContainer}>
                        <Text style={styles.toastText}>
                            Por favor, toque no mapa primeiro para selecionar um local.
                        </Text>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Estilos de Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    loadingText: {
        marginTop: 10,
        color: '#7C1B32',
        fontWeight: 'bold'
    },
    header: {
        alignItems: 'center',
        paddingVertical: 26,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: '600',
        marginTop: -8,
    },
    map: {
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: -10,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        height: 100,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#7C1B32',
        borderRadius: 15,
        padding: 12,
        elevation: 2,
        width: '100%',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: '#555',
    },
    toastOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 30,
    },
    toastContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 10,
    },
    toastText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});