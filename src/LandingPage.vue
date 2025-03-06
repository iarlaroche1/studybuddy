<template>
    <div class="LandingPage">
      <div class="div">
        <div class="overlap-group">
          <header class="header">
            <div class="frame">
              <p class="welcome-to-your">
                <span class="text-wrapper">Welcome to your Study-Buddy App <br /></span>
                <span class="span">(Only for computer science students)</span>
              </p>
            </div>
          </header>
          <img class="tempimagebltqe" alt="Placeholder Image" src="header" />
        </div>
        <div class="frame-2">
          <div class="please-select-the-wrapper">
            <router-link to="/login">*temp* back to login </router-link>
            <p class="please-select-the">
              Please select the year you are in and the module you want to Study:
            </p>
          </div>
          
          <div class="dropdown-container">
            <select v-model="selectedYear" @change="updateModules">
              <option disabled value="">Select Year</option>
              <option v-for="year in years" :key="year" :value="year">Year {{ year }}</option>
            </select>
            
            <select v-model="selectedModule" :disabled="!selectedYear">
              <option disabled value="">Select Module</option>
              <option v-for="module in filteredModules" :key="module" :value="module">{{ module }}</option>
            </select>
          </div>
  
          <button class="text-wrapper-2">Find your Study-Buddy here</button>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: "LandingPage",
    data() {
      return {
        selectedYear: "",
        selectedModule: "",
        years: [1, 2, 3, 4],
        modules: {
          1: ["Mathematics", "Mathematics (Honours)", "Programming","Web Development","Professional skills 1","Computing Systems","Algorithms and Information Systems","Fundamentals of Electrical and Electronic Engineering","Introduction to Physics"],
          2: ["Differential Forms","Discrete Mathematics","Software Engineering 1","Object-Oriented Programming","Database Systems1","Computer Systems and Organization","Statistics for Data Science 1","Linear Algebra","Introduction to Modelling","Next Generation Technologies 2","Complex Analysis","Networks and Data Communications 1","Object-Oriented Programming: Data Structures and Algorithms"],
          3: ["Human Computer Interaction","Programming Paradigms","Metric Spaces","Numerical Analysis 1","Groups","Games Programming","Database Systems 2","Networks ad Data Communications 2","Software Engineering 2","Programming 3","Professional Experience programme in Information Technology","Organisational Innovation","Professional skills"],
          4: ["Rings","Graphics and Image Process","Systems Modelling and Simulation","Previous Yr Exemption","Final Year Project","Meaasure Theory","Euclidean and Non-Euclidean Geometry","Information Retrieval","Advanced Professional Skills","Artificial Intelligence","Software Engineering 3","Machine Learning","Networks","Fields and Appliactions","Topology","Computer Security and Forensic Computing","Advanced Group Theory","Cryptography","Real Time Systems","Distributed Systems and Co Operative Computing"]
        }
      };
    },
    methods: {
      // Method to update the module options when a year is selected
      updateModules() {
        // Reset the selected module whenever the year is changed
        this.selectedModule = "";
      }
    },
    computed: {
      filteredModules() {
        return this.selectedYear ? this.modules[this.selectedYear] : [];
      }
    }
  };
  </script>
  
  <style>
  .LandingPage {
    background-color: #cccccc;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
  .LandingPage .div {
    background-color: #cccccc;
    height: 1024px;
    position: relative;
    width: 1440px;
  }
  
  .LandingPage .overlap-group {
    height: 174px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1440px;
  }
  
  .LandingPage .header {
    background-color: #ad0741;
    height: 174px;
    left: 0;
    position: absolute;
    top: 0;
    width: 1440px;
  }
  
  .LandingPage .frame {
    height: 174px;
    left: 621px;
    position: relative;
    width: 819px;
  }
  
  .LandingPage .welcome-to-your {
    color: #ffffff;
    font-family: "Inter-Bold", Helvetica;
    font-size: 40px;
    font-weight: 400;
    left: 73px;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 47px;
    width: 674px;
  }
  .LandingPage .text-wrapper {
    font-weight: 700;
  }
  
  .LandingPage .span {
    font-family: "Inter-Light", Helvetica;
    font-size: 20px;
    font-weight: 300;
  }
  
  .LandingPage .tempimagebltqe {
    height: 174px;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 620px;
  }
  
  .LandingPage .frame-2 {
    background-color: #ffffff;
    border-radius: 20px;
    height: 777px;
    left: 370px;
    overflow: hidden;
    position: absolute;
    top: 202px;
    width: 700px;
  }
  
  .LandingPage .please-select-the-wrapper {
    height: 139px;
    left: 91px;
    overflow: hidden;
    position: absolute;
    top: 55px;
    width: 520px;
  }
  
  .LandingPage .please-select-the {
    color: #000000;
    font-family: "Inter-Semibold", Helvetica;
  font-size: 32px;
    font-weight: 600;
    left: 0;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: -1px;
    width: 520px;
  }
  
  .dropdown-container {
    display: flex;
    flex-direction: column;
    margin: 20px; 
    align-items: center;
    margin-top: 200px; 
  }
  
  .dropdown-container select {
    padding: 35px;
    margin: 30px;
    border: none;
    border-radius: 65px;
    font-size: 16px;
    width: 590px;
    background-color: #ad0741;
    color: white;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    appearance: none;
  }
  
  select:focus {
    outline: none;
  }
  
  select option {
    background-color: white;
    color: black;
  }
  .text-wrapper-2 {
    background-color: rgb(175, 7, 65);
    color: white;
    border: none;
    padding: 25px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 95px;
    margin-bottom: 100px;
    cursor: pointer;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 520px;
    text-align: center;
  }
  
  .text-wrapper-2:hover {
    background-color: rgb(175, 7, 65);
  }
  </style>