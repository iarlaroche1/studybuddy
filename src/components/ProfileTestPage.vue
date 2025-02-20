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
import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

var fullName = "";
var url = "";


if (user !== null) {
        user.providerData.forEach((profile) => {
            console.log("  Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
            fullName = profile.displayName;
            url = profile.photoURL;
        });
    } else {console.log("user is null");}

export default {
    data() {
        return {
            fullName: ''
        };
    },
    methods: {
        updateUserProfile() {
            
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
            if (user !== null) {
            user.providerData.forEach((profile) => {
                console.log("  Sign-in provider: " + profile.providerId);
                console.log("  Provider-specific UID: " + profile.uid);
                console.log("  Name: " + profile.displayName);
                console.log("  Email: " + profile.email);
                console.log("  Photo URL: " + profile.photoURL);
            });
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
