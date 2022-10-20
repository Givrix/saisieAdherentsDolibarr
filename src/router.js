import { createWebHistory, createRouter } from "vue-router";
import storageHelper from 'storage-helper';

const routes =  [

  {
    path: "/",
    alias: "/adherents",
    name: "adherents",
    component: () => import("./components/AdherentsList.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/adherents/:id",
    name: "adherent-details",
    component: () => import("./components/Adherent.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./components/Login.vue")
  },

  {
    path: "/add",
    name: "add",
    component: () => import("./components/AddAdherent.vue"),
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!storageHelper.getItem('dolapikey')) next('/login')
    else next()
  } else next()
})
export default router;
