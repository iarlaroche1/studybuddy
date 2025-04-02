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
            <li><router-link to="/homepage">home</router-link></li>
            <li><router-link to="/chatLuke">Chat</router-link></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            
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
  width: 25%; /* Flexible width */
  min-width: 30%; /* Minimum width before collapsing */
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
  flex: 1; /* Takes remaining space */
  padding: 20px;
  min-width: 20px;
  height: auto;
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
</style>