<template>
  <div id="app">
    <div class="home-header">
      <h1 class="title">Study Buddy Finder: Home</h1>
    </div>
    <div class="page-container">
      <img class="home-header-image" alt="Header" :src="header" />

      <div class="side-navbar-container">
        <nav class="side-navbar">
          <ul>
            <br><br>
            <li><router-link to="/homepage">Buddies</router-link></li>
            <li><router-link to="/chat">Chat</router-link></li>
            <li><router-link to="/homepage">home</router-link></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
            <li><a href="">-</a></li>
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
      <div class="home-footer">
        <div class="home-footer-text">© 2025 Study-Buddy App. All Rights Reserved.</div>
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
  width: 101%;
}

.home-header-image {
  max-height: auto;
  max-width: auto;
  min-height: 20%;
  min-width: 20%;
  display: flex;
  object-fit: fill;
  border-radius: 0px;
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  height: 150px;
}

.side-navbar-container {
  position: fixed;
  float: left;
  top: 140px; /* Match this with your header image height */
  display: flex;
  flex-direction: column;
}

.side-navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 400px;
  overflow: hidden;
  background-color: rgb(173, 7, 82);
}

.side-navbar a {
  display: flex;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 70px;
}

.home-footer {
  background-color: #242526;
  height: 100px;
  width: 100%;
  position: absolute;
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