import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDiet } from '../../contexts/diet/DietContext';

const DietScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const { chatHistory, sendChatMessage, isLoading, clearChatHistory } = useDiet();
  
  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    await sendChatMessage(message);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EcoDiet Assistant</Text>
        <Text style={styles.subtitle}>AI-powered sustainable diet planning</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearChatHistory}>
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageBubble, 
              msg.sender === 'user' ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
        {chatHistory.length === 0 && (
          <View style={styles.welcomeMessage}>
            <Text style={styles.welcomeText}>
              Hello! I'm your EcoDiet assistant. How can I help you with sustainable food choices today?
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about sustainable food choices..."
          placeholderTextColor="#999"
          multiline
          editable={!isLoading}
        />
        {isLoading ? (
          <View style={styles.sendButton}>
            <ActivityIndicator color="white" size="small" />
          </View>
        ) : (
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  clearButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 5,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#E1F5FE',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  welcomeMessage: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DietScreen;
