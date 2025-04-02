<template>
    <div class="home-content-wrapper" style="flex-direction:column;">
         <!--
        <div class="input-container">
            <label for="message">Receiver: {{ this.receiver }}</label>
        </div>
        -->
        <h1>{{ receiver.fullName }} ({{ receiver.id }})</h1>
        <li v-for="message in conversation.messages" :key="message.id">
            <b>{{ message.sender }}</b>: {{ message.content }} <i>({{ message.timestamp }})</i>
        </li>

        <!-- message input + send button -->
        <div class="input-container">
            <textarea id="messageContent" v-model="messageContent" type="text" placeholder="Message" class="input-field"></textarea>
        </div>
        <button @click="sendMessage()">Send Message</button>
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
            }
        });
    },
    methods: {
        async getMessagesRealtime() {
            const db = getFirestore(firebaseApp);
            const conversationDocRef = doc(db, "conversations", this.conversationId);
            const conversationDoc = await getDoc(conversationDocRef);

            const conversationData = conversationDoc.data();
            if (conversationData.participants.includes(this.username)) {
                // get conversation info
                this.conversation = {
                    id: conversationDoc.id,
                    type: conversationData.type,
                    participants: conversationData.participants,
                    createdAt: conversationData.createdAt,
                    messages: [] // Initialize an empty messages array
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
