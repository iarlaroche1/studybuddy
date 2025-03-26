<template>

    <div class="page-container">


        <img class="edit-profile-header-image" alt="Header" :src="header" />

        <div class="edit-profile-side-navbar-container">
            <!-- Header image -->
            <nav class="edit-profile-side-navbar">
                <ul>
                    <br><br>
                    <li><a href="">Buddies</a></li>
                    <li><a href="">Chat</a></li>
                    <li><a href="">Calendar</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>
                    <li><a href="">-</a></li>


                </ul>
            </nav>


        </div> <!-- end of side navbar  -->

        <div class="edit-profile-rightside-container">

            <div class="edit-profile-header">
                <div>
                    <h1 class="edit-profile-title">Edit Profile</h1>
                </div>
            </div>

            <div class="edit-profile-profile-display-top">

                <img v-if="url !== '' && url !== null" id="preview" height="100" width="100" :src="url">
                <input type="file" @change="preview" accept="image/*" id="input1">
                <!-- commenting out the below button because it isn't really necessary, updateProfile does the same thing -->
                <!-- <button @click="uploadImage">Upload</button> -->

                <div class="edit-profile-username-year">
                    <span>
                        <div class="edit-profile-name-input-container">
                            <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name"
                                class="input-field" />
                        </div>
                        <br>
                        <span>
                            <div class="edit-profile-year-input-container">
                                <input id="year" v-model="year" type="text" placeholder="Enter your year"
                                    class="input-field" />
                            </div>
                        </span>

                    </span>



                </div>

                <div class="edit-profile-edit-button-div">
                    
                        <button class="edit-profile-button"
                            @click=handleDiscardChanges>Discard Changes</button>
                    
                   
                            <button @click="updateUserProfile">Update Profile</button><br>
                        </div>

            </div>

            <div>


                <table id="subjectAdd">
                </table>

                <br>
                <button @click="addSubject" id="addSubject">Add Subject</button>

                <br>
                <br>
             
               

            </div>




            <div class="edit-profile-content-wrapper">


                <div class="edit-profile-bio-content-container">

                    <h1>Bio</h1>
                    <p>Mister Study man, cant do integrals , currently studying Calculus.</p>

                </div>


                <div class="edit-profile-subjects-content-container">

                    <h1>Subjects</h1>
                    <h4>Needs to Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 3)" :key=subject.id>
                        {{ subject.id }}
                    </li>
                    <h4>Could Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 2)" :key=subject.id>
                        {{ subject.id }}
                    </li>
                    <h4>Doesn't Need to Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 1)" :key=subject.id>
                        {{ subject.id }}
                    </li>

                </div>
            </div>
        </div><!--rightside container end-->


        <div class="edit-profile-footer">
            <div class="edit-profile-footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>

        </div>
    </div>

</template>

<script>
//import { db, auth } from '@/api/firebase'; // Import Firebase services
//import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, collection, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance


export default {
    name: "NewEditProfilePage",
    data() {
        return {
            header: require('@/assets/header.jpg'),
            jackiechan: require('@/assets/jackiechan.jpg'),
            fullName: '',
            bio: 'Mister Study man, can\'t do integrals, currently studying Calculus.',
            user: null,
            username: '',
            year: '',
            subjects: [], // Array to hold dynamic subject data
            url: ''
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
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // load profile info
                this.fullName = userData.fullName;
                this.url = userData.photoURL;
                this.year = userData.year;

                // list subjects - TEMP CODE to be updated when 
                const subjectsCollectionRef = collection(userDocRef, "subjects");

                const querySnapshot = await getDocs(subjectsCollectionRef);
                this.subjects = []; // clear the array before loading
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        this.subjects.push({ "id": doc.id, "priority": doc.data().priority });
                    });
                }


            } else {
                console.log("No such document!");
            }
        },
        handleDiscardChanges() { // method called when user wishes to discard changes via button
            this.$router.push('/homepage'); // returns to homepage
        }
    }
};
</script>


<style>
/* Change the background color of the navbar */
.pos-f-t {
    background-color: rgb(173, 7, 82);
    /* Change this color to your preferred color */
}

.page-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

/* Header image */
.edit-profile-header-image {

    max-height: auto;
    max-width: auto;
    min-height: 20%;
    min-width: 20%;
    display: flex;
    /* 30% of the viewport height */
    object-fit: fill;
    border-radius: 0px;

    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: 150px;

}

.edit-profile-rightside-container {

    display: flex;
    flex-direction: row;

    flex-wrap: wrap;

    width: 70px;




}

.edit-profile-side-navbar-container {
    position: relative;
    float: left;
    top: 80px;
    width: 30px;
    display: flex;
    flex-direction: column;

}

.edit-profile-side-navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 400px;
    overflow: hidden;
    background-color: rgb(173, 7, 82);
}

.edit-profile-side-navbar a {
    display: flex;
    color: white;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    text-decoration: none;
    font-size: 1rem;
    padding: 15px;
    display: block;
    text-align: center;
    min-height: 10px;
    max-height: auto;

}

.edit-profile-side-navbar a:hover {
    background-color: rgb(182, 50, 109);

}

.edit-profile-header {
    position: absolute;
    top: 0;
    left: 570px;
    width: 40%;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 140px;



}

.edit-profile-title {
    left: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 140px;



}

.edit-profile-profile-display-top {
    position: absolute;
    display: flex;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    left: 400px;
    top: 140px;
    padding: 5px;
    height: 100px;
    width: 70%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
}

.edit-profile-profile-picture {
    max-height: 80px;



    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    padding: 2px;

}

.edit-profile-name-input-container {
    display: flex;
    max-height: 8px;
    height: 10px;
    border-radius: 0px;
    padding: 2px;
}

.edit-profile-year-input-container {
    display: flex;
    max-height: 8px;
    height: 10px;
    border-radius: 0px;
    padding: 2px;
}

.username {
    max-height: 80px;



    height: auto;

    border-radius: 0px;

    padding: 2px;

}

.year {
    max-height: 80px;


    height: auto;

    border-radius: 0px;

    padding: 2px;

}



.edit-profile-edit-button-div {
    max-height: 100px;

    height: auto;

    border-radius: 0px;

    padding-right: 50px;

}



/* Wrapper div for content */
.edit-profile-content-wrapper {

    position: absolute;
    display: flex;

    flex-direction: row;


    left: 400px;
    top: 250px;
    padding: 5px;
    height: 100%;
    width: 70%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;

}

.edit-profile-bio-content-container {

    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
    width: 50%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    background-color: #b5b5b5;
}

.edit-profile-subjects-content-container {
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
    width: 50%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    background-color: #b5b5b5;
}


.selectTitleDiv {
    padding: 20px;
}





.edit-profile-content-container label {
    font-size: 1rem;
    font-weight: 500;
    color: #000;
    margin-bottom: 8px;
    /* space between label and input */
}



/* Button styling */
.text-wrapper-2 {
    background-color: rgb(173, 7, 82);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    padding: 15px 32px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: 100%;
    margin-top: 30px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-align: center;
}

/* Button styling */
.text-wrapper-2-disabled {
    background-color: rgb(124, 121, 123);
    color: white;
    font-size: 24px;
    font-weight: 600;
    padding: 15px 32px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: 100%;
    margin-top: 30px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-align: center;
}

.text-wrapper-2:hover {
    background-color: rgb(160, 6, 75);
    transform: scale(1.05);
}

.text-wrapper-2:active {
    background-color: rgb(255, 117, 179);
}

/* edit-profile-footer section */
.edit-profile-footer {
    background-color: #242526;
    height: 100px;
    width: 100%;
    position: relative;
    bottom: 0;
    text-align: center;
    padding: 10px;
}

.edit-profile-footer-text {
    color: #ffffff;
    font-size: .9rem;
    font-weight: 400;
}
</style>