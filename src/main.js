
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css';
// Optional: Import Bootstrap JS for interactive components (e.g., tooltips, popovers)
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';  // Import the main App component
import { createRouter, createWebHistory } from 'vue-router';  // Import Vue Router for Vue 3

// Import the components for the routes

import NewSignUpPage from './components/NewSignUp.vue';

import BuddyFinderPage from './components/BuddyFinderPage.vue';
import BuddiesListPage from './components/BuddiesListPage.vue';
import ProfileTestPage from './components/ProfileTestPage.vue';
import ProfilePage from './components/ProfilePage.vue'
import HomePage from './components/HomePage.vue';
import NotFoundPage from './components/NotFoundPage.vue';
import HelloWorld from './components/HelloWorld.vue';
import NewEditProfilePage from './components/NewEditProfilePage.vue';
// import ChatPage from './components/ChatPage.vue';
import NewLogin from './components/NewLogin.vue';
import ConversationsListLuke from './components/ConversationsListLuke.vue';
import ConversationPageLuke from './components/ConversationPageLuke.vue';
//import ChatPageLuke from './components/ChatPageLuke.vue';


const routes = [
  // Full-page routes (won't use App.vue layout)
 
  {
    
  },

  // Main layout routes (uses App.vue)
  {
    path: '/',
    //component: App,
    meta: { requiresAuth: true },
    children: [
      { path: '/buddyfinder', component: BuddyFinderPage },
      { path: '/profiletestpage', component: ProfileTestPage },
      { path: '/buddies', component: BuddiesListPage },
      { path: '/user/:id', component: ProfilePage }, // TODO
      { path: '/home', component: HomePage },
      { path: '/helloworld', component: HelloWorld },
      { path: '/home/edit', component: NewEditProfilePage },
      // { path: '/chat', component: ChatPage },
      
      { path: '/login', component: NewLogin },
      { path: '/newsignup', component: NewSignUpPage },
      { path: '/chat', component: ConversationsListLuke },
      { path: '/chat/:id', component: ConversationPageLuke },

    ] 
  },
  
  // 404 page
  { path: "/:notFound", component: NotFoundPage }
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