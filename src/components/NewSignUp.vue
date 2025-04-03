<template>
    <div class="home-page-content">
      
  
      <div class="profile-display-top">
       
        
        <div class="log-in-text-container">
                    <p class="log-in-text">Sign Up To Get Started!</p>
                </div>
        
        
            <div class="input-container">
          <label for="full-name">Full Name:</label>
          <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name" class="input-field" />
        </div>

        <div class="input-container">
          <label for="email">Email:</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your university email"
            class="input-field" />
        </div>

                <!-- Password input field section -->
        <div class="input-container">
          <label for="password">Password:</label>
          <input id="password" v-model="password" type="password" placeholder="Enter a password" class="input-field" />
        </div>

        <!-- Confirm password section -->
        <div class="input-container">
          <label for="confirm-password">Confirm Password:</label>
          <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Re-enter your password"
            class="input-field" />
        </div>
        <p class="login-prompt">
          <router-link to="/login">Already have an account? Login here</router-link>

        </p>

        <!-- Log-in button wrapper -->
        <div class="log-in-button-wrapper">
            <button class="log-in-button" @click="createUser">Sign Up</button>   
        </div>

      </div>
  
    </div>
  </template>
  
  <script>
import app from '../api/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  name: "NewSignUpPage",
  data() {
    return {
      header: require('@/assets/header.jpg'),
      id: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    async createUser(){
        const auth = getAuth(app);
      // todo alert user if email is invalid
        // Sign-in logic here
        if (this.password !== this.confirmPassword) {
                alert("Passwords do not match!")
                return;
        }

        createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        var id = this.email.split('@')[0];
        console.log(user);

        const functions = getFunctions(app); 
        const createUser = httpsCallable(functions, 'createUser'); 
        const result = createUser(
            {
                "id":id,
                "email":this.email,
                "fullName":this.fullName
            });
          console.log(result);
          this.$router.push('/NewEditProfilePage');
        })
        
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
  
  .profile-display-top {
    left: 43%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for a modern look */
    width: 100%;
    max-width: 400px; /* Limit the width for better readability */
  }
  
  .log-in-text-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .log-in-text {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    line-height: 1.4;
  }
  
  .input-container {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .input-container label {
    font-size: 16px;
    font-weight: 500;
    color: #555;
    margin-bottom: 8px;
    display: block; /* Ensure the label is above the input */
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
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
    margin-top: 10px;
  }
  
  .log-in-button {
    background-color: rgb(173, 7, 82);
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
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
    font-size: 14px;
    text-align: center;
    color: #555;
    margin-top: 20px;
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