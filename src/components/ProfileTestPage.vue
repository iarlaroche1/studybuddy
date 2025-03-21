<template>
    <div>      
        <!-- Name input field section -->
        <div class="input-container">
            <label for="full-name">Full Name:</label>
            <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name" class="input-field" />
        </div>
        <div class="input-container">
            <label for="year">Year:</label>
            <input id="year" v-model="year" type="text" placeholder="Enter your year" class="input-field" />
        </div>

        <!-- pfp input field section -->
        <div>
            <img v-if="url !== '' && url !== null" id="preview" height="100" width="100" :src="url">
           <input type="file" @change="preview" accept="image/*" id="input1">
           <!-- commenting out the below button because it isn't really necessary, updateProfile does the same thing -->
           <!-- <button @click="uploadImage">Upload</button> -->
        </div>
                
        <table id="subjectAdd">
        </table>
        
        <br>
        <button @click="addSubject" id="addSubject">Add Subject</button>

        <br>
        <br>
        <button @click="updateUserProfile">Update Profile</button><br>
        <button @click="checkProfile">Check Profile</button>

    </div>
</template>

<script>

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, collection, setDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance


// var fullName = "";
// var url = "";

export default {
    
    data() {
        return {
            fullName: '',
            url: '',
            user: null,
            username: '',
            year: ''
        };
    },
    created() {        
        const auth = getAuth(firebaseApp); // Use the Firebase app instance
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.username = user.email.split('@')[0]; // Extract username from email
                this.loadUserProfile();
            } else {
                console.log("No user is signed in");
            }
        });
        
    },
    methods: {
        async loadUserProfile() {
            // get user document from database
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);
            const userDoc = await getDoc(userDocRef);

            // if it exists then set the locally saved variables to the data in there
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.fullName = userData.fullName;
                this.url = userData.photoURL;
                this.year = userData.year;
                
            } else {
                console.log("No such document!");
            }
        },
        async updateUserProfile() {
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);

            try {
                await this.uploadImage();
                await this.editSubjects();
                await setDoc(userDocRef, {
                    email: this.user.email,
                    fullName: this.fullName,
                    photoURL: this.url,
                    year: this.year
                });
                console.log('Profile updated successfully');
            } catch (error) {
                console.error("Error updating profile:", error);
            }
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
        preview() {
            const file = document.getElementById("input1").files[0];
            if (!file) return;
            document.getElementById("preview").src = URL.createObjectURL(file);
        },
        async uploadImage() {
            const file = document.getElementById("input1").files[0];
              if (!file) return;

            const storage = getStorage();
            this.username = this.user.email.split('@')[0];
            const storageRef = ref(storage, `profileImages/${this.username}`);

            try {   
                const snapshot = await uploadBytes(storageRef, file);
                const uploadURL = await getDownloadURL(snapshot.ref);
                console.log("File available at", uploadURL);
                this.url = uploadURL;
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        },
        async editSubjects() {
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);

            var table = document.getElementById("subjectAdd");

            for (var i = 0; i < table.rows.length; i++) {
                var course = document.getElementsByClassName("course")[i].value;
                var priority = Number(document.getElementsByClassName("priority")[i].value);

                const subjectsDocRef = doc(collection(userDocRef, "subjects"), course);
                await setDoc(subjectsDocRef, { priority });
            }
        },
        addSubject() {
            // get table and create new row
            var table = document.getElementById("subjectAdd");
            var row = document.createElement("tr");
            
            // create course input field
            var courseInput = document.createElement("input");
            courseInput.className = "course";
            row.appendChild(document.createTextNode("Subject: "));
            row.appendChild(courseInput);

            // create priority input field as a slider
            var priorityInput = document.createElement("input");
            priorityInput.type = "range";
            priorityInput.min = "1";
            priorityInput.max = "3";
            priorityInput.value = "2";
            priorityInput.className = "priority";
            row.appendChild(document.createTextNode("Priority: "));
            row.appendChild(priorityInput);
            
            // add row to table
            table.appendChild(row);
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
