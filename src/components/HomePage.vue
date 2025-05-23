<template>
  <div class="home-page-content">
    <div v-if="loading">
      <div class="full-page-loader">
        <div class="spinner"></div>
        <p>Loading profile...</p>
      </div>
    </div>
    <div v-else>
      <div class="profile-display-top">
        <img class="profile-picture" alt="ProfilePic" :src="url" />

        <div class="profile-info">
          <h2 class="profile-name">{{ fullName }}</h2>
          <p class="profile-year">Year: {{ year }}</p>
        </div>

        <div class="edit-button-div">
          <button class="edit-profile-button" @click="this.$router.push('/home/edit')">
            Edit Profile
          </button>
        </div>
      </div>

      <div class="home-content-wrapper">
        <!-- Bio Section -->
        <div class="bio-content-container">
          <h1>Bio</h1>
          <p v-if="loading">Loading bio...</p>
          <p v-else>{{ bio }}</p>
        </div>

        <!-- Subjects Section -->
        <div class="subjects-content-container">
          <h1>{{ fullName }}'s Subjects</h1>
          <br />

          <div class="priority-group">
            <dt class="priority-title">Needs to Study:</dt>
            <template v-if="loading">
              <p>Loading subjects...</p>
            </template>
            <template v-else-if="subjects.filter(s => s.priority == 3).length > 0">
              <dd
                v-for="subject in subjects.filter(s => s.priority == 3)"
                :key="subject.id"
                class="subject-item"
              >
                {{ subject.name }}
              </dd>
            </template>
            <dd v-else class="subject-item empty-message">
              No subjects in this category
            </dd>
          </div>

          <div class="priority-group">
            <dt class="priority-title">Could Study:</dt>
            <template v-if="loading">
              <p>Loading subjects...</p>
            </template>
            <template v-else-if="subjects.filter(s => s.priority == 2).length > 0">
              <dd
                v-for="subject in subjects.filter(s => s.priority == 2)"
                :key="subject.id"
                class="subject-item"
              >
                {{ subject.name }}
              </dd>
            </template>
            <dd v-else class="subject-item empty-message">
              No subjects in this category
            </dd>
          </div>

          <div class="priority-group">
            <dt class="priority-title">Doesn't Need to Study:</dt>
            <template v-if="loading">
              <p>Loading subjects...</p>
            </template>
            <template v-else-if="subjects.filter(s => s.priority == 1).length > 0">
              <dd
                v-for="subject in subjects.filter(s => s.priority == 1)"
                :key="subject.id"
                class="subject-item"
              >
                {{ subject.name }}
              </dd>
            </template>
            <dd v-else class="subject-item empty-message">
              No subjects in this category
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, collection, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase";

export default {
  name: "HomePage",
  data() {
    return {
      fullName: "",
      bio: "",
      user: null,
      username: "",
      year: "",
      subjects: [],
      url: "",
      isProfileLoaded: false, // Track if the profile is loaded
      loading: true, // Add a loading state
    };
  },
  created() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.username = user.email ? user.email.split("@")[0] : ""; // Safely extract username
        if (this.username) {
          this.loadUserProfile();
        } else {
          console.error("Username is undefined or empty");
          this.$router.push("/login"); // Redirect to login if username is invalid
        }
      } else {
        console.log("No user is signed in");
        this.$router.push("/login");
      }
    });
  },
  methods: {
    async loadUserProfile() {
      if (!this.username) {
        console.error("Cannot load profile: username is undefined or empty");
        return;
      }

      const db = getFirestore(firebaseApp);
      const userDocRef = doc(db, "users", this.username);

      try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.fullName = userData.fullName || "Unknown User";
          this.year = userData.year || "N/A";
          this.bio = userData.bio || "No bio available";

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
                id: userSubjectDoc.id,
                priority: userSubjectDoc.data().priority,
                name: subjectDoc.data().name,
              });
            }
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
      this.isProfileLoaded = true; // Mark profile as loaded
      this.loading = false; // Mark loading as complete
    },
  },
};
</script>

<style>


.home-page-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: auto;
  min-width: 100%;
  width:10%;

}

.home-content-wrapper {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
  height: auto;
}

.bio-content-container,
.subjects-content-container {
  flex: 1;
  padding: 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
 
  min-height: 0;
  height:120%;
  white-space: pre-wrap; /* preserve newlines/spaces */
  height:auto;
 
}


.home-header {
  margin-bottom: 20px;
}

.profile-display-top {
  display: flex;
  align-items: center;
  gap: 1px;
  margin-bottom: 20px;
  padding: 10px;

}

.profile-picture {
  height: 80px;
  width: 80px;
  border: 1px solid #000;
  padding: 2px;
}

.profile-info {
  flex-grow: 1;
}

.profile-name {
  font-size: 1.5em;
  margin: 0;
}

.profile-year {
  font-size: 1em;
  margin: 0;
}

.edit-button-div {
  margin-left: auto;
}

.home-content-wrapper {
  display: flex;
  gap: 20px;
}




.priority-group {
  margin-bottom: 15px;
  padding: 5px;

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

.home-footer{
  background-color: #242526;
  height: 100px;
  width: 100%;
  position: relative;
  bottom: 0;
  text-align: center;
}

.full-page-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid rgb(173, 7, 82);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (orientation: portrait) {
}
</style>