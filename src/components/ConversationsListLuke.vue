<template>
    <div class="home-content-wrapper">
     
        <div class="chat-box-button-wrapper">
         
        <!-- create chat button -->
        <select  id="receiver" v-model="receiver" class="input-field">
            <option disabled value="">Select a user</option>
        </select>
        <button class="chat-button" @click="newChat()">Chat</button>

        </div>

        <!-- conversations list -->
        <li v-for="conversation in conversations" :key="conversation.id">
            <img height=50 width=50 :src=conversation.receiver.photoURL>
            <router-link :to="'/chat/' + conversation.id">{{ conversation.receiver.fullName }} ({{ conversation.receiver.id }})</router-link> <!-- get user that isn't this.username (i.e. other participant involved), and display that -->
            <br><b>{{ conversation.lastMessageBy }}:</b> {{ conversation.lastMessage }} <i>({{ conversation.lastMessageAt }})</i>
            <!--
            <ul>
                <li v-for="message in conversation.messages" :key="message.timestamp">
                    <b>{{ message.sender }}</b>: {{ message.content }} <i>({{ message.timestamp }})</i>
                </li>
            </ul>
            -->
        </li>
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
        users: [],
        conversations: [],
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
            } else {
                console.log("No user is signed in");
                this.$router.push('/login');
            }
        });
    },
    mounted() {
        if (this.$route.path.startsWith('/chat')) { // to ensure loadUsers function won't run anywhere else
            this.loadUsers().then(() => {
                this.getMessagesRealtime();
            });
        }
    },
    methods: {
        getMessagesRealtime() {
            const db = getFirestore(firebaseApp);
            const conversationsDocRef = collection(db, "conversations");

            // Listen for changes in the conversations collection
            this.unsubscribeConversations = onSnapshot(conversationsDocRef, (snapshot) => {
                this.conversations = []; // Clear the conversations array
                snapshot.forEach((conversationDoc) => {
                    const conversationData = conversationDoc.data();
                    if (conversationData.participants.includes(this.username)) {
                        const conversation = {
                            id: conversationDoc.id,
                            type: conversationData.type,
                            lastMessage: conversationData.lastMessage,
                            lastMessageAt: conversationData.lastMessageAt.toDate(),
                            lastMessageBy: conversationData.lastMessageBy,
                            createdAt: conversationData.createdAt,
                            receiver: null, // placeholder for receiver
                        };

                        // find the receiver and add it to the conversation
                        const receiverId = conversationData.participants.find((user) => user != this.username);
                        const receiver = this.users.find((user) => user.id == receiverId);
                        if (receiver) {
                            const storage = getStorage();
                            const storageRef = ref(storage, `profileImages/${receiverId}`);
                            getDownloadURL(storageRef).then((url) => {
                                receiver.photoURL = url; // Set the resolved URL
                            })
                            .catch(() => {
                                getDownloadURL(ref(storage, "profileImages/blank.jpg")).then((url) => {
                                        receiver.photoURL = url;
                                    });
                            });
                            conversation.receiver = receiver;
                        }

                        // Update the conversation in the conversations array
                        this.conversations.push(conversation);
                    }
                });
                // Sort conversations by lastMessageAt in descending order
                this.conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
            });
        },
        async newChat() {
            if (this.receiver == '' || this.receiver == null) {
                console.error("Receiver is null!");
            }
            else {

                const db = getFirestore(firebaseApp);

                // reference to the conversations collection
                const conversationsCollectionRef = collection(db, "conversations");

                // get current date to store later
                var createdAt = new Date();

                var conversationRef;
                var conversationId = null;

                const querySnapshot = await getDocs(conversationsCollectionRef);

                querySnapshot.forEach((doc) => { // go thru conversations collection and try to find one between the two given users
                    if (doc.data().participants.includes(this.username) && doc.data().participants.includes(this.receiver)) {
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
                            participants: [this.username, this.receiver],
                            lastMessage: "",
                            lastMessageAt: createdAt,
                            lastMessageBy: this.username,
                            createdAt: createdAt
                    });

                    console.log(`Conversation created with ID: ${conversationId}`);
                }

                this.$router.push('/chat/' + conversationId);
            }
        },
        async loadUsers() {
            const db = getFirestore(firebaseApp);
            const usersCollectionRef = collection(db, "users");

            const receiverSelection = document.getElementById("receiver"); // receiver selection menu
            if (!receiverSelection) {
                console.error("Element with ID 'receiver' not found.");
                return;
            }

            const querySnapshot = await getDocs(usersCollectionRef);

            this.users = []; // clear the array before loading
            const currentUser = await getDoc(doc(db, "users", this.username)); 
            if (!querySnapshot.empty) {
                // go thru each user document in users collection
                for (const userDoc of querySnapshot.docs) {
                    let userData = userDoc.data();
                    
                    let option = document.createElement("option");
                        
                    option.value = userDoc.id;
                    option.text = userData.fullName + " (" + userDoc.id + ")";
                    receiverSelection.appendChild(option);
                    
                    this.users.push({
                        "id": userDoc.id, 
                        "fullName": userData.fullName,
                    });
                }
            }
            console.log("Loaded users:", this.users); // Debugging log
        }
    }
};
</script>

<style scoped>

.home-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
  height: auto;
}

.input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }
  .chat-box-button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  .chat-button {
    background-color: rgb(173, 7, 82);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  .chat-button:hover {
    background-color: rgb(150, 6, 75);
  }
</style>