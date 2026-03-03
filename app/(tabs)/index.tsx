import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

// Correct path to TME logo (matches your folder structure)
import logo from "../../assets/TME.logo.png";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>
        
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#fff" },
  logo: { 
    width: 840, 
    height: 840, 
    marginBottom: 100, 
    resizeMode: "cover" },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#333" }
});








// Main Menu; Home Screen; Where you will see just logo 
