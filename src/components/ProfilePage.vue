<!-- 
 TODO - display profile of the user passed by vue router, in same format as homepage
if user does not exist it should display 404, if user is the user logged in go to homepage
-->

<template>

    <div class="page-container">

        
        <img class="home-header-image" alt="Header" :src="header" />

        <div class="side-navbar-container">
            <!-- Header image -->
            <nav class="side-navbar">
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

        <div class="rightside-container">

            <div class="home-header">
               <div><h1 class="title">Study Buddy Finder: Home</h1></div>
            </div>

            <div class="profile-display-top">

                <img class="profile-picture" alt="ProfilePic" :src=url />


                <div class="username-year"><span id="name">Name: {{ fullName }}<br><span id="year">Year: {{ year }}</span></span></div>
                
                <!-- TODO add friend -->
                <div class="edit-button-div"><span><button class="edit-profile-button" @click=handleEditProfile>Add Friend</button></span></div>
                
            </div>




            <div class="home-content-wrapper">


                <div class="bio-content-container">

                    <h1>Bio</h1>
                    <p> {{ bio }} </p>

                </div>


                <div class="subjects-content-container">
                    
                    <h1>Subjects</h1>
                    <h4>Needs to Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 3)" :key=subject.id>
                        {{ subject.name }}
                    </li>
                    <h4>Could Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 2)" :key=subject.id>
                        {{ subject.name }}
                    </li>
                    <h4>Doesn't Need to Study</h4>
                    <li v-for="subject in subjects.filter(s => s.priority == 1)" :key=subject.id>
                        {{ subject.name }}
                    </li>

                </div>
            </div>
        </div><!--rightside container end-->


        <div class="home-footer">
            <div class="home-footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>
        </div>
    </div>

</template>

<script>
//import { db, auth } from '@/api/firebase'; // Import Firebase services
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, collection,  getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance

export default {
    name: "HomePage",
    data() {
        return {
            header: require('@/assets/header.jpg'),
            jackiechan: require('@/assets/jackiechan.jpg'),
            fullName: '',
            bio: '',
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
                this.username = this.$route.params.id; // Extract username from email
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
                this.year = userData.year;
                this.bio = userData.bio;

                // retrieve the photo URL from Firebase Storage
                const storage = getStorage();
                const storageRef = ref(storage, `profileImages/${this.username}`);
                try {
                    this.url = await getDownloadURL(storageRef); // get the download URL
                } catch (error) {
                console.error("Error retrieving photo URL:", error);
                this.url = await await getDownloadURL(ref(storage, "profileImages/blank.jpg")); // default to blank.jpg if no photo exists
                }

                // list subjects
                const userSubjectsCollectionRef = collection(userDocRef, "subjects");

                const querySnapshot = await getDocs(userSubjectsCollectionRef);
                this.subjects = []; // clear the array before loading
                if (!querySnapshot.empty) {
                    for (const userSubjectDoc of querySnapshot.docs) {
                        // get corresponding entry in root/subjects database
                        const subjectDocRef = doc(db, "subjects", userSubjectDoc.id);
                        const subjectDoc = await getDoc(subjectDocRef);

                        // push subject object to array with id, priority and name
                        this.subjects.push({"id": userSubjectDoc.id, "priority": userSubjectDoc.data().priority, "name": subjectDoc.data().name});
                    }
                }



            } else {
                console.log("No such document!");
            }
        },
        handleEditProfile() {
            this.$router.push('/neweditprofile');
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
.home-header-image {

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

.rightside-container {

    display: flex;
    flex-direction: row;
    
    flex-wrap: wrap;
   
   width: 70px;
   
 
    

}

.side-navbar-container {
    position: relative;
    float: left;
    top: 80px;
    width: 30px;
    display: flex;
    flex-direction: column;
    
}

.side-navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 400px;
    overflow: hidden;
    background-color: rgb(173, 7, 82);
}

.side-navbar a {
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

.side-navbar a:hover {
    background-color: rgb(182, 50, 109);

}

.home-header {
    position: absolute;
    top: 0;
    left: 570px;
    width: 40%;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 140px;
  
   

}
.title {
    left: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 140px;
  
   

}

.profile-display-top {
    position: absolute;
    display: flex;
    
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    left: 400px;
    top:140px;
    padding: 5px;
    height: 100px;
    width: 70%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
}

.profile-picture {
    height: 80px;
    width:80px;
   
  
   
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    padding: 2px;
   
}

.username {
    max-height: 80px;
    
  
   
    height: auto;

    border-radius: 0px;
 
    padding: 2px;
    
}
.name {
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



.edit-button-div {
    max-height: 100px;

    height: auto;
   
    border-radius: 0px;
   
    padding-right: 50px;
   
}



/* Wrapper div for content */
.home-content-wrapper {

    position: absolute;
    display: flex;
    
    flex-direction: row;
   
    
    left: 400px;
    top:250px;
    padding: 5px;
    height: 100%;
    width: 70%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;

}

.bio-content-container {
    
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    height: 100%;
    width: 50%;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    background-color: #b5b5b5;
}

.subjects-content-container {
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
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





.home-content-container label {
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

/* home-footer section */
.home-footer {
    background-color: #242526;
    height: 100px;
    width: 100%;
    position: relative;
    bottom: 0;
    text-align: center;
    padding: 10px;
}

.home-footer-text {
    color: #ffffff;
    font-size: .9rem;
    font-weight: 400;
}
</style>