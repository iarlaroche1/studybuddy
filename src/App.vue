<template>
  <Suspense>
    <template #default>
      <div v-if="!loading" id="app">
        <div class="home-header">
          <h1 class="title">Study Buddy Finder</h1>
        </div>

        <div class="page-container">
          <div class="side-navbar-container">
            <!-- Header image with link to homepage -->
            <router-link to="/home">
              <img class="home-header-image" alt="Header" :src="header" />
            </router-link>

            <nav class="side-navbar">
              <ul>
                <li><router-link to="/buddies">Buddies</router-link></li>
                <li><router-link to="/chat">Chat</router-link></li>
                <li><router-link to="/home">Home</router-link></li>
                <li><a href="">-</a></li>
                <li><a href="">-</a></li>
                
                
                <li class="side-navbar-item logged-in-container" v-if="user">
                  <div class="logged-in-wrapper">
                    <span class="loggedInText">Logged in as {{ fullName }}</span>
                    <span class="sign-out-link" @click="handleSignOut">Sign Out</span>
                  </div>
                </li>
                <li class="side-navbar-item logged-in-container" v-else>
                  <div class="logged-in-wrapper">
                    <span class="loggedInText">Not logged in</span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Dynamic content area -->
          <div class="rightside-container">
            <router-view />
          </div>
        </div>
      </div>
    </template>

    <template #fallback>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    </template>
  </Suspense>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./api/firebase"; // Import the Firebase app instance

export default {
  name: "App",
  data() {
    return {
      header: require("@/assets/header.jpg"),
      user: null, // Initialize as null
      username: "",
      fullName: "",
      loading: true, // Add a loading state
    };
  },
  created() {
    const auth = getAuth(firebaseApp); // Use the Firebase app instance
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.username = user.email ? user.email.split("@")[0] : "Unknown"; // Safely extract username
        this.fullName = user.displayName || this.username; // Use displayName or fallback to username
      } else {
        console.log("No user is signed in");
        this.user = null;
        this.username = "";
        this.fullName = "";
        this.$router.push("/login"); // Redirect to login if no user is signed in
      }
      this.loading = false; // Set loading to false after auth state is resolved
    });
  },
  methods: {
    handleSignOut() {
      const auth = getAuth(firebaseApp);
      auth
        .signOut()
        .then(() => {
          this.user = null;
          this.username = "";
          this.fullName = "";
          console.log("User signed out");
          
          this.$router.push("/login"); // Redirect to login page after sign out
          
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    },
  },
};
</script>

<style scoped>

.full-page-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 10px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid rgb(173, 7, 82); /* Spinner color */
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.side-navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 28%; /* Flexible width */
  min-width: 20%; /* Minimum width before collapsing */
  height: 100vh; /* Full viewport height */
  overflow-y: auto; /* Enable scrolling if content exceeds height */
  background-color: rgb(173, 7, 82); /* Match the sidebar background */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.side-navbar {
  flex: 1; /* Allow the navbar to take up remaining space */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable scrolling for the navbar content */
}

.side-navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgb(173, 7, 82);
  width: 100%;
  background-color: rgb(173, 7, 82);
}
.sign-out-button {
  background-color: rgb(173, 7, 82);
  color: white;
  border: none;
  padding: 11px 20px;
  padding-left: 50px;
  cursor: pointer;
  font-size: 1rem;
}

.side-navbar a:hover {
  background-color: rgb(182, 50, 109);
}

.home-footer {
  background-color: #242526;
  height: 100px;
  width: 100%;
  position: relative;
  bottom: 0;
  text-align: center;
  padding: 0px;
}

.home-footer-text {
  color: #ffffff;
  font-size: .9rem;
  font-weight: 400;
}

.page-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
}

.home-header-image {
  border-radius: 0px;
  position: relative;
  top: 0px;
  left: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.loggedInText {
  color: white;
  font-size: 1rem;
  padding-left: 10%;
  text-align: left;
  min-height: 10px;
  max-height: auto;
}

.side-navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgb(173, 7, 82);
  width: 100%;
  background-color: rgb(173, 7, 82);
}

.side-navbar a {
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

.rightside-container {
  flex: 1; /* Takes remaining space */
  padding: 20px;
  min-width: 0px;
  max-width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box; /* Include padding in width calculations */
}

.home-footer {
  background-color: #242526;
  height: 100px;
  width: 100%;
  position: relative;
  bottom: 0;
  text-align: center;
  padding: 0px;
}

.home-footer-text {
  color: #ffffff;
  font-size: .9rem;
  font-weight: 400;
}

.logged-in-container {
  margin-top: auto; /* Push the "Logged in as" section to the bottom */
  padding: 15px;
  background-color: #f5f5f5; /* Light background for contrast */
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Subtle divider */
}

.logged-in-wrapper {
  display: flex;
  flex-direction: column; /* Stack the text and button vertically */
  align-items: center; /* Center-align the content */
  gap: 10px; /* Add spacing between the text and button */
  padding: 15px; /* Add padding for a card-like feel */
  background-color: #f5f5f5; /* Light background for contrast */
  border: 1px solid #ddd; /* Subtle border */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a slight shadow */
  text-align: center; /* Center-align the text */
}

.loggedInText {
  font-size: 1rem;
  font-weight: bold;
  color: #333; /* Darker text for contrast */
}

.sign-out-link {
  font-size: 0.9rem;
  color: rgb(173, 7, 82); /* Primary color for the link */
  cursor: pointer;
  text-decoration: none; /* Remove underline */
  transition: color 0.3s ease, transform 0.2s ease; /* Smooth hover effect */
}

.sign-out-link:hover {
  color: rgb(150, 6, 75); /* Darker shade on hover */
  transform: scale(1.05); /* Slightly enlarge on hover */
}

@media (orientation: portrait) {
  .page-container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    height: 100vh; /* Full height of the viewport */
    box-sizing: border-box;
  }

  .home-header-image {
    border-radius: 0px;
    position: relative;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .side-navbar-container {
    position: fixed;
    float: left;
    top: 0px;
    display: flex;
    flex-direction: column;
    width: 28%; /* Flexible width */
    min-width: 20%; /* Minimum width before collapsing */
  }

  .home-header-image {
    border-radius: 0px;
    position: relative;
    top: 0px;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .side-navbar {
    position: relative;
    float: left;
    top: 30%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .side-navbar ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background: rgb(173, 7, 82);
    width: 100%;
    background-color: rgb(173, 7, 82);
  }

  .side-navbar a {
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

  .rightside-container {
    padding: 20px;
    width: 10%;
    box-sizing: border-box;
    margin-bottom: 60px; /* Add space above the navbar to prevent overlap */
  }
}

@media (orientation: portrait) {
  .page-container {
    display: flex;
    flex-direction: column; /* Stack content vertically */
    width: 100%;
    height: 100vh; /* Full height of the viewport */
    box-sizing: border-box;
    overflow: hidden; /* Prevent scrolling of the entire page */
  }

  .side-navbar-container {
    position: fixed; /* Fix the navbar to the viewport */
    bottom: 0; /* Stick to the bottom of the screen */
    left: 0; /* Align to the left edge */
    width: 100%; /* Full width of the screen */
    height: 60px; /* Adjust height as needed */
    background-color: rgb(173, 7, 82); /* Navbar background color */
    display: flex;
    flex-direction: row; /* Horizontal layout for navbar items */
    justify-content: space-around; /* Space out navbar items evenly */
    align-items: center; /* Center items vertically */
    z-index: 10; /* Ensure it stays above other content */
  }

  .side-navbar {
    width: 100%; /* Full width for the navbar */
    display: flex;
    flex-direction: row; /* Make the navbar horizontal */
    justify-content: space-around; /* Space out items evenly */
    align-items: center; /* Center items vertically */
  }

  .side-navbar ul {
    display: flex; /* Make the list horizontal */
    flex-direction: row; /* Align list items in a row */
    padding: 0;
    margin: 0;
    list-style: none; /* Remove default list styling */
    width: 100%; /* Full width of the navbar */
    justify-content: space-around; /* Space out list items evenly */
  }

  .side-navbar li {
    flex: 1; /* Distribute list items evenly */
    text-align: center; /* Center text inside each item */
  }

  .side-navbar a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    padding: 10px;
    text-align: center;
    display: block;
    width: 100%; /* Ensure links take full width of their container */
  }

  .side-navbar a:hover {
    background-color: rgb(182, 50, 109); /* Hover effect */
  }

  .rightside-container {
    flex: 1; /* Take up remaining space above the navbar */
    padding: 20px;
    overflow-y: auto; /* Allow vertical scrolling if content overflows */
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 60px; /* Add space above the navbar to prevent overlap */
  }
}
</style>