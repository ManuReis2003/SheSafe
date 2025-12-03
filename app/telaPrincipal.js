import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Linking, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// Importação do pacote de localização
import * as Location from 'expo-location';

// 🔧 CORREÇÃO DE IMPORTAÇÃO: O hook costuma estar no arquivo contatos.js
import { useContatos } from './useContatos'; 


// --------------------------------------
// ÍCONES SVG
// --------------------------------------
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

const LocationIcon = ({ focused }) => (
  <Svg height="28" width="28" viewBox="0 0 24 24" fill="none" stroke={focused ? "#7C1B32" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
    <Path d="M12 10a3 3 0 100-6 3 3 0 000 6z" />
  </Svg>
);

// --------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------
export default function TelaPrincipal() {
  const router = useRouter();
  const contatos = useContatos();
  
  // Estado para mostrar carregamento enquanto busca o GPS
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO PARA PEGAR LOCALIZAÇÃO ---
  const obterLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da sua localização para enviar o alerta.');
      return null;
    }

    try {
      // Pega a posição atual (precisão alta)
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      return location.coords;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
      return null;
    }
  };

  // --- FUNÇÃO DE ENVIO ---
  const enviarWhatsappParaContatos = async (mensagemBase, incluirLocalizacao = false) => {
    if (!contatos || contatos.length === 0) {
      Alert.alert("Atenção", "Não existem contatos de confiança na sua lista, favor adicionar.");
      router.push('/contatos');
      return;
    }

    setLoading(true); // Inicia loading

    let mensagemFinal = mensagemBase;

    // Se for para incluir localização, busca o GPS
    if (incluirLocalizacao) {
        const coords = await obterLocalizacao();
        if (coords) {
            // Cria um link do Google Maps
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
            mensagemFinal += `\n\nMinha localização atual:\n${mapLink}`;
        }
    }

    // Envia para cada contato
    // Nota: O WhatsApp só consegue abrir um chat por vez. 
    // Se tiver muitos contatos, o ideal seria criar um grupo ou usar SMS.
    // Aqui, ele tentará abrir o último ou criar uma sequência.
    for (const contato of contatos) {
      const telefone = contato.telefone.replace(/\D/g, ""); 
      const url = `whatsapp://send?phone=55${telefone}&text=${encodeURIComponent(mensagemFinal)}`;
      
      // Pequeno delay para garantir que o sistema processe
      await Linking.openURL(url).catch(() => {
        Alert.alert("Erro", `Não foi possível abrir o WhatsApp para ${contato.nome}.`);
      });
    }

    setLoading(false); // Para loading
  };

  // --------------------------------------
  // Funções dos botões
  // --------------------------------------
  const handleEmergencia = () => {
    // Emergência sempre envia localização
    enviarWhatsappParaContatos("🚨 EMERGÊNCIA! Preciso de ajuda IMEDIATA! Por favor, entre em contato comigo.", true);
  };

  const handleRisco = () => {
    enviarWhatsappParaContatos("⚠️ Estou em uma situação de RISCO. Fique atento, por favor.", true);
  };

  const handleAcompanhamento = () => {
    // Acompanhe-me foca na localização
    enviarWhatsappParaContatos("👣 Preciso que você me acompanhe. Aqui está minha localização:", true);
  };

  // --------------------------------------
  // RENDERIZAÇÃO DA TELA
  // --------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Loading Overlay (aparece quando está buscando GPS) */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C1B32" />
          <Text style={{marginTop: 10}}>Buscando localização...</Text>
        </View>
      )}

      <View style={styles.mainContent}>

        <View style={styles.logoContainer}>
          <LockIcon />
          <Text style={styles.appName}>SheSafe</Text>
        </View>

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

      {/* NAVBAR */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <HomeIcon focused={true} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/contatos')}>
          <UserIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/mapa')}>
          <LocationIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --------------------------------------
// ESTILOS
// --------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  appName: {
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '600',
    color: '#000',
    marginTop: 10
  },

  buttonContainer: { width: '90%' },
  button: {
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

  emergenciaButton: { backgroundColor: '#D9534F' },
  riscoButton: { backgroundColor: '#E68A48' },
  acompanheButton: { backgroundColor: '#F0D177' },

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
    elevation: 5
  },
  navButton: {
    alignItems: 'center'
  },
  // Estilo para o loading flutuante
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});