<template>
  <div id="app">
    <!-- Add MainPage Component here -->
    <MainPage />
  </div>
</template>

<script>
// Import MainPage component
import MainPage from './components/MainPage.vue';

export default {
  name: 'App',
  components: {
    MainPage, // Register MainPage component
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
