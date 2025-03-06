<template>
    <div class="main-login-page">
      <div class="div">
        <div class="login-form">
          <div class="login-text">
            <p class="text-wrapper">Login here to get started!</p>
            <br>
              <br>
              
          </div>
          <div class="asking-for-uni-email">
            <div class="text-wrapper-2">University Email:</div>
          </div>
          <div class="typing-uni-email">
            <p class="p">Please enter your NUIG email here
              
            </p>
            <div class="typing-password">
              <div class="text-wrapper-3">Please enter your password</div>
            </div>
            <div class="text-wrapper-4">Password:</div>
            <div class="login-button">
              <div class="text-wrapper-5">Login here</div>
              
            </div>
            <div class="asking-for-sign-in">
              <p class="text-wrapper-6">
                Don't have an account? Sign-in here to get started!
              
              </p>
            </div>
          </div>
          <div class="footer-copyright">
            <div class="text-wrapper-7">The Study-Buddy App 2024</div>
            <img class="tempimagetlalz" alt="Tempimagetlalz" src="header.jpg" />
          </div>
  
          <header class="header">
            <img class="tempimagebltqe" alt="Tempimagebltqe" src="header.jpg" />
            <p class="welcome-to-your">
              <span class="span">
                Welcome to your Study-Buddy App
                <br />
                <br />
              </span>
              <span class="text-wrapper-8">
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                (only for computer science people)
              </span>
            </p>
          </header>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MainLoginPage",
  };
  </script>
  
  <style>
  .main-login-page {
    background-color: #cccccc;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
  
  .main-login-page .div {
    background-color: #cccccc;
    height: 1024px;
    position: relative;
    width: 1440px;
  }
  
  .main-login-page .login-form {
    background-color: #fff6f6;
    border-radius: 25px;
    height: 717px;
    left: 405px;
    overflow: hidden;
    position: absolute;
    top: 192px;
    width: 630px;
  }
  
  .main-login-page .login-text {
    height: 83px;
    left: 80px;
    position: absolute;
    top: 13px;
    width: 468px;
  }
  
  .main-login-page .text-wrapper {
    font-family: "inter-Bold", Helvetica;
    font-size: 32px;
    font-weight: 700;
    left: 41px;
    position: absolute;
    top: 21px;
  }
  
  .main-login-page .asking-for-uni-email {
    height: 46px;
    left: 0;
    position: absolute;
    top: 106px;
    width: 308px;
  }
  
  .main-login-page .text-wrapper-2 {
    color: #000000;
    font-family: "Inter-Medium", Helvetica;
    font-size: 24px;
    font-weight: 500;
    left: 9px;
    position: absolute;
    top: 14px;
    width: 299px;
  }
  
  .main-login-page .typing-uni-email {
    border: 1px solid #000000;
    border-radius: 51px;
    height: 71px;
    left: 8px;
    position: absolute;
    top: 162px;
    width: 613px;
  }
  
  .main-login-page .p {
    color: #000000;
    font-family: "Inter-ExtraLight", Helvetica;
    font-size: 16px;
    font-weight: 200;
    left: 186px;
    position: absolute;
    top: 27px;
    white-space: nowrap;
  }
  
  .main-login-page .typing-password {
    border: 1px solid #000000;
    border-radius: 51px;
    height: 71px;
    left: 9px;
    position: absolute;
    top: 319px;
    width: 613px;
  }
  
  .main-login-page .text-wrapper-3 {
    color: #000000;
    font-family: "Inter-ExtraLight", Helvetica;
    font-size: 16px;
    font-weight: 200;
    left: 204px;
    position: absolute;
    top: 25px;
    white-space: nowrap;
  }
  
  .main-login-page .text-wrapper-4 {
    color: #000000;
    font-family: "Inter-Medium", Helvetica;
    font-size: 24px;
    font-weight: 500;
    left: 9px;
    position: absolute;
    top: 272px;
    width: 299px;
  }
  
  .main-login-page .login-button {
    background-color: #ad0741;
    border: 1px solid #000000;
    border-radius: 78px;
    height: 79px;
    left: 160px;
    position: absolute;
    top: 430px;
    width: 309px;
  }
  
  .main-login-page .text-wrapper-5 {
    color: #000000;
    font-family: "Inter-Medium", Helvetica;
    font-size: 24px;
    font-weight: 500;
    left: 94px;
    position: absolute;
    top: 24px;
  }
  
  .main-login-page .asking-for-sign-in {
    height: 102px;
    left: 80px;
    position: absolute;
    top: 575px;
    width: 468px;
  }
  
  .main-login-page .text-wrapper-6 {
    color: #000000;
    font-family: "Inter-SemiBold", Helvetica;
    font-size: 20px;
    font-weight: 600;
    left: 66px;
    position: absolute;
    top: 70px;
    width: 336px;
  }
  
  .main-login-page .footer-copyright {
    background-color: #1b1a1a;
    height: 80px;
    left: 0;
    position: absolute;
    top: 944px;
    width: 1440px;
  }
  
  .main-login-page .text-wrapper-7 {
    color: #ffffff;
    font-family: "Inter-Thin", Helvetica;
    font-size: 20px;
    font-weight: 100;
    left: 561px;
    position: absolute;
    top: 24px;
  }
  
  .main-login-page .tempimagetlalz {
    height: 10px;
    left: 549px;
    object-fit: cover;
    position: absolute;
    top: 32px;
    width: 10px;
  }
  
  .main-login-page .header {
    background-color: #ad0741;
    height: 162px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1440px;
  }
  
  .main-login-page .tempimagebltqe {
    height: 162px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 558px;
  }
  
  .main-login-page .welcome-to-your {
    color: #ffffff;
    font-family: "Inter-Regular", Helvetica;
    font-size: 32px;
    font-weight: 400;
    left: 760px;
    position: absolute;
    top: 30px;
    width: 582px;
  }
  
  .main-login-page .span {
    color: #ffffff;
    font-family: "Inter-Regular", Helvetica;
    font-size: 32px;
    font-weight: 400;
  }
  
  .main-login-page .text-wrapper-8 {
    font-family: "Inter-Light", Helvetica;
    font-size: 13px;
    font-weight: 300;
  }
  </style>
  