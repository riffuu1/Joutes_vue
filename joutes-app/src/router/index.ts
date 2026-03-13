import { createRouter, createWebHistory } from 'vue-router'
import PlayerTeamView from '../views/PlayerTeamView.vue'
import SignInUser from "@/views/SignInUser.vue";
import LogInUser from "@/views/LogInUser.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PlayerTeamView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sign_in',
      name: 'sign in',
      component: SignInUser,
    }
    {
      path: '/login',
      name: 'login',
      component: LogInUser,
    },
  ],
})

export default router
