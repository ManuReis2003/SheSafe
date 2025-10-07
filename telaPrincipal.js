// Importações necessárias do React e React Native
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
// O Svg nos permite desenhar os ícones diretamente no código
import Svg, { Path } from 'react-native-svg';

// --- COMPONENTES DE ÍCONES (SVG) ---
// Para não depender de arquivos externos, desenhamos os ícones aqui.

const LockIcon = () => (
  <Svg height="60" width="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
    <Path d="M12 1.5A5.5 5.5 0 006.5 7v3.5H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V7A5.5 5.5 0 0012 1.5z" />
    <Path d="M12 12v3" />
    <Path d="M12 15a.5.5 0 100-1 .5.5 0 000 1z" fill="black" stroke="none" />
  </Svg>
);

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


// --- COMPONENTE PRINCIPAL DA TELA ---
export default function App() {

  // --- FUNÇÕES DE ALERTA ---
  // Cada botão principal chama uma dessas funções ao ser pressionado.
  // O Alert nativo do React Native não permite estilizar palavras específicas
  // (como colocar em vermelho), então usamos caixa alta para dar destaque.
  const handleEmergencia = () => {
    Alert.alert(
      "Alerta Enviado",
      "Uma notificação de EMERGÊNCIA foi enviada para seus contatos definidos."
    );
  };

  const handleRisco = () => {
    Alert.alert(
      "Alerta Enviado",
      "Uma notificação de RISCO foi enviada para seus contatos definidos."
    );
  };

  const handleAcompanhamento = () => {
    Alert.alert(
      "Alerta Enviado",
      "Uma notificação de ACOMPANHE-ME foi enviada para seus contatos definidos."
    );
  };

  // --- RENDERIZAÇÃO DA TELA ---
  return (
    // SafeAreaView garante que o conteúdo não fique sob a barra de status ou notch
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Container principal que centraliza o conteúdo */}
      <View style={styles.mainContent}>
        {/* Logo e Nome do App */}
        <View style={styles.logoContainer}>
          <LockIcon />
          <Text style={styles.appName}>SheSafe</Text>
        </View>

        {/* Container dos Botões de Ação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.emergenciaButton]} onPress={handleEmergencia}>
            <Text style={styles.buttonText}>Emergência</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.riscoButton]} onPress={handleRisco}>
            <Text style={styles.buttonText}>Estou em risco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.acompanheButton]} onPress={handleAcompanhamento}>
            <Text style={styles.buttonText}>Acompanhe-me</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Navegação Inferior */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => Alert.alert("Navegação", "Indo para a tela inicial.")}>
          <HomeIcon focused={true} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => Alert.alert("Navegação", "Indo para a tela de perfil.")}>
          <UserIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => Alert.alert("Navegação", "Indo para a tela de contatos.")}>
          <SmallLockIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => Alert.alert("Navegação", "Indo para a tela de mapa.")}>
          <LocationIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS DA TELA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco
  },
  mainContent: {
    flex: 1, // Faz com que o conteúdo principal ocupe todo o espaço disponível, empurrando o navBar para baixo
    justifyContent: 'center', // Centraliza o conteúdo (logo e botões) verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingHorizontal: 20, // Espaçamento nas laterais
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40, // Espaço entre o logo e o primeiro botão
  },
  appName: {
    fontSize: 48,
    // A fonte "Times New Roman" ou "Georgia" são boas alternativas para a fonte da imagem
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
  },
  buttonContainer: {
    width: '90%', // Define a largura do container dos botões
  },
  button: {
    paddingVertical: 18,
    borderRadius: 25, // Bordas bem arredondadas
    marginBottom: 20, // Espaço entre os botões
    alignItems: 'center', // Centraliza o texto dentro do botão
    // Sombra para dar um efeito de profundidade
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#000000', // Texto preto para melhor contraste
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Cores específicas para cada botão
  emergenciaButton: {
    backgroundColor: '#D9534F', // Vermelho
  },
  riscoButton: {
    backgroundColor: '#E68A48', // Laranja
  },
  acompanheButton: {
    backgroundColor: '#F0D177', // Amarelo
  },
  // Estilos da Barra de Navegação
  navBar: {
    flexDirection: 'row', // Alinha os ícones horizontalmente
    justifyContent: 'space-around', // Distribui os ícones com espaço igual
    backgroundColor: '#F2F2F2', // Fundo cinza claro
    marginHorizontal: 20, // Margens laterais para o efeito "flutuante"
    marginBottom: 20,
    borderRadius: 30, // Bordas arredondadas
    paddingVertical: 15, // Espaçamento vertical interno
    // Sombra para a barra de navegação
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
});

