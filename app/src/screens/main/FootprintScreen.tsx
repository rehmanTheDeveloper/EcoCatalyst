import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FootprintScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carbon Footprint</Text>
        <Text style={styles.subtitle}>Track your environmental impact</Text>
      </View>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Carbon Footprint</Text>
        <Text style={styles.summaryValue}>2.3 tons CO₂e</Text>
        <Text style={styles.summaryDescription}>15% below average</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '65%' }]} />
        </View>
        <Text style={styles.progressText}>Goal: 2.0 tons CO₂e</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breakdown</Text>
        
        <View style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Food</Text>
            <Text style={styles.categoryValue}>0.8 tons</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '35%', backgroundColor: '#4CAF50' }]} />
          </View>
        </View>
        
        <View style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Transportation</Text>
            <Text style={styles.categoryValue}>1.2 tons</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '52%', backgroundColor: '#FF9800' }]} />
          </View>
        </View>
        
        <View style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Home Energy</Text>
            <Text style={styles.categoryValue}>0.3 tons</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '13%', backgroundColor: '#2196F3' }]} />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips to Reduce</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Eat more plant-based meals</Text>
          <Text style={styles.tipDescription}>Reducing meat consumption by 50% can lower your food carbon footprint by up to 40%.</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Use public transportation</Text>
          <Text style={styles.tipDescription}>Taking the bus instead of driving can reduce your transportation emissions by up to 60%.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  summaryCard: {
    margin: 15,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  summaryDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  section: {
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default FootprintScreen;
