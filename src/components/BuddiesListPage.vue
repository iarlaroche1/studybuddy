<template>
    <div class="home-page-content">
        <div class="home-content-wrapper" style="flex-direction: column;">
            <!-- NOTE most of this is temporary, in final product only fullName should be shown -->
            <!-- would also be neat to make the names clickable links to profile pages, and have an "Add Friend" button beside each -->

            <h1>Find Buddies</h1>
            <li v-for="user in users" :key="user.id">
                <img :src="user.photoURL" width="50" height="50">
                <router-link :to="'/user/' + user.id">{{ user.fullName }}</router-link> TEMPCorrelation: {{ user.correlation }}
                
                <br><div v-if="user.commonSubjects.filter(s => s.priority == 3).length > 0">
                    You both need to study 
                    <span v-for="(subject, index) in user.commonSubjects.filter(s => s.priority == 3)" :key="index">
                        {{ subject.id }}
                        <!-- comma if more than one -->
                        <span v-if="index < user.commonSubjects.filter(s => s.priority == 3).length - 1">, </span>
                    </span>
                </div>

                <div v-if="user.commonSubjects.filter(s => s.priority == 2).length > 0">
                    You both could study 
                    <span v-for="(subject, index) in user.commonSubjects.filter(s => s.priority == 2)" :key="index">
                        {{ subject.id }}
                        <!-- comma if more than one -->
                        <span v-if="index < user.commonSubjects.filter(s => s.priority == 2).length - 1">, </span>
                    </span>
                </div>
                <!-- TEMP: show subjects and priority for each user - simply for the case of checking correlation system -->
                <!--
                <ul>
                    <li v-for="subject in user.subjects" :key="subject.id">
                        {{ subject.id }}, Priority: {{ subject.priority }}
                    </li>
                </ul>
                -->
            </li>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs } from "firebase/firestore";
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
        user1Subjects: []
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
                this.$router.push('/login');
            }
        });

        this.loadUsers();
    },
    methods: {
        async loadUsers() {
            const db = getFirestore(firebaseApp);
            const usersCollectionRef = collection(db, "users");

            const querySnapshot = await getDocs(usersCollectionRef);

            this.users = []; // clear the array before loading
            const currentUser = await getDoc(doc(db, "users", this.username)); 
            if (!querySnapshot.empty) {
                // go thru each user document in users collection
                for (const userDoc of querySnapshot.docs) {
                    if (userDoc.data().year == currentUser.data().year) { // if user is in same year as user logged in
                        let userDocRef = doc(db, "users", userDoc.id);
                        let userData = userDoc.data();
                        
                        let subjectsCollectionRef = collection(userDocRef, "subjects"); 
                        let subjects = await this.getUserSubjects(subjectsCollectionRef);
                        
                        // only run correlation check if user is not user logged in
                        let correlation = await this.getCorrelation(subjects);
                        let commonSubjects = await this.getCommonSubjects(subjects)
                        console.log(userDoc.id);

                        // get profile photo
                        const storage = getStorage();
                        const storageRef = ref(storage, `profileImages/${userDoc.id}`);
                        let photoURL = null;
                        try {
                            photoURL = await getDownloadURL(storageRef);
                        } catch {
                            photoURL = await getDownloadURL(ref(storage, "profileImages/blank.jpg"));
                        }

                        console.log(photoURL);
                        this.users.push({
                            "id": userDoc.id, 
                            "fullName": userData.fullName,
                            "subjects": subjects,
                            "commonSubjects": commonSubjects,
                            "correlation": correlation,
                            "photoURL": photoURL
                        });
                    }

                    // sort based on which correlation is higher
                    this.users.sort((a,b) => (a.correlation > b.correlation) ? -1 : ((b.correlation > a.correlation) ? 1 : 0))
                  }
            }
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
        }
    }
};
</script>