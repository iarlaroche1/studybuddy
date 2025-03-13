<template>

    <nav class="navbar navbar-light bg-light">
    
        <a href = "#" 
        class = "navbar-brand mb-0 h1">
    
        Studdy-Buddy Finder
    </a>
    
    <div class="collapse navbar-collapse" id = "navbarNav"></div>
    <ul class = "navbar-nav"></ul>
    <li class="nav-item active">
        <a href="#" class="nav-link"></a>
        Home
    </li>
    <li class="nav-item active">
        <a href="#" class="nav-link"></a>
       Buddy Finder 
    </li>
    
    <li class="nav-item active">
        <a href="#" class="nav-link"></a>
        Chat
    </li>
        </nav>
    
    
        <!-- Main container for the page -->
        <div class="main-container">
    
            <!-- Wrapper div for the content and header image -->
            <div class="content-wrapper">
    
                <!-- Header image -->
                <img class="header-image" alt="Header" :src="header" />
    
                <!-- Academic Info form container -->
                <div class="main-container">
    
                    <!-- Section containing the text prompting the user to enter academic details -->
                    <div class="text-container">
                        <p class="academic-text"> Welcome to home page</p>
                    </div>
    
    
    
                    <!-- input field section -->
                    <div class="content-container">

    
    
                    </div>

                </div>
    
                <div class="footer">
                    <div class="footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>
                 
                </div>
    
            </div>
        </div>
    </template>
    
    <script>
    
    
    export default {
        name: "HomePage",
      data() {
        return {
        header: require('@/assets/header.jpg'),
    
        };
      },
      methods: {
        // todo
      },
      computed: {
       
      },
    };
    </script>
    
    <style>
    /* Change the background color of the navbar */
    .pos-f-t {
        background-color: rgb(173, 7, 82);
        /* Change this color to your preferred color */
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
        max-width: 120%;
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
    
    /* academic form container */
    .main-container {
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
    
    /* academic text */
    .text-container {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .academic-text {
        font-size: 20px;
        font-weight: 600;
        color: #000;
        line-height: 1.4;
    }
    .selectTitleDiv {
      padding: 20px;
    }
    .selectOptionalTitle {
      font-size: 20px;
    }
    .selectOptionalTitleSubtext {
      font-size: 15px;
    }
    
    .content-container label {
        font-size: 18px;
        font-weight: 500;
        color: #000;
        margin-bottom: 8px;
        /* space between label and input */
    }
    
    
    
    /* Button styling */
    .text-wrapper-2 {
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
    
    
    </style>