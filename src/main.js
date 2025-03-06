import { createApp } from 'vue';
import App from './App.vue';  // Import the main App component
import { createRouter, createWebHistory } from 'vue-router';  // Import Vue Router for Vue 3

// Import the components for the routes
import SignUpPage from './components/SignUpPage.vue';
import LoginPage from './components/LoginPage.vue';
import BuddyFinderPage from './components/BuddyFinderPage.vue';
import ProfileTestPage from './components/ProfileTestPage.vue';
import test from './components/newprofiletest.vue';

// Define routes for Vue Router
const routes = [
  { path: '/signup', component: SignUpPage },
  { path: '/login', component: LoginPage },
  { path: '/buddyfinder', component: BuddyFinderPage },
  { path: '/profiletestpage', component: ProfileTestPage },
  { path: '/test', component: test }
];

// Create the Vue Router instance with history mode
const router = createRouter({
  history: createWebHistory(),  // Use HTML5 history mode
  routes
});

// Create the Vue app instance and use the router
const app = createApp(App);
app.use(router);  // Use the router in the app
app.mount('#app');  // Mount the app to the DOM
