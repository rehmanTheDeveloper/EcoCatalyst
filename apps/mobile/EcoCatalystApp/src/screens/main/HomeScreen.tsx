import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EcoCatalyst</Text>
        <Text style={styles.subtitle}>Accelerating Green Decisions</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Carbon Footprint</Text>
          <Text style={styles.cardValue}>2.3 tons</Text>
          <Text style={styles.cardDescription}>15% below average</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Organic Tomatoes</Text>
          <Text style={styles.cardDescription}>Sustainability Score: 8.5/10</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plastic Water Bottle</Text>
          <Text style={styles.cardDescription}>Sustainability Score: 3.2/10</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Green Beginner</Text>
          <Text style={styles.cardDescription}>Completed 5 sustainable actions</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
