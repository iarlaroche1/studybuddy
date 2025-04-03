<template>
    <div class="home-page-content">
      <!-- Title -->
      <h1 class="home-title">Study Buddy Finder</h1>

      <!-- Login Box -->
      <div class="profile-display-top">
        <div class="log-in-text-container">
          <p class="log-in-text">Please Log in!</p>
          <p class="login-prompt">
            <router-link to="/newsignup">Don't have an account? Sign up here!</router-link>
          </p>
        </div>

        <!-- Email input field section -->
        <div class="input-container">
          <label for="email">Email:</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your university email" class="input-field" />
        </div>

        <!-- Password input field section -->
        <div class="input-container">
          <label for="password">Password:</label>
          <input id="password" v-model="password" type="password" placeholder="Enter a password" class="input-field" />
        </div>

        <!-- Log-in button wrapper -->
        <div class="log-in-button-wrapper">
          <button class="log-in-button" @click="handleLogIn">Log In</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import app from "../api/firebase"
  import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
      name: "NewLoginPage",
      data() {
          return {
              header: require('@/assets/header.jpg'),
              fullName: '',
              email: '',
              password: '',
              confirmPassword: ''
          };
      },
      created() {
        const auth = getAuth(app); // Use the Firebase app instance
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.username = user.email.split('@')[0]; // Extract username from email
                this.fullName = user.displayName || this.username; // Use displayName or fallback to username
                this.$router.push('/home');
            }
          });
      },
      methods: {
          handleLogIn() {
            
              const auth = getAuth(app);
              signInWithEmailAndPassword(auth, this.email, this.password).then((userCredential) => {
              // Signed in
              let user = userCredential.user;
              
              console.log(user);

              
              // Programmatically navigate to "/buddyfinder" route after successful login
              
              this.$router.push('/home');
              window.location.reload();
             
              }).catch((error) => {
              let errorCode = error.code;
              let errorMessage = error.message;
              console.log(errorCode)
              console.log(errorMessage)
              });
          }
      }
  };
  </script>
  
  <style scoped>
  
  
  .home-page-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content horizontally */
    justify-content: center; /* Center content vertically */
    height: 100vh; /* Full height of the viewport */
    background-color: #f9f9f9; /* Light background color */
  }
  
  .home-title {
    font-size: 2rem; /* 32px */
    font-weight: 700;
    color: #333;
    margin-bottom: 1.5rem; /* 24px */
    text-align: center;
  }
  
  .profile-display-top {
    left: 43%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem; /* 20px */
    padding: 1.25rem; /* 20px */
    background: white;
    border-radius: 0.5rem; /* 8px */
    box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1); /* 4px 6px */
    width: 100%;
    max-width: 25rem; /* 400px */
  }
  
  .log-in-text-container {
    text-align: center;
    margin-bottom: 1.25rem; /* 20px */
  }
  
  .log-in-text {
    font-size: 1.75rem; /* 28px */
    font-weight: 700;
    color: #333;
    line-height: 1.4;
    margin-bottom: 0.625rem; /* 10px */
  }
  
  .input-container {
    width: 100%;
    margin-bottom: 0.625rem; /* 10px */
  }
  
  .input-container label {
    font-size: 1rem; /* 16px */
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem; /* 8px */
    display: block; /* Ensure the label is above the input */
  }
  
  .input-field {
    width: 100%;
    padding: 0.625rem; /* 10px */
    font-size: 0.875rem; /* 14px */
    border: 1px solid #ddd;
    border-radius: 0.25rem; /* 4px */
    box-sizing: border-box;
    transition: border-color 0.3s;
  }
  
  .input-field:focus {
    border-color: rgb(173, 7, 82); /* Highlight border on focus */
    outline: none;
  }
  
  .log-in-button-wrapper {
    display: flex;
    justify-content: center;
  }
  
  .log-in-button {
    background-color: rgb(173, 7, 82);
    color: white;
    font-size: 1rem; /* 16px */
    font-weight: 600;
    padding: 0.625rem 1.25rem; /* 10px 20px */
    border: none;
    border-radius: 0.25rem; /* 4px */
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .log-in-button:hover {
    background-color: rgb(160, 6, 75);
    transform: scale(1.05); /* Slight zoom effect on hover */
  }
  
  .log-in-button:active {
    transform: scale(0.95); /* Slight shrink effect on click */
  }
  
  .login-prompt {
    font-size: 0.875rem; /* 14px */
    color: #555;
    margin-top: 0; /* Remove extra spacing above the text */
  }
  
  .login-prompt a {
    color: rgb(173, 7, 82);
    text-decoration: none;
    font-weight: 600;
  }
  
  .login-prompt a:hover {
    text-decoration: underline;
  }
  </style>