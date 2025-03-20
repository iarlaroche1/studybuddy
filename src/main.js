
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css';
// Optional: Import Bootstrap JS for interactive components (e.g., tooltips, popovers)
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';  // Import the main App component
import { createRouter, createWebHistory } from 'vue-router';  // Import Vue Router for Vue 3

// Import the components for the routes
import SignUpPage from './components/SignUpPage.vue';
import LoginPage from './components/LoginPage.vue';
import BuddyFinderPage from './components/BuddyFinderPage.vue';
import ProfileTestPage from './components/ProfileTestPage.vue';
import HomePage from './components/HomePage.vue';
import NotFoundPage from './components/NotFoundPage.vue';
import HelloWorld from './components/HelloWorld.vue';


// Define routes for Vue Router
const routes = [
  { path: '/signup', component: SignUpPage },
  { path: '/login', component: LoginPage },
  { path: '/buddyfinder', component: BuddyFinderPage },
  { path: '/profiletestpage', component: ProfileTestPage },
  { path: '/homepage', component: HomePage },
  { path: '/helloworld', component: HelloWorld },
  { path: "/:notFound", component: NotFoundPage } // 404 page, currently just directs to login
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


import "bootstrap/dist/js/bootstrap.js"