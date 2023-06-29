import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/home',
      component: Home,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      // lazy-loaded
      component: () => import('./views/BoardAdmin.vue'),
    },
    {
      path: '/mod',
      name: 'moderator',
      // lazy-loaded
      component: () => import('./views/BoardModerator.vue'),
    },
    {
      path: '/user',
      name: 'user',
      // lazy-loaded
      component: () => import('./views/BoardUser.vue'),
    },
  ],
});
// function parseJwt(token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(
//     Buffer.from(base64, 'base64')
//       .toString('ascii')
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );

//   return JSON.parse(jsonPayload);
// }

// function jwtExpired(token) {
//   if (token) {
//     var currentDate = Date.now() / 1000;
//     const jwtPayload = parseJwt(token);
//     if (jwtPayload.exp < currentDate) {
//       return true;
//     } else {
//       return false;
//     }
//   }
// }
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home'];
  const authRequired = !publicPages.includes(to.path);
  var loggedIn = localStorage.getItem('user');
  //  var token = localStorage.getItem('token');
  // var expired = jwtExpired(token);
  // if (expired) {
  //   // localStorage.removeItem('user');
  //   // localStorage.removeItem('token');
  //   // loggedIn = null;
  // }
  //

  //   // trying to access a restricted page + not logged in
  //   // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});
