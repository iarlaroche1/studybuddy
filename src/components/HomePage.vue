<template>



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


    </div>
    <div class="home-header">
       <h1>Study Buddy</h1>
    </div>
    <div class="profile-display-top">

        <img class="profile-picture" alt="ProfilePic" :src=url />
        <div class="username"><span>Name: {{ fullName }}</span></div>
        <div class="year"><span>Year: {{ year }}</span></div>
        <button class="edit-profile-button" @click=handleEditProfile>Edit Profile</button>
    </div>

    <!-- Main container for the page -->
    <div class="home-page-container">


        <!-- Wrapper div for the content and header image -->


        <div class="home-content-wrapper">


            <div class="left-container">


                


                <!-- input field section -->
                <div class="bio-content-container">

                    <h1>Bio</h1>
                    <p>Mister Study man, cant do integrals , currently studying Calculus.</p>

                </div>
                <!-- input field section -->
                <div class="subjects-content-container">
                    <h1>Subjects</h1>
                    <p>TODO: dynamically display modules</p>


                </div>

            </div>



        </div>
    </div>
    <div class="home-footer">
        <div class="home-footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>

    </div>
</template>

<script>
//import { db, auth } from '@/api/firebase'; // Import Firebase services
//import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc,  getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance

export default {
  name: "HomePage",
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
                this.fullName = userData.fullName;
                this.url = userData.photoURL;
                this.year = userData.year;
            } else {
                console.log("No such document!");
            }
        },
        handleEditProfile(){
            this.$router.push('/ProfileTestPage');
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

/* Header image */
.home-header-image {

    max-height: auto;
    /* 30% of the viewport height */
    object-fit: fill;
    border-radius: 0px;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;

    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: 150px;
}

.side-navbar-container {
    position: relative;
    float: left;
    top: 80px;
    width: 30%;
    ;
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
.profile-picture {
    max-height: 100px;
    /* 30% of the viewport height */

    border-radius: 0px;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;

    position: relative;
}
.home-header {
    position: relative;
    top:0;
    left:30px;
    padding:5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    height:auto;
    width:auto;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    
}
.profile-display-top {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    left:30px;
    padding:5px;
    height:auto;
    width: auto;
    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
}
/* Main container for the page */
.home-page-container {
    /*background-color: #cccccc;*/
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70;
    min-height: 100vh;
    padding: 0px;
    position: relative;
    left: 30px;
}


/* Wrapper div for content */
.home-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Aligns form container vertically */
    align-items: left;
    /* Aligns form container horizontally */
    background-color: #cccccc;
    width: 100%;
    max-width: 100%;
    /* Limit the max width */
    padding: 20px;


    position: relative;
    top: 0;

}



/* academic form container */
.left-container {
    background-color: #fff6f6;
    border-radius: 3px;
    width: 50%;
    max-width: 100%;
    /* Max width of the form */
    padding: 30px;
    min-height: auto;
    box-sizing: border-box;
    margin-top: 0px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

}

/* academic text */
.text-container {
    text-align: center;
    margin-bottom: auto;

}

.bio-content-container{
    position: relative;
    left:0px;
    height:auto;
}

.subject-content-container{
    position: relative;
    left:0px;
    height:auto;
}

.academic-text {
    font-size: 1rem;
    font-weight: 600;
    color: #000;
    line-height: 1.4;
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
    font-size: .5rem;
    font-weight: 400;
}
</style>