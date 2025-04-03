<template>
  <div class="home-page-content">
    <div class="home-content-wrapper" style="flex-direction: column;">
      <router-link to="../chat" class="back-link">Back</router-link>
      <h1 class="receiver-header">{{ receiver.fullName }} ({{ receiver.id }})</h1>

      <!-- Messages List -->
      <div class="messages-container">
        <ul class="messages-list">
          <li v-for="message in conversation.messages" :key="message.id" class="message-item">
            <!-- Wrap the profile picture in a router-link -->
            <router-link :to="'/user/' + message.sender">
              <img
                class="message-sender-photo"
                :src="getUserPhoto(message.sender)"
                alt="Sender Photo"
              />
            </router-link>
            <div class="message-content-wrapper">
              <b class="message-sender">{{ getUserName(message.sender) }}</b>
              <span class="message-content">{{ message.content }}</span>
              <i class="message-timestamp">({{ formatDate(message.timestamp) }})</i>
            </div>
          </li>
        </ul>
      </div>

      <!-- Message Input -->
      <div class="message-input-container">
        <textarea
          id="messageContent"
          v-model="messageContent"
          type="text"
          placeholder="Message"
          class="input-field"
        ></textarea>
        <button class="sendMessageButton" @click="sendMessage()">
          <img class="msg-logo" alt="Send" src="@/assets/send_logo.jpg" />
        </button>
      </div>
    </div>
  </div>
</template>


<script>
/* eslint-disable */
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance

export default {
    name: 'ChatPage',
    data() {
        return {
        header: require('@/assets/header.jpg'),
        user: null,
        username: '',
        receiver: '',
        conversationId: '',
        messageContent: "",
        conversation: [],
        unsubscribeConversations: null, // to store the unsubscribe function for conversations
        unsubscribeMessages: {} // to store unsubscribe functions for each conversation's messages
        };
    },
    created() {
        const auth = getAuth(firebaseApp); // Use the Firebase app instance
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.username = user.email.split('@')[0]; // Extract username from email
                this.conversationId = this.$route.params.id
                this.getMessagesRealtime();
            } else {
                console.log("No user is signed in");
                this.$router.push('/login');
            }
        });
    },
    methods: {
        async getMessagesRealtime() {
            const db = getFirestore(firebaseApp);
            const conversationDocRef = doc(db, "conversations", this.conversationId);
            const conversationDoc = await getDoc(conversationDocRef);

            if (!conversationDoc.exists()) {
                console.error("Conversation document does not exist.");
                this.$router.push('/chat/'); // redirect to the chat list
                return;
            }

            const conversationData = conversationDoc.data();
            if (!conversationData) {
                console.error("Conversation data is undefined.");
                this.$router.push('/chat/'); // redirect to the chat list
                return;
            }
            
            if (conversationData.participants.includes(this.username)) {
                // get conversation info
                this.conversation = {
                    id: conversationDoc.id,
                    type: conversationData.type,
                    participants: conversationData.participants,
                    createdAt: conversationData.createdAt,
                    messages: [] // initialize an empty messages array
                };

                // load details for participants
                this.conversation.participants = await this.loadUsers();
                this.receiver = this.conversation.participants.find((user) => user.id != this.username);

                // listen for changes in the messages subcollection
                if (this.unsubscribeMessages[conversationDoc.id]) {
                    this.unsubscribeMessages[conversationDoc.id](); // Unsubscribe if already listening
                }
                const messagesCollectionRef = collection(conversationDoc.ref, "messages");
                this.unsubscribeMessages[conversationDoc.id] = onSnapshot(messagesCollectionRef, (messagesSnapshot) => {
                    const messages = [];
                    messagesSnapshot.forEach((messageDoc) => {
                        const messageData = messageDoc.data();
                        messages.push({
                            id: messageDoc.id,
                            content: messageData.content,
                            readBy: messageData.readBy,
                            sender: messageData.sender,
                            timestamp: messageData.timestamp.toDate()
                        });
                    });

                    // sort messages by timestamp
                    messages.sort((a, b) => a.timestamp - b.timestamp);
                    this.conversation.messages = messages;

                });
        } else { // user does not have access to this conversation
                    this.$router.push('/chat/');
                }
        },
        async loadUsers(){
            const db = getFirestore(firebaseApp);

            // create temporary participants array
            const participants = [];

            for (const participant of this.conversation.participants) {
                const userDoc = await getDoc(doc(db, "users", participant));
                participants.push({
                    "id": userDoc.id,
                    "fullName": userDoc.data().fullName,
                    "photoURL": await this.getUserPhotoURL(userDoc.id)
                });
            }

            return participants;
        },
        async getUserPhotoURL(userId) {
            const storage = getStorage();
            const storageRef = ref(storage, `profileImages/${userId}`);
            try {
                return await getDownloadURL(storageRef);
            } catch {
                return await getDownloadURL(ref(storage, "profileImages/blank.jpg"));
            }
        },
        async sendMessage() {
            const db = getFirestore(firebaseApp);

            // reference to the conversations collection
            const conversationsCollectionRef = collection(db, "conversations");

            // get current date to store later
            var createdAt = new Date();

            var conversationRef;
            var conversationId = null;

            const querySnapshot = await getDocs(conversationsCollectionRef);

            querySnapshot.forEach((doc) => { // go thru conversations collection and try to find one between the two given users
                if (doc.data().participants.includes(this.username) && doc.data().participants.includes(this.receiver.id)) {
                    conversationRef = doc.ref;
                    conversationId = doc.id;
                }
            });

            if (conversationId == null) { // if there is no existing conversation between two users
                conversationRef = doc(conversationsCollectionRef); // auto-generate an ID for the conversation
                conversationId = conversationRef.id;
            
                // add the conversation document
                await setDoc(conversationRef, {
                        type: "direct",
                        participants: [this.username, this.receiver.id],
                        lastMessage: "",
                        lastMessageAt: createdAt,
                        lastMessageBy: this.username,
                        createdAt: createdAt
                });

                console.log(`Conversation created with ID: ${conversationId}`);
            }

            // reference to the messages subcollection
            const messagesCollectionRef = collection(conversationRef, "messages");
            
            let message = {
                content: this.messageContent,
                sender: this.username,
                timestamp: createdAt
            }

            // create a message document and setDoc
            const messageDocRef = doc(messagesCollectionRef); // auto-generate an ID for each message
            await setDoc(messageDocRef, message);
            console.log(`Message added: ${message.content}`);

            await setDoc(conversationRef, {
                        lastMessage: this.messageContent,
                        lastMessageAt: createdAt,
                        lastMessageBy: this.username,
            }, { merge: true }); // use merge: true to preserve existing data);
            
            this.messageContent = "";
        },
        getUserPhoto(userId) {
            const user = this.conversation.participants.find((u) => u.id === userId);
            return user ? user.photoURL : "default-profile.jpg";
        },
        getUserName(userId) {
            const user = this.conversation.participants.find((u) => u.id === userId);
            return user ? user.fullName : "Unknown User";
        },
        formatDate(date) {
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        }
    }
};
</script>

<style>
.home-page-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
  overflow: hidden; /* Prevent content overflow */
}

.home-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.back-link {
  text-decoration: none;
  color: rgb(173, 7, 82);
  font-weight: bold;
  margin-bottom: 10px;
}

.back-link:hover {
  text-decoration: underline;
}

.receiver-header {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.messages-container {
  flex: 1; /* Allow the messages container to grow and fill available space */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
}

.messages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.message-item:last-child {
  border-bottom: none; /* Remove border for the last message */
}

.message-sender-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
}

.message-sender {
  font-weight: bold;
  color: rgb(173, 7, 82);
}

.message-content {
  margin-left: 5px;
  color: #333;
}

.message-timestamp {
  font-size: 0.8rem;
  color: #999;
  margin-left: 10px;
}

.message-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.input-field {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none; /* Prevent resizing of the textarea */
}

.sendMessageButton {
  background-color: rgb(173, 7, 82);
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sendMessageButton:hover {
  background-color: rgb(160, 6, 75);
}

.msg-logo {
  height: 20px;
  width: 30px;
}
</style>
