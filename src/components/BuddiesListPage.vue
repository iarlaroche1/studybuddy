<template>
    <div >
        
        <!-- NOTE most of this is temporary, in final product only fullName should be shown -->
         <!-- would also be neat to make the names clickable links to profile pages, and have an "Add Friend" button beside each -->
        <li v-for="user in users" :key="user.id">
            <router-link :to="'/user/' + user.id">{{ user.fullName }}</router-link> Correlation: {{ user.correlation }}
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
                        console.log(userDoc.id);

                        this.users.push({
                            "id": userDoc.id, 
                            "fullName": userData.fullName,
                            "subjects": subjects,
                            "correlation": correlation
                        });
                    }
                  }
            }

            // sort based on which correlation is higher
            this.users.sort((a,b) => (a.correlation > b.correlation) ? -1 : ((b.correlation > a.correlation) ? 1 : 0))
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
        }
    }
};
</script>
