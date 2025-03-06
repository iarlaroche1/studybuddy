<template>
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

                <!-- Name input field section -->
                <div class="input-container">
                    <label for="full-name">Full Name:</label>
                    <input id="full-name" v-model="fullName" type="text" placeholder="Enter your full name"
                        class="input-field" />
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
                    <br><br>
          <router-link to="/buddyfinder">Temp link: BuddyFinder Page</router-link>
                </p>

                <!-- Log-in button wrapper -->
                <div class="log-in-button-wrapper">
                    <button class="log-in-button" @click="handleLogIn">Log In</button>
                </div>

            </div>

            <!-- Footer section with text and small image -->
            <div class="footer">
                <div class="footer-text">2024 Study-Buddy App</div>
                <img class="footer-image" alt="Tempimageonpho" :src="tempImage" />
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
/* General Reset for Body */
body,
html {
    margin: 0;
    padding: 0;
    font-family: "Inter", Helvetica, sans-serif;
    box-sizing: border-box;
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

/* Adding the thin bar at the top */
.main-container::before {
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 50px;
    /* Thin bar height */
    background-color: rgb(173, 7, 82);
    /* Same color as the button */
    z-index: 1000;
    /* Ensures the bar stays above other content */
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

/* Input container styling */
.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
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

.login-prompt:hover {
    color: #8e44ad;
    /* Hover effect color */
}

/* Responsive Design Tweaks */
@media (max-width: 768px) {
    .log-in-text {
        font-size: 28px;
    }

    .input-field {
        font-size: 16px;
        padding: 12px;
    }

    .input-container label {
        font-size: 20px;
    }

    .log-in-button {
        font-size: 20px;
        padding: 12px 24px;
    }

    .header-image {
        max-height: 25vh;
    }

    .log-in-form-container {
        padding: 20px;
    }

    .footer {
        height: 80px;
    }

    .footer-text {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .log-in-text {
        font-size: 24px;
    }

    .input-field {
        font-size: 14px;
        padding: 10px;
    }

    .input-container label {
        font-size: 18px;
    }

    .log-in-button {
        font-size: 18px;
        padding: 10px 20px;
    }

    .header-image {
        max-height: 20vh;
    }

    .log-in-form-container {
        padding: 15px;
    }

    .footer {
        height: 60px;
    }

    .footer-text {
        font-size: 14px;
    }
}
</style>