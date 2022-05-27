<template>
  <div id="app">
    <router-view></router-view>
  </div>

</template>

<script>

//import MainPage from './components/main.vue'
//import HeatMap from './components/heatmap.vue'

export default {
  name: 'App',
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'Your Website'
    }
  },
}
</script>

<style src="@/assets/style/style.css">
</style>
