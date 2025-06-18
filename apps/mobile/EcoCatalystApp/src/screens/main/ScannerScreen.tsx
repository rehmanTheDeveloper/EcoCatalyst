import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ScannerScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraPlaceholder}>Camera Preview</Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.scanModeContainer}>
          <TouchableOpacity style={[styles.scanModeButton, styles.activeScanMode]}>
            <Text style={styles.scanModeText}>Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanModeButton}>
            <Text style={styles.scanModeText}>Object</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.captureButton}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <Text style={styles.instructionText}>
          Point camera at a product barcode or object to scan
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  cameraPlaceholder: {
    color: 'white',
    fontSize: 18,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  scanModeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  scanModeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeScanMode: {
    backgroundColor: '#4CAF50',
  },
  scanModeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ScannerScreen;
