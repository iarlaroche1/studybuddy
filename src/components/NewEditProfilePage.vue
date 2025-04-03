<template>

    <div class="page-container">
        <div class="edit-profile-rightside-container">

        

            <div class="edit-profile-profile-display-top">

                <img class="profile-picture" v-if="url !== '' && url !== null" id="preview" height="100" width="100"
                    :src="url">
                <input type="file" @change="preview" accept="image/*" id="input1">
            
                <div class="edit-profile-username-year">
                    <span>
                        <div class="edit-profile-name-input-container">
                            <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name"
                                class="input-field" />
                        </div>
                        <br>
                        <span>
                            <div class="edit-profile-year-input-container">
                                <select id="year" v-model="year" class="input-field" @change="resetSubjectTable()">
                                    <option disabled value="">Select your year</option>
                                    <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
                                </select>
                            </div>
                        </span>

                    </span>



                </div>
                <div class="edit-profile-edit-button-div">
                    <template v-if="!isUpdating">
                        <button class="edit-profile-button" @click="this.$router.push('../home')">
                            {{ profileUpdated ? 'Return Home' : 'Discard Changes' }}
                        </button>
                        <button class="edit-profile-button" @click="updateUserProfile">
                            Update Profile
                        </button>
                    </template>

                    <div v-else class="edit-profile-loader">
                       
                        <div class="spinner"></div>
                        <span>Saving changes...</span>
                    </div>
                </div>
            </div>






            <div class="edit-profile-content-wrapper">


                <button class="addSubjectButton" @click=addSubject(0) id="addSubject">Add Subject</button>

                <br><br>
                <table id="subjectAdd">
                </table>

                




            </div>


        </div><!--rightside container end-->

    </div>

</template>

<script>
//import { db, auth } from '@/api/firebase'; // Import Firebase services
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc, getDocs, deleteDoc, setDoc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "../api/firebase"; // Import the Firebase app instance
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
    name: "NewEditProfilePage",
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
            url: '',
            profileUpdated: false,
            isUpdating: false

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
            }
        });
    },
    mounted() {
        if (this.$route.path.startsWith('/home/edit')) { // to ensure loadUsers function won't run anywhere else
            this.loadUserProfile().then(() => {
                this.getSubjects();
                console.log("User profile loaded successfully");
            }).catch((error) => {
                console.error("Error loading user profile:", error);
            });
        }
    },
    methods: {
        async loadUserProfile() {
            // get user document from database
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // if it exists then set the locally saved variables to the data in there
                const userData = userDoc.data();
                this.fullName = userData.fullName;
                //this.url = userData.photoURL;
                this.year = userData.year;

                // retrieve the photo URL from Firebase Storage
                const storage = getStorage();
                const storageRef = ref(storage, `profileImages/${this.username}`);
                try {
                    this.url = await getDownloadURL(storageRef); // get the download URL
                } catch (error) {
                    console.error("Error retrieving photo URL:", error);
                    this.url = await await getDownloadURL(ref(storage, "profileImages/blank.jpg")); // default to blank.jpg if no photo exists
                }

                // get user subjects
                const userSubjectsCollectionRef = collection(userDocRef, "subjects");

                const querySnapshot = await getDocs(userSubjectsCollectionRef);
                this.userSubjects = []; // clear the array before loading
                if (!querySnapshot.empty) {
                    for (const userSubjectDoc of querySnapshot.docs) {
                        // get corresponding entry in root/subjects database
                        const subjectDocRef = doc(db, "subjects", userSubjectDoc.id);
                        const subjectDoc = await getDoc(subjectDocRef);

                        // push subject object to array with id, priority and name
                        this.userSubjects.push({ "id": userSubjectDoc.id, "priority": userSubjectDoc.data().priority, "name": subjectDoc.data().name, "optional": subjectDoc.data().optional });
                    }
                }

            } else {
                console.log("No such document!");
            }
        },
        async updateUserProfile() {
            this.isUpdating = true;
            try {
                const file = document.getElementById("input1").files[0];
                if (file) {
                    await this.uploadImage();
                }

                await this.editSubjects();

                const db = getFirestore(firebaseApp);
                const userDocRef = doc(db, "users", this.username);

                // dynamically construct the update object (to avoid potential file overwrite)
                const updateData = {};
                if (this.user.email) updateData.email = this.user.email;
                if (this.fullName) updateData.fullName = this.fullName;
                if (this.year) updateData.year = this.year;
                if (this.bio) updateData.bio = this.bio;

                // update the user document without overwriting other fields
                await setDoc(userDocRef, updateData, { merge: true });


                this.profileUpdated = true;
                this.$router.push('/home');
                console.log('Profile updated successfully');
            } catch (error) {
                console.error("Error updating profile:", error);
            } finally {
                this.isUpdating = false;
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
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        },

        async editSubjects() {
            const db = getFirestore(firebaseApp);
            const userDocRef = doc(db, "users", this.username);

            const userSubjectsCollectionRef = collection(userDocRef, "subjects");

            // empty current subjects list: delete subjects subcollection of user
            try {
                const querySnapshot = await getDocs(userSubjectsCollectionRef);
                if (!querySnapshot.empty) {
                    for (const userSubjectDoc of querySnapshot.docs) {
                        const docRef = doc(userSubjectsCollectionRef, userSubjectDoc.id); // Reference to the document
                        await deleteDoc(docRef); // Delete the document
                    }
                }
            } catch (error) {
                console.error("Error deleting collection:", error);
            }

            // then add subjects again
            var table = document.getElementById("subjectAdd");

            for (var i = 0; i < table.rows.length; i++) {
                var course = document.getElementsByClassName("course")[i].value;
                var priority = Number(document.getElementsByClassName("priority")[i].value);

                const subjectsDocRef = doc(collection(userDocRef, "subjects"), course);
                await setDoc(subjectsDocRef, { priority });
            }
        },

        async getSubjects() {
            const db = getFirestore(firebaseApp);

            const subjectsCollectionRef = collection(db, "subjects");
            const querySnapshot = await getDocs(subjectsCollectionRef);

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    this.subjects.push({
                        "id": doc.id,
                        "name": doc.data().name,
                        "optional": doc.data().optional,
                        "year": doc.data().year
                    });
                });
            }

            // populate list with each user subject
            // first non-optional, then optional
            this.userSubjects.forEach(subject => {
                if (!subject.optional) {
                    console.log(subject.id);
                    this.addSubject(subject);
                }
            });
            this.userSubjects.forEach(subject => {
                if (subject.optional) {
                    console.log(subject.id);
                    this.addSubject(subject);
                }
            });
        },

        addSubject(subject) {
            // get table and create new row
            var table = document.getElementById("subjectAdd");
            var row = document.createElement("tr");

            // create the first cell for the course
            var courseCell = document.createElement("td");
            var courseName;

            // create third cell for delete button (if applicable)
            var deleteCell = document.createElement("td");
            var deleteButton;

            if (subject == 0 || subject.optional == true) { // if subject == 0, that means user is adding an optional subject and a dropdown subject is needed  
                // create course input field
                courseName = document.createElement("select");
                courseName.className = "course";

                // create default option selection
                const defaultOption = document.createElement("option");
                defaultOption.value = subject.id || ""; // subject id or blank if none provided
                defaultOption.text = subject.name || "Select a subject"; // subject name or "Select a subject" if none provided
                courseName.appendChild(defaultOption);

                // for each optional subject in that year, create an option for it
                this.subjects.forEach(subjectOption => {
                    if (subjectOption.optional == true && subjectOption.year == this.year && subject.id != subjectOption.id) {
                        let option = document.createElement("option");

                        option.value = subjectOption.id;
                        option.text = subjectOption.name;
                        courseName.appendChild(option);
                    }
                });

                // create delete button
                deleteButton = document.createElement("button");
                deleteButton.innerHTML = "Delete";
                deleteButton.addEventListener("click", () => {
                    table.removeChild(row);
                });

            } else { // function has been passed by getSubjects with a parameter, we simply print out the subject name
                // create text element with course name
                courseName = document.createElement("div");
                courseName.className = "course";
                courseName.value = subject.id;
                courseName.style.textAlign = "left"; // align text to the left
                courseName.innerHTML = subject.name;

                deleteButton = document.createElement("p")
            }
            // append first cell
            courseCell.appendChild(courseName);
            row.appendChild(courseCell);

            // create the second cell for the priority slider
            var priorityCell = document.createElement("td");
            var priorityInput = document.createElement("input");
            priorityInput.type = "range";
            priorityInput.min = "1";
            priorityInput.max = "3";
            priorityInput.value = subject.priority || "2"; // if no priority provided, default to 2
            priorityInput.className = "priority";

            priorityCell.appendChild(priorityInput);
            row.appendChild(priorityCell);

            // append third cell
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            // add row to table
            table.appendChild(row);
        },

        resetSubjectTable() {
            const table = document.getElementById("subjectAdd");
            // clear table
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }

            // call addSubject for each subject
            this.subjects.forEach(subject => {
                if (subject.optional == false && subject.year == this.year) {
                    console.log(subject.id);
                    this.addSubject(subject);
                }
            });
        }
    }
};
</script>


<style scoped>
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


.edit-profile-button {
  background-color: rgb(173, 7, 82);
  color: white;
  padding: 1px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
#subjectAdd tr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

#subjectAdd td {
    flex: 1;
    padding: 0 5px;
}

/* Style for priority slider */
#subjectAdd input[type="range"] {
    width: 100%;
}

/* Style for the add subject button */
.addSubjectButton {
    position: relative; /* Change from absolute */
    width: 100px;
    height: 100px;
    margin: 10px 0;
    padding: 8px 15px;
    background-color: rgb(66, 58, 62);
    color: white;
    border: none;
    cursor: pointer;
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

.edit-profile-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 3px solid #ad0752;
    width: 20px;
    height: 20px;
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


.input-field {
  width: 80%; /* Make the input field wider */
  padding: 10px; /* Add padding for better usability */
  font-size: 1rem; /* Ensure the text is readable */
  border: 1px solid #ccc; /* Add a subtle border */
  border-radius: 4px; /* Slightly round the corners */
  box-sizing: border-box; /* Include padding in width calculation */
}

.edit-profile-name-input-container,
.edit-profile-year-input-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Take full width of the container */
  margin: 10px 0; /* Add spacing between fields */
}

.edit-profile-year-input-container select {
  width: 80%; /* Ensure the dropdown is wide enough */
  padding: 10px; /* Add padding for better usability */
  font-size: 1rem; /* Ensure the selected year is visible */
  height: auto; /* Adjust height to fit content */
  border: 1px solid #ccc; /* Add a subtle border */
  border-radius: 4px; /* Slightly round the corners */
  box-sizing: border-box; /* Include padding in width calculation */
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

.profile-picture {
    height: 80px;
    width: 80px;



    outline-color: #000;
    outline-style: solid;
    outline-width: 1px;
    padding: 2px;

}

.edit-profile-name-input-container {
    display: flex;
    max-height: 8px;
    height: 1px;
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
    overflow-y: auto; /* Add scroll when content overflows */
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
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* Changed from center to flex-start */
    /* Remove fixed height */
    height: auto;
    max-height: 100%;
    width: 100%;
    overflow-y: auto; /* Add scroll if needed */
    padding: 10px;
    box-sizing: border-box;
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