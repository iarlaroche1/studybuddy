<template>
  <div id="app">

    <div class="home-header">
      <h1 class="title">Study Buddy Finder</h1>
    </div>

    <div class="page-container">

      <div class="side-navbar-container">
        <!-- Header image with link to homepage -->
        <router-link to="/homepage">
          <img class="home-header-image" alt="Header" :src="header" />
        </router-link>


        <nav class="side-navbar">
          <ul>
            <li><router-link to="/buddies">Buddies</router-link></li>
            <li><router-link to="/chat">Chat</router-link></li>
            <li><router-link to="/homepage">Home</router-link></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li class="logged-in-container">
              <span class="loggedInText">Logged in as {{ fullName }}</span>
              <button class="sign-out-button" @click="handleSignOut">Sign Out</button>
            </li>
            
          </ul>
        </nav>
      </div>

      <!-- Dynamic content area -->
      <div class="rightside-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      header: require('@/assets/header.jpg')
    }
  }
}
</script>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
.sign-out-button {
  background-color: rgb(173, 7, 82);
  color: white;
  border: none;
  padding: 10px 20px;
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
 
  display:flex;
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