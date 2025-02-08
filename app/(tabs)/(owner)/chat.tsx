import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { responsive } from '@/globals/globals';

interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '2',
      text: 'صباح الخير',
      isSender: true,
      timestamp: new Date('2024-01-24T08:21:00'),
    },
    {
      id: '3',
      text: 'مرحبا 👋 متى تصل إلى مكاني',
      isSender: false,
      timestamp: new Date('2024-01-24T08:22:00'),
    },
    {
      id: '4',
      text: 'سأكون هناك في حدود الساعة 10:30 صباحاً... يرجى الاستعداد',
      isSender: true,
      timestamp: new Date('2024-01-24T08:23:00'),
    },
    {
      id: '5',
      text: 'حسنا. سأكون هناك في الوقت المحدد',
      isSender: false,
      timestamp: new Date('2024-01-24T08:24:00'),
    },
  ]);

    const handleSend = () => {
        if (message.trim()) {
        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            isSender: true,
            timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
        setMessage('');
        }
    };

    const { width, height } = useWindowDimensions()
    const getStyles = (width: number, height: number) =>
        StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            direction: 'rtl',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 15,
            paddingTop: 32,
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        headerInfo: {
            alignItems: 'flex-start',
            marginRight: 10,
        },
        headerName: {
            fontSize: 18,
        },
        headerStatus: {
            fontSize: 12,
            color: '#666',
        },
        profileImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        messagesContainer: {
            flex: 1,
            padding: 16,
        },
        messageWrapper: {
            marginVertical: 5,
            flexDirection: 'row',
            gap: 10,
            width:'100%',
        },
        senderWrapper: {
            alignSelf: 'flex-start',
        },
        receiverWrapper: {
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        messageBubble: {
            padding: 12,
            borderRadius: 20,
            maxWidth: responsive(width, 280, 320, 500),  
        },
        senderBubble: {
            backgroundColor: '#EE50FF',
            borderBottomLeftRadius: 5,
        },
        receiverBubble: {
            backgroundColor: '#f0f0f0',
            borderBottomRightRadius: 5,
        },
        messageText: {
            fontSize: 16,
            lineHeight: 25,
        },
        senderText: {
            color: '#fff',
        },
        receiverText: {
            color: '#000',
        },
        warningMessage: {
            backgroundColor: '#FFF0F0',
            width: '100%',
            padding: 15,
            borderRadius: 10,
            marginVertical: 10,
        },
        warningText: {
            color: '#E24A4A',
            textAlign: 'center',
            fontSize: 14,
        },
        messageAvatar: {
            width: 30,
            height: 30,
            borderRadius: 15,
            marginLeft: 5,
        },
        inputContainer: {
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            borderTopWidth: 1,
            gap: 12,
            borderTopColor: '#eee',
            paddingBottom: 24
        },
        input: {
            flex: 1,
            backgroundColor: '#f8f8f8',
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            fontSize: 16,
            fontFamily: 'NotoKufiArabic_400Regular'
        },
        sendButton: {
            backgroundColor: '#EE50FF',
            width: 45,
            height: 45,
            borderRadius: 22.5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        });

    const styles = getStyles(width, height)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-forward" size={24} color="#000" />
            <Image
            source={require('@/assets/images/man.jpg')}
            style={styles.profileImage}
            />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} bold>الاسم</Text>
          <Text style={styles.headerStatus}>آخر ظهور من 12 دقيقيه</Text>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer}>
        <View style={styles.warningMessage}>
            <Text style={styles.warningText}>غير مسموح بإرسال أي طريقه تواصل أخري إلا عن طريق تطبيق المضيف</Text>
        </View>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.isSender ? styles.senderWrapper : styles.receiverWrapper,
            ]}
          >

            {msg.id !== '1' && (
              <View
                style={[
                  styles.messageBubble,
                  msg.isSender ? styles.senderBubble : styles.receiverBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.isSender ? styles.senderText : styles.receiverText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            )}
            {!msg.isSender && msg.id !== '1' && (
              <Image
                source={require('@/assets/images/man.jpg')}
                style={styles.messageAvatar}
              />
            )}

          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالة..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlign="right"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;