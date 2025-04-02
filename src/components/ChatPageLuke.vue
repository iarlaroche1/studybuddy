<template>
<div class="home-page-content">
     
  
      <div class="profile-display-top">
        <img class="profile-picture" alt="ProfilePic" :src="url" />
        
        <div class="username-year">
          <span id="name">Name: {{ fullName }}<br>
          <span id="year">Year: {{ year }}</span></span>
        </div>
        
        <div class="edit-button-div">
          <button class="edit-profile-button" @click="handleEditProfile">
            Edit Profile
          </button>
        </div>
      </div>
  
      <div class="home-content-wrapper">
        
        <div>
        <!-- bio input field section -->
        <div class="receiver-input-container">
            <label for="message">Receiver: (todo maybe: dropdown list of buddies)</label>
            <textarea id="receiver" v-model="receiver" type="text" placeholder="Select buddy" class="input-field"></textarea>
        </div>
        <div class="message-input-container">
            <label for="message">Message:</label>
            <textarea id="messageContent" v-model="messageContent" type="text" placeholder="Message" class="input-field"></textarea>
            <button class="sendMessageButton" @click="sendMessage()"><img class="msg-logo" alt="Send" src="@/assets/send_logo.jpg" /></button>
        </div>

        <!-- TEMP -->
        <li v-for="conversation in conversations" :key="conversation.id">
            Participants: {{ conversation.participants }}
            <ul>
                <li v-for="message in conversation.messages" :key="message.timestamp">
                    <b>{{ message.sender }}</b>: {{ message.content }} <i>({{ message.timestamp }})</i>
                </li>
            </ul>
        </li>
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
        fullName: '',
        bio: '',
        user: null,
        username: '',
        year: '',
        subjects: [],
        url: '',
       
        username: '',
        receiver: '',
        messageContent: "",
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
                this.getMessagesRealtime();
                this.loadUserProfile();
            } else {
                console.log("No user is signed in");
            }
        });
    },
    methods: {
        handleEditProfile() {
      this.$router.push('/neweditprofile');
    },
        async loadUserProfile() {
        const db = getFirestore(firebaseApp);
        const userDocRef = doc(db, "users", this.username);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.fullName = userData.fullName;
          this.year = userData.year;
          this.bio = userData.bio;
  
          const storage = getStorage();
          const storageRef = ref(storage, `profileImages/${this.username}`);
          try {
            this.url = await getDownloadURL(storageRef);
          } catch (error) {
            console.error("Error retrieving photo URL:", error);
            this.url = await getDownloadURL(ref(storage, "profileImages/blank.jpg"));
          }
  
          const userSubjectsCollectionRef = collection(userDocRef, "subjects");
          const querySnapshot = await getDocs(userSubjectsCollectionRef);
          this.subjects = [];
          if (!querySnapshot.empty) {
            for (const userSubjectDoc of querySnapshot.docs) {
              const subjectDocRef = doc(db, "subjects", userSubjectDoc.id);
              const subjectDoc = await getDoc(subjectDocRef);
              this.subjects.push({ 
                "id": userSubjectDoc.id, 
                "priority": userSubjectDoc.data().priority, 
                "name": subjectDoc.data().name 
              });
            }
          }
        } else {
          console.log("No such document!");
        }
      },
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
                            participants: conversationData.participants,
                            lastMessage: conversationData.lastMessage,
                            lastMessageAt: conversationData.lastMessageAt,
                            lastMessageBy: conversationData.lastMessageBy,
                            createdAt: conversationData.createdAt,
                            messages: [] // Initialize an empty messages array
                        };

                        // Listen for changes in the messages subcollection
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

                            // Sort messages by timestamp
                            messages.sort((a, b) => a.timestamp - b.timestamp);
                            conversation.messages = messages;

                            // Update the conversation in the conversations array
                            const index = this.conversations.findIndex(c => c.id === conversation.id);
                            if (index !== -1) {
                                this.conversations[index] = conversation;
                            } else {
                                this.conversations.push(conversation);
                            }
                        });
                    }
                });
            });
        },
        async getMessages() {
            const db = getFirestore(firebaseApp);
            const conversationsDocRef = collection(db, "conversations");

            const conversationsQuerySnapshot = await getDocs(conversationsDocRef);

            
            this.conversations = [];
            var j = 0;
            if (!conversationsQuerySnapshot.empty) {
                // go thru each user document in conversations collection
                for (const conversationDoc of conversationsQuerySnapshot.docs) {
                    if (conversationDoc.data().participants.includes(this.username)) { // if the user ID is in the array of user IDs
                        const messagesCollectionRef = collection(conversationDoc.ref, "messages");
                        const messagesQuerySnapshot = await getDocs(messagesCollectionRef);

                        let messages = [];
                        let i = 0;
                        if (!messagesQuerySnapshot.empty) {
                            // for loop going through each message document in conversation
                            for (const messageDoc of messagesQuerySnapshot.docs) {
                                const messageData = messageDoc.data();
                                messages[i] = {
                                    "id": messageDoc.id,
                                    "content": messageData.content,
                                    "readBy": messageData.readBy,
                                    "sender": messageData.sender,
                                    "timestamp": messageData.timestamp.toDate()
                                };
                                i++;
                            }

                            // sort messages by timestamp
                            messages.sort((a,b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0))
                        }

                        const conversationData = conversationDoc.data();
                        this.conversations[j] = {
                            "id": conversationDoc.id,
                            "type": conversationData.type,
                            "participants": conversationData.participants,
                            "lastMessage": conversationData.lastMessage,
                            "lastMessageAt": conversationData.lastMessageAt,
                            "lastMessageBy": conversationData.lastMessageBy,
                            "createdAt": conversationData.createdAt,
                            "messages": messages
                        };
                        j++;
                    }
                  }
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
<style scoped>
  
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
