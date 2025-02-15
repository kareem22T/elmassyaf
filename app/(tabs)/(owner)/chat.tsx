import React, { useEffect, useState } from 'react';
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
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchMessages, markMessagesAsSeen, sendMessage } from '@/redux/chatSlice';
import { useRoute } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState('');
      const dispatch = useDispatch<AppDispatch>();
      const messages = useSelector((state : RootState) => state.chat.messages)
      const chats = useSelector((state : RootState) => state.chat.chats)
      const current_user_id = useSelector((state : RootState) => state.auth.user?.id);
      const {id, name, image, user_id} = useRoute().params

      const handleSend = () => {
        dispatch(sendMessage({message: message, receiver_id: user_id}))
        setMessage('')
        dispatch(fetchMessages(chats.filter(chat => (chat.user1_id == current_user_id && chat.user2_id == user_id) || (chat.user1_id == user_id && chat.user2_id == current_user_id))[0]?.id))
        dispatch(fetchChats())
      };
      
      useEffect(() => {
          dispatch(fetchMessages(chats.filter(chat => (chat.user1_id == current_user_id && chat.user2_id == user_id) || (chat.user1_id == user_id && chat.user2_id == current_user_id))[0]?.id))
          dispatch(markMessagesAsSeen(chats.filter(chat => (chat.user1_id == current_user_id && chat.user2_id == user_id) || (chat.user1_id == user_id && chat.user2_id == current_user_id))[0]?.id))        
      }, [])

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
            paddingTop: 40,
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
            source={image ? {uri: image} : require('@/assets/images/default-avatar-icon-of-social-media-user-vector.jpg')}
            style={styles.profileImage}
            />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} bold>{name}</Text>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer} contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.warningMessage}>
            <Text style={styles.warningText}>غير مسموح بإرسال أي طريقه تواصل أخري إلا عن طريق تطبيق المضيف</Text>
        </View>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.sender_id == current_user_id ? styles.senderWrapper : styles.receiverWrapper,
            ]}
          >

            {msg.id !== '1' && (
              <View
                style={[
                  styles.messageBubble,
                  msg.sender_id == current_user_id ? styles.senderBubble : styles.receiverBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender_id == current_user_id ? styles.senderText : styles.receiverText,
                  ]}
                >
                  {msg.message}
                </Text>
              </View>
            )}
            {msg.sender_id != current_user_id && msg.id !== '1' && (
              <Image
                source={image ? {uri: image} : require('@/assets/images/default-avatar-icon-of-social-media-user-vector.jpg')}
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