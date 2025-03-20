<template>
    

    <div class="pos-f-t">
  <div class="collapse" id="navbarToggleExternalContent">
    <div class="bg-custom p-4">
      <h5 class="text-white h4">Collapsed content</h5>
      <span class="text-muted">Toggleable via the navbar brand.</span>
    </div>
  </div>
  <nav class="navbar navbar-dark bg-custom">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
</div>

    <!-- Main container for the page -->
    <div class="main-container">

        <!-- Wrapper div for the content and header image -->
        <div class="content-wrapper">

            <!-- Header image -->
            <img class="header-image" alt="Header" :src="header" />

            <!-- Sign-in form container -->
            <div class="log-in-form-container">

                <!-- Section containing the text prompting the user to sign-in -->
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



                <!-- Text prompting users to log in if they already have an account, using vue router-->

                <!-- In the login page template -->
                <p class="login-prompt">
                    <router-link to="/signup">Don't have an account? Sign up here</router-link>
                    <br>
                    <router-link to="/signup">Reset Password *****TODO</router-link>
                </p>
                
               

                <!-- Log-in button wrapper -->
                <div class="log-in-button-wrapper">
                    <button class="log-in-button" @click="handleLogIn">Log In</button>
                </div>

            </div>

            <!-- Footer section with text and small image -->
            <div class="footer">
                <div class="footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>
                
            </div>

        </div>
    </div>
</template>

<script>
import app from "../api/firebase"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
    name: "LoginPage",
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
            this.$router.push('/buddyfinder');
            
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

<style>

/* Change the background color of the navbar */
.pos-f-t {
  background-color: rgb(173, 7, 82); /* Change this color to your preferred color */
}
/* Main container for the page */
.main-container {
    /*background-color: #cccccc;*/
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    position: relative;
}


/* Wrapper div for content */
.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Aligns form container vertically */
    align-items: center;
    /* Aligns form container horizontally */
    background-color: #cccccc;
    width: 100%;
    max-width: 1200px;
    /* Limit the max width */
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    margin-top: 20px;
}

/* Header image */
.header-image {
    width: auto;
    max-height: 30vh;
    /* 30% of the viewport height */
    object-fit: fill;
    border-radius: 10px;
}

/* Log-in form container */
.log-in-form-container {
    background-color: #fff6f6;
    border-radius: 30px;
    width: 100%;
    max-width: 600px;
    /* Max width of the form */
    padding: 30px;
    box-sizing: border-box;
    margin-top: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Log-in text */
.log-in-text-container {
    text-align: center;
    margin-bottom: 20px;
}

.log-in-text {
    font-size: 32px;
    font-weight: 600;
    color: #000;
    line-height: 1.4;
}



.input-container label {
    font-size: 18px;
    font-weight: 500;
    color: #000;
    margin-bottom: 8px;
    /* space between label and input */
}

/* Input field styles */
.input-field {
    background-color: #fff6f6;
    border: 1.53px solid #292929;
    border-radius: 27.51px;
    width: 100%;
    padding: 15px;
    font-size: 18px;
    margin-top: 5px;
    /* small space between label and input */
    box-sizing: border-box;
    transition: all 0.3s ease;
}

/* Button styling */
.log-in-button {
    background-color: rgb(173, 7, 82);
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

.log-in-button:hover {
    background-color: rgb(160, 6, 75);
    transform: scale(1.05);
}

.log-in-button:active {
    background-color: rgb(255, 117, 179);
}

/* Footer section */
.footer {
    background-color: #242526;
    height: 100px;
    width: 100%;
    position: relative;
    bottom: 0;
    text-align: center;
    padding: 10px;
}

.footer-text {
    color: #ffffff;
    font-size: 18px;
    font-weight: 400;
}

/* Text prompting to log in */
.login-prompt {
    font-size: 20px;
    text-align: center;
    color: #000;
    margin-top: 20px;
    cursor: pointer;
    text-decoration: underline;
}



</style>