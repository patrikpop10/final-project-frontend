<template>

  <router-view/>
</template>
<script setup>
import HomeView from './views/HomeView.vue';
</script>

<style>
* {
  color: white !important;
}
body{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #068d9d;
  background: linear-gradient(180deg, rgba(6,141,157,1) 10%, rgba(0,212,255,1) 100%);
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
