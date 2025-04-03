<template>
    <div class="home-content-wrapper" style="flex-direction:column;">
        <router-link to='../chat'>Back</router-link>
        <h1>{{ receiver.fullName }} ({{ receiver.id }})</h1>
        <li v-for="message in conversation.messages" :key="message.id">
            <b>{{ message.sender }}</b>: {{ message.content }} <i>({{ message.timestamp }})</i>
        </li>

        <!-- message input + send button -->
        <div class="message-input-container">
            <textarea id="messageContent" v-model="messageContent" type="text" placeholder="Message" class="input-field"></textarea>
            <button class="sendMessageButton" @click="sendMessage()"><img class="msg-logo" alt="Send" src="@/assets/send_logo.jpg" /></button>
        </div>

    </div>
</template>


<script>
/* eslint-disable */
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
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
                        console.log(messageData.content);
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
                    "fullName": userDoc.data().fullName
                });
            }

            return participants;
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
        }
    }
};
</script>

<style>
.home-page-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  .message-input-container {
    margin-bottom: 15px;
  }
  .receiver-input-container {
    margin-bottom: 15px;
  }
  .input-container label {
      font-size: 18px;
      font-weight: 500;
      color: #000;
      margin-bottom: 8px;
      /* space between label and input */
  }
  .home-content-wrapper {
    display: flex;
    gap: 20px;
    flex: 1;
    min-height: 0;
  }
  .msg-logo {
      height: 20px;
      width: 30px;
      
     
  }
  .bio-content-container,
  .subjects-content-container {
    flex: 1;
    padding: 15px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    overflow-y: auto;
    min-height: 0;
  }
  
  
  .home-header {
    margin-bottom: 20px;
  }
  
  .profile-display-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  .profile-picture {
    height: 80px;
    width: 80px;
    border: 1px solid #000;
    padding: 2px;
  }
  
  .username-year {
    flex-grow: 1;
  }
  
  .edit-button-div {
    margin-left: auto;
  }
  
  .home-content-wrapper {
    display: flex;
    gap: 20px;
  }
  
  
  .sendMessageButton{
     
    
     
      cursor: pointer;
      transition: background-color 0.3s;
  }
  
  .priority-group {
    margin-bottom: 15px;
    padding: 5px;
    /* Remove fixed height */
    height: auto; /* Let content determine height */
  }
  .priority-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .subject-item {
    margin-left: 20px;
    padding: 5px 0;
  }
  
  .empty-message {
    color: #666;
    font-style: italic;
    margin-left: 20px;
  }
  
  .edit-profile-button {
    background-color: rgb(173, 7, 82);
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .edit-profile-button:hover {
    background-color: rgb(160, 6, 75);
  }
  </style>
  