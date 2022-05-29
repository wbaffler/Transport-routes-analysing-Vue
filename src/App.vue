<template>
  <div id="app">
    <router-view />
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
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
