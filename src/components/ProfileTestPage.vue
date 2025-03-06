<template>
    <div>
        <!-- Name input field section -->
        <div class="input-container">
            <label for="full-name">Full Name:</label>
            <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name" class="input-field" />
        </div>
        <div>
           <input type="file" @change="handleFileChange" accept="image/*" ref="input1">
           <button @click="previewImage">Submit</button>
        </div>
         <div v-if="imageData!=null">                     
            <img class="preview" height="268" width="356" :src="img1">
            <br>
         </div>

        <button @click="updateUserProfile">Update Profile</button><br>
        <button @click="checkProfile">Check Profile</button>
        
    </div>
</template>

<script>

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance

var fullName = "";
var url = "";

export default {
    data() {
        return {
            fullName: '',
            url: '',
            user: null
        };
    },
    created() {
        const auth = getAuth(firebaseApp); // Use the Firebase app instance
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                user.providerData.forEach((profile) => {
                    console.log("  Sign-in provider: " + profile.providerId);
                    console.log("  Provider-specific UID: " + profile.uid);
                    console.log("  Name: " + profile.displayName);
                    console.log("  Email: " + profile.email);
                    console.log("  Photo URL: " + profile.photoURL);
                    this.fullName = profile.displayName;
                    this.url = profile.photoURL;
                });
            } else {
                console.log("No user is signed in");
            }
        });
    },
    methods: {
        updateUserProfile() {
            const auth = getAuth(firebaseApp); // ensure auth is defined
            if (this.fullName == null) {
                this.fullName = fullName;
            }
            if (this.url == null) {
                this.url = url;
            }
            updateProfile(auth.currentUser, {
                displayName: this.fullName,
                photoURL: this.url,
            }).then(() => {
                // Profile updated!
                console.log('Profile updated successfully');
            }).catch((error) => {
                // An error occurred
                console.log(error);
            });
        },
        checkProfile() {
            if (this.user !== null) {
                this.user.providerData.forEach((profile) => {
                console.log("  Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
            } else if (this.user == null) {
                console.log("User is null");
            }
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadImage(event) {
            const file = event.target.files[0];
            if (!file) return;

            const storage = getStorage();
            const storageRef = ref(storage, `profileImages/${file.name}`);

            try {
                const snapshot = await uploadBytes(storageRef, file);
                const uploadURL = await getDownloadURL(snapshot.ref);
                console.log("File available at", uploadURL);
                url = uploadURL;
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    }
};
</script>

<style scoped>
.input-container {
    margin-bottom: 10px;
}
.input-field {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
</style>
