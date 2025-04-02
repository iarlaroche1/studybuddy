<template>
    <div class="home-page-content">
      
  
      <div class="profile-display-top">
       
        
        <div class="log-in-text-container">
                    <p class="log-in-text">Please Log in!</p>
                </div>
        
         <!-- Email input field section -->
         <div class="input-container">
                    <label for="email">Email:</label>
                    <input id="email" v-model="email" type="email" placeholder="Enter your university email"
                        class="input-field" />
                </div>

                <!-- Password input field section -->
                <div class="input-container">
                    <label for="password">Password:</label>
                    <input id="password" v-model="password" type="password" placeholder="Enter a password"
                        class="input-field" />
                </div>
                <!-- In the login page template -->
                <p class="login-prompt">
                    <router-link to="/signup">Don't have an account? Sign up here</router-link>
                   
                </p>
                <!-- Log-in button wrapper -->
                <div class="log-in-button-wrapper">
                    <button class="log-in-button" @click="handleLogIn">Log In</button>
                </div>

      </div>
  
    </div>
  </template>
  
  <script>
  import app from "../api/firebase"
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  
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
      methods: {
          handleLogIn() {
              const auth = getAuth(app);
              signInWithEmailAndPassword(auth, this.email, this.password).then((userCredential) => {
              // Signed in
              let user = userCredential.user;
              console.log(user);
              
              // Programmatically navigate to "/buddyfinder" route after successful login
              this.$router.push('/HomePage');
              
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
    height: auto;
    min-width: 100%;
    width:10%;
    
  }
  
  .home-content-wrapper {
    display: flex;
    gap: 20px;
    flex: 1;
    min-height: 0;
    height: auto;
  }
  
  .bio-content-container,
  .subjects-content-container {
    flex: 1;
    padding: 15px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
   
    min-height: 0;
    height:auto;
   
  }
  
  
  .home-header {
    margin-bottom: 20px;
  }
  
  .profile-display-top {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 20px;
    padding: 10px;
  
  }
  
  .profile-picture {
    height: 80px;
    width: 80px;
    border: 1px solid #000;
    padding: 2px;
  }
  
  .username-year {
    flex-grow: 1;
  }
  
  .edit-button-div {
    margin-left: auto;
  }
  
  .home-content-wrapper {
    display: flex;
    gap: 20px;
  }
  
  
  
  
  .priority-group {
    margin-bottom: 15px;
    padding: 5px;
  
    height: auto; /* Let content determine height */
  }
  .priority-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .subject-item {
    margin-left: 20px;
    padding: 5px 0;
  }
  
  .empty-message {
    color: #666;
    font-style: italic;
    margin-left: 20px;
  }
  
  .edit-profile-button {
    background-color: rgb(173, 7, 82);
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .edit-profile-button:hover {
    background-color: rgb(160, 6, 75);
  }
  
  .home-footer{
    background-color: #242526;
    height: 100px;
    width: 100%;
    position: relative;
    bottom: 0;
    text-align: center;
  }
  @media (orientation: portrait) {
  }
  </style>