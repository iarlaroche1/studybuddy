<template>
  <div class="home-page-content">
    <div class="home-content-wrapper" style="flex-direction: column;">
      <h1>Find Buddies</h1>

      <!-- Loading Spinner -->
      <template v-if="loading">
        <div class="loading-container">
          <div class="spinner"></div>
          <span>Loading buddies...</span>
        </div>
      </template>

      <!-- Buddy Requests Section -->
      <template v-else-if="buddyRequests.length > 0">
        <h2>Buddy Requests</h2>
        <ul class="buddy-requests-list">
          <li v-for="request in buddyRequests" :key="request.id" class="buddy-request-item">
            <img class="buddy-photo" :src="request.senderPhotoURL || 'default-profile.jpg'" alt="Sender Photo" />
            <div class="buddy-details">
              <router-link :to="'/user/' + request.senderUsername" class="buddy-link">
                {{ request.senderFullName }}
              </router-link>
              <p class="buddy-username">@{{ request.senderUsername }}</p>
              <div class="buddy-request-actions">
                <button @click="acceptRequest(request)" class="accept-button">Accept</button>
                <button @click="declineRequest(request)" class="decline-button">Decline</button>
              </div>
            </div>
          </li>
        </ul>
      </template>

      <!-- Buddies List -->
      <template v-else>
        <ul class="buddies-list">
          <li v-for="user in users" :key="user.id" class="buddy-item">
            <img class="buddy-photo" :src="user.photoURL || 'default-profile.jpg'" alt="Buddy Photo" />
            <div class="buddy-details">
              <router-link :to="'/user/' + user.id" class="buddy-link">
                {{ user.fullName }}
              </router-link>
              <p class="buddy-correlation">Correlation: {{ user.correlation.toFixed(2) }}</p>
              <div v-if="user.commonSubjects.filter(s => s.priority == 3).length > 0">
                <p class="common-subjects">
                  You both need to study:
                  <span v-for="(subject, index) in user.commonSubjects.filter(s => s.priority == 3)" :key="index">
                    {{ subject.id }}
                    <span v-if="index < user.commonSubjects.filter(s => s.priority == 3).length - 1">, </span>
                  </span>
                </p>
              </div>
              <div v-if="user.commonSubjects.filter(s => s.priority == 2).length > 0">
                <p class="common-subjects">
                  You both could study:
                  <span v-for="(subject, index) in user.commonSubjects.filter(s => s.priority == 2)" :key="index">
                    {{ subject.id }}
                    <span v-if="index < user.commonSubjects.filter(s => s.priority == 2).length - 1">, </span>
                </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance

export default {
    name: 'BuddiesListPage',
    data() {
        return {
        header: require('@/assets/header.jpg'),
        user: null,
        username: '',
        users: [],
        user1Subjects: [],
        loading: true, // Add a loading state
        buddyRequests: []
        };
    },
    created() {
        const auth = getAuth(firebaseApp); // Use the Firebase app instance
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.username = user.email.split('@')[0]; // Extract username from email
                this.loadUsers();
                this.loadBuddyRequests(); // Load buddy requests

            } else {
                console.log("No user is signed in");
                this.$router.push('/login');
            }
        });

    },
    methods: {
        async loadUsers() {
            this.loading = true; // Set loading to true
            const db = getFirestore(firebaseApp);
            const usersCollectionRef = collection(db, "users");

            const querySnapshot = await getDocs(usersCollectionRef);

            this.users = []; // Clear the array before loading
            const currentUser = await getDoc(doc(db, "users", this.username));
            if (!querySnapshot.empty) {
                // Go through each user document in the users collection
                for (const userDoc of querySnapshot.docs) {
                    if (userDoc.id !== this.username && userDoc.data().year == currentUser.data().year) {
                        // Exclude the logged-in user and only include users in the same year
                        let userDocRef = doc(db, "users", userDoc.id);
                        let userData = userDoc.data();

                        let subjectsCollectionRef = collection(userDocRef, "subjects");
                        let subjects = await this.getUserSubjects(subjectsCollectionRef);

                        // Only run correlation check if the user is not the logged-in user
                        let correlation = await this.getCorrelation(subjects);
                        let commonSubjects = await this.getCommonSubjects(subjects);

                        // Get profile photo
                        const storage = getStorage();
                        const storageRef = ref(storage, `profileImages/${userDoc.id}`);
                        let photoURL = null;
                        try {
                            photoURL = await getDownloadURL(storageRef);
                        } catch {
                            photoURL = await getDownloadURL(ref(storage, "profileImages/blank.jpg"));
                        }

                        this.users.push({
                            id: userDoc.id,
                            fullName: userData.fullName,
                            subjects: subjects,
                            commonSubjects: commonSubjects,
                            correlation: correlation,
                            photoURL: photoURL,
                        });
                    }
                }

                // Sort based on which correlation is higher
                this.users.sort((a, b) =>
                    a.correlation > b.correlation ? -1 : b.correlation > a.correlation ? 1 : 0
                );
            }
            this.loading = false; // Set loading to false after loading is complete
        },
        async getUserSubjects(ref) {
            const querySnapshot = await getDocs(ref);
            let subjects = [];

            if (!querySnapshot.empty) {
                  querySnapshot.forEach((doc) => {
                    subjects.push({
                        "id": doc.id, 
                        "priority": doc.data().priority
                    });
                  });
              }

              return subjects;
        },
        async getCorrelation(user2Subjects) {
            // user1 is the user that's currently logged in
            // if user1Subjects has not yet been populated, use getUserSubjects to populate it
            if (this.user1Subjects.length == 0) {
                const db = getFirestore(firebaseApp);
                const userDocRef = doc(db, "users", this.username);
                this.user1Subjects = await this.getUserSubjects(collection(userDocRef, "subjects"));
            }

            let correlation = 0;
            let prioritySum1 = 0; // sum of priority scores for user1
            let prioritySum2 = 0; // sum of priority scores for user2

            // go thru each subject user has
            for (const user1Subject of this.user1Subjects) {
                let user2Subject = user2Subjects.find((subject) => subject.id === user1Subject.id);
                
                let priority1 = user1Subject.priority;
                prioritySum1 += priority1;
                
                // if user2 does not take subject, treat it as if their priority for the subject was 1
                let priority2 = 1;
                if (user2Subject) {
                    priority2 = user2Subject.priority;
                }
                prioritySum2 += priority2;

                // correlation algorithm formula
                if (priority1 == priority2) {
                    correlation += priority1;
                } else {
                    correlation -= (1 - (priority1 + priority2) / 8);
                }                
            }
            return correlation / ((prioritySum1 + prioritySum2) / 2);
        },
        async getCommonSubjects(user2Subjects) {
            const db = getFirestore(firebaseApp);
            const commonSubjects = [];

            // go thru each subject user has
            for (const user1Subject of this.user1Subjects) {
                let user2Subject = user2Subjects.find((subject) => subject.id === user1Subject.id);

                if (user2Subject && user1Subject.priority == user2Subject.priority) {
                    // get corresponding entry in root/subjects database
                    const subjectDocRef = doc(db, "subjects", user1Subject.id);
                    const subjectDoc = await getDoc(subjectDocRef);

                    commonSubjects.push({
                        "id": user1Subject.id,
                        "name": subjectDoc.name,
                        "priority": user1Subject.priority
                    });
                }
            }

            return commonSubjects;
        },
        async loadBuddyRequests() {
            const db = getFirestore(firebaseApp);
            const buddyRequestsCollectionRef = collection(db, "buddyRequests");

            const querySnapshot = await getDocs(buddyRequestsCollectionRef);
            this.buddyRequests = [];

            for (const requestDoc of querySnapshot.docs) {
                const requestData = requestDoc.data();

                // Only include requests where the logged-in user is the receiver
                if (requestData.receiver === this.username) {
                const senderDocRef = doc(db, "users", requestData.sender);
                const senderDoc = await getDoc(senderDocRef);

                let senderPhotoURL = null;
                const storage = getStorage();
                const storageRef = ref(storage, `profileImages/${requestData.sender}`);
                try {
                    senderPhotoURL = await getDownloadURL(storageRef);
                } catch {
                    senderPhotoURL = "default-profile.jpg";
                }

                this.buddyRequests.push({
                    id: requestDoc.id,
                    senderUsername: requestData.sender,
                    senderFullName: senderDoc.exists() ? senderDoc.data().fullName : "Unknown User",
                    senderPhotoURL: senderPhotoURL,
                });
                }
            }
        },
        async acceptRequest(request) {
            const db = getFirestore(firebaseApp);

            try {
                // Add to buddies collection
                await setDoc(doc(db, "buddies", request.senderUsername + "-" + this.username), {
                    buddies: [request.senderUsername, this.username],
                });
                console.log("Buddy added successfully!");
            } catch (error) {
                console.error("Error adding buddy:", error);
            }

            try {
                // Remove the buddy request
                await deleteDoc(doc(db, "buddyRequests", request.id));
                console.log("Buddy request deleted successfully!");
            } catch (error) {
                console.error("Error deleting buddy request:", error);
            }

            // Remove the request from the buddyRequests array
            const index = this.buddyRequests.findIndex((r) => r.id === request.id);
            if (index !== -1) {
                this.buddyRequests.splice(index, 1); // Remove the request from the array
            }
        },
        async declineRequest(request) {
            const db = getFirestore(firebaseApp);

            // Remove the buddy request
            await deleteDoc(doc(db, "buddyRequests", request.id));

            // Refresh buddy requests
            this.loadBuddyRequests();
        }
    }
};
</script>

<style scoped>
.buddies-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px; /* Set a fixed height for the list */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ddd; /* Optional: Add a border for better visibility */
  border-radius: 8px; /* Optional: Add rounded corners */
}

.buddy-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  gap: 15px;
}

.buddy-item:last-child {
  border-bottom: none; /* Remove the border for the last item */
}

.buddy-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}

.buddy-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.buddy-link {
  font-size: 1rem;
  font-weight: bold;
  color: rgb(173, 7, 82);
  text-decoration: none;
}

.buddy-link:hover {
  text-decoration: underline;
}

.buddy-correlation {
  font-size: 0.875rem;
  color: #555;
  margin-top: 5px;
}

.common-subjects {
  font-size: 0.875rem;
  color: #333;
  margin-top: 5px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px; /* Adjust height as needed */
  gap: 10px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid rgb(173, 7, 82); /* Spinner color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.buddy-requests-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.buddy-request-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  gap: 15px;
}

.buddy-request-item:last-child {
  border-bottom: none;
}

.buddy-request-actions {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.accept-button {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.accept-button:hover {
  background-color: #45a049;
}

.decline-button {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.decline-button:hover {
  background-color: #e53935;
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>