import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/Registration.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/note/:id',
      name: 'noteDetail',
      component: () => import('../views/NoteDetail.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/note/',
      name: 'createNote',
      component: () => import('../views/CreateNote.vue'),
      meta: {
        auth: true
      }
    }
  ]
})

router.beforeEach(routes);

export default router
