// Importações necessárias do React e React Native
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text, // Componente para criar a pop-up
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Importamos o PROVIDER_GOOGLE e os componentes de Mapa
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// O Svg nos permite desenhar os ícones diretamente no código
import Svg, { Line, Path } from 'react-native-svg';

// --- (Ícones SVG Omitidos para Brevidade) ---
// ... (Todos os seus ícones: HomeIcon, UserIcon, SmallLockIcon, LocationIcon, LockIcon, PlusIcon) ...
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

// Ícone de cadeado principal
const LockIcon = () => (
    <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
      <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
      <Path d="M12 12v3" />
      <Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
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
    // State para controlar a visibilidade da pop-up (modal)
    const [modalVisible, setModalVisible] = useState(false);
    // State para guardar o texto que a usuária digita na pop-up
    const [infoLocal, setInfoLocal] = useState('');

    // *** NOVO STATE ***
    // Guarda a coordenada onde a usuária clicou no mapa.
    const [localSelecionado, setLocalSelecionado] = useState(null);

    // *** NOVO STATE PARA O TOAST (POP-UP TEMPORÁRIA) ***
    const [toastVisible, setToastVisible] = useState(false);
    // Guarda o timer para podermos limpar
    const toastTimer = React.useRef(null);

    // State com a lista de marcadores (alfinetes).
    // No futuro, isso virá do Firestore e será compartilhado.
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

    // *** NOVA FUNÇÃO ***
    // Chamada quando a usuária toca em qualquer lugar do mapa.
    const handleMapPress = (e) => {
        // Pega as coordenadas do evento de clique
        const { coordinate } = e.nativeEvent;
        // Salva essa coordenada no nosso state.
        setLocalSelecionado(coordinate);
    };

    // *** FUNÇÃO ATUALIZADA ***
    // Chamada ao salvar a informação da pop-up
    const handleSalvarInfo = () => {
        // Validação
        if (infoLocal.trim().length === 0) {
            Alert.alert("Atenção", "Por favor, escreva alguma informação antes de salvar.");
            return;
        }
        if (!localSelecionado) {
            Alert.alert("Atenção", "Ocorreu um erro. Tente selecionar o local no mapa novamente.");
            return;
        }

        // Cria um novo marcador (alfinete)
        const novoMarcador = {
            id: Date.now(), // ID único
            coordinate: localSelecionado, // Coordenada salva do clique
            title: "Informação da Comunidade", // Título genérico
            description: infoLocal, // Texto digitado pela usuária
        };

        // Adiciona o novo marcador à lista
        // (Futuramente, isso será um `addDoc` no Firestore)
        setMarcadores([...marcadores, novoMarcador]);

        // Limpa os states e fecha a modal
        setModalVisible(false);
        setInfoLocal('');
        setLocalSelecionado(null); // Limpa a seleção do mapa

        Alert.alert("Sucesso", "Sua informação foi adicionada ao mapa!");
    };

    // *** NOVA FUNÇÃO ***
    // Fecha a modal e limpa a seleção do mapa
    const handleFecharModal = () => {
        setModalVisible(false);
        setInfoLocal('');
        setLocalSelecionado(null);
    }

    // *** NOVA FUNÇÃO PARA O BOTÃO ADICIONAR ***
    // Verifica se pode abrir a modal ou se deve mostrar o toast
    const handleAddButtonPress = () => {
        // Limpa qualquer timer antigo
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }

        if (localSelecionado) {
            // Se um local JÁ FOI selecionado, abre a modal de input
            setModalVisible(true);
        } else {
            // Se NENHUM local foi selecionado, mostra o TOAST
            setToastVisible(true);
            // Define um timer para esconder o toast após 3 segundos
            toastTimer.current = setTimeout(() => {
                setToastVisible(false);
            }, 3000); // 3000ms = 3 segundos
        }
    };


  // --- RENDERIZAÇÃO DA TELA ---
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Pop-up (Modal) para adicionar informações */}
        <Modal
            animationType="slide"
            transparent={true} // Fundo transparente para o modal
            visible={modalVisible}
            onRequestClose={handleFecharModal} // Chamada ao fechar (ex: botão "voltar" do Android)
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Adicione informações sobre a segurança deste local:</Text>
                    <TextInput
                        style={styles.modalInput}
                        multiline // Permite múltiplas linhas
                        numberOfLines={4}
                        maxLength={50} // Limite de 50 caracteres
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

        {/* Conteúdo da tela */}
        <View style={styles.header}>
            <LockIcon />
            <Text style={styles.headerTitle}>Mapa</Text>
        </View>

        {/* Componente do Mapa */}
        <MapView
            // *** MUDANÇA IMPORTANTE ***
            // Isso força o mapa a usar a API do Google Maps.
            // Requer a Chave de API configurada no app.json (veja o guia)
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
                latitude: -23.550520,
                longitude: -46.633308,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            // *** MUDANÇA IMPORTANTE ***
            // Chama a função handleMapPress sempre que a usuária tocar no mapa
            onPress={handleMapPress}
        >
            {/* Mapeia e exibe todos os marcadores "salvos" */}
            {marcadores.map(marcador => (
                <Marker
                    key={marcador.id}
                    coordinate={marcador.coordinate}
                    title={marcador.title}
                    description={marcador.description}
                    // Permite que o pop-up do marcador seja clicado (útil no futuro)
                    onCalloutPress={() => Alert.alert(marcador.title, marcador.description)}
                />
            ))}

            {/* *** NOVO MARCADOR ***
            // Exibe um marcador temporário (azul) onde a usuária clicou,
            // ANTES de ela adicionar a informação. */}
            {localSelecionado && (
                <Marker
                    coordinate={localSelecionado}
                    pinColor="blue" // Cor diferente para indicar "seleção"
                    title="Novo Ponto de Informação"
                    description="Clique no botão abaixo para adicionar detalhes"
                />
            )}
        </MapView>
        
        {/* Botão para abrir a pop-up */}
        <TouchableOpacity
            // *** MUDANÇA IMPORTANTE ***
            // O botão não fica mais desabilitado, o estilo é sempre o mesmo
            style={styles.addButton}
            onPress={handleAddButtonPress} // Chama a nova função de verificação
        >
            <PlusIcon />
            <Text style={styles.addButtonText}>Adicionar informação sobre a localidade</Text>
        </TouchableOpacity>

        {/* Barra de Navegação Inferior */}
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar para Home */ }}>
              <HomeIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar para Perfil */ }}>
              <UserIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => { /* Navegar para Contatos */ }}>
              <SmallLockIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => { /* Já estamos aqui */ }}>
              <LocationIcon focused={true}/>
            </TouchableOpacity>
        </View>

        {/* *** NOVO COMPONENTE: TOAST (POP-UP TEMPORÁRIA) *** */}
        {/* Usamos um Modal transparente que só aparece se o toastVisible for true */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={toastVisible}
            onRequestClose={() => setToastVisible(false)}
        >
            {/* Container que centraliza o toast */}
            <View style={styles.toastOverlay}>
                {/* O conteúdo do Toast */}
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
    // *** ESTILO REMOVIDO ***
    // O estilo 'addButtonDisabled' não é mais necessário
    // addButtonDisabled: {
    //     backgroundColor: '#AAA', // Cor cinza
    // },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Estilos da Barra de Navegação
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
    // Estilos da Pop-up (Modal)
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido
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
        textAlignVertical: 'top', // Alinha o texto no topo para multiline
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
    // *** NOVOS ESTILOS PARA O TOAST ***
    toastOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Posiciona no fundo
        alignItems: 'center',
        padding: 30, // Garante que não cole nas bordas
    },
    toastContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Cor escura com transparência
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 80, // Um pouco acima da barra de navegação
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