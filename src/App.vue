<template>
  <div id="app">
    <router-view />
  </div>

</template>

<script>

//import MainPage from './components/main.vue'
/* eslint-disable */


export default {
  name: 'App',
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'FTP Команда'
    }
  },
}
</script>

<style src="@/assets/style/style.css">

</style>
