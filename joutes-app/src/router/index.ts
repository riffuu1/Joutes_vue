// Import the necessary functions from the vue-router library
import { createRouter, createWebHistory } from 'vue-router'
// Import the component for the Player Management page
import PlayerTeamView from '../views/PlayerTeamView.vue'
// Import the component for the Sign In / Register page
import SignInUser from "@/views/SignInUser.vue"
// Import the component for the Log In page
import LogInUser from "@/views/LogInUser.vue"
// Import the component for the Description/Sports page (The new design you showed)
import DescriptionView from "@/views/DescriptionView.vue"

// Create the router instance
const router = createRouter({
  // Use web history for clean URLs (no # in the address bar)
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define all the paths for your application
  routes: [
    {
      // The default page when you open the app (Login)
      path: '/',
      name: 'login-default',
      component: LogInUser,
    },
    {
      // Path for the login page specifically
      path: '/login',
      name: 'login',
      component: LogInUser,
    },
    {
      // Path for the user registration page
      path: '/sign_in',
      name: 'signin',
      component: SignInUser,
    },
    {
      // Path for Gestion Equipe (The player table and form)
      path: '/teams',
      name: 'PlayerTeamView',
      component: PlayerTeamView,
    },
    {
      // Path for Vue Description (The teams/sports table)
      path: '/description',
      name: 'DescriptionView',
      component: DescriptionView,
    },
    {
      // Path for the About page using lazy-loading for better performance
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ]
})

// Export the router so it can be used in main.ts
export default router