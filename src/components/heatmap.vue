<template>

  <header class="header">
    <router-link to="/index">
      <div class="header__logo">
        <a class="header__logo-link">
          <img :src="require('/src/assets/logo-header.svg')" alt="Анализ совпадения маршрутов
      наземного транспорта" class="header__logo-pic">
        </a>
      </div>
    </router-link>
    <nav class="header__nav">
      <ul class="header__list">
        <li class="header__item">
          <router-link to="/heatmap">
            <a class="header__link">Тепловая карта</a>
          </router-link>
        </li>
        <li class="header__item">
          <router-link to="/transportmap">
            <a class="header__link">Карта совпадающих маршрутов</a>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>

  <main class="main">
    <transition name="fade">
      <div class="loading-screen" v-if="!loadedMap"></div>
    </transition>
    <div id="heatmap"></div>
    <div class="map-container">
      <div class="summary">
        <div class="summary__text-container">
          <h1 class="summary__title">Тепловая карта по районам</h1>
          <p class="summary__text">Количество совпадающих маршрутов</p>
          <p id="summary__sum-count">{{routes.length}}</p>
        </div>
        <div id="summary_districts">
          <a class="summary_district-link" href="#" v-for="d in districts" :key="d" v-on:click="routeButtonEvent(d)"
             :class="{ 'summary_district-link-pushed': d.pushed }">
            <h2 class="summary__district-name">{{d.id}}</h2>
            <p class="summary__text-in-district">Количество совпадающих маршрутов</p>
            <p class="summary__count-in-district">{{d.properties.weight}}</p>
          </a>
        </div>
      </div>

    </div>
  </main>
</template>

<script>

import { loadScript } from "vue-plugin-load-script";
import { loadYmap } from 'vue-yandex-maps';
/* eslint-disable */


const settings = {
  apiKey: 'c0a534b3-a0fa-409a-a7b0-edce7daeddc3',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1'
}

let myMap;
const moscowCenterCoords = {0: 55.76, 1: 37.64};

export default {
  name: "HeatMap",
  data() {
    return {
      componentKey: 0,
      query: '',
      routes: [],
      updatedRoutes: [],
      pushed: false,
      districts: [],
      districtsWindowSeen: false,
      districtName: 'Все районы',
      currentDistrict: {},
      zoom: 10,
      counter: 0,
      allTransportMode: false,
      allRoutes: [],
      loadedMap: false,
    };
  },
  methods: {
    routeButtonEvent(d){
      d.pushed = !d.pushed
      for (let district of this.districts){
        if (district !== d){
          district.pushed = false;
        }
      }
      if (d.pushed) {
        this.setDistrictOnMap(d);
      }
      else{
        myMap.geoObjects.removeAll();
        myMap.setCenter(moscowCenterCoords);
        myMap.setZoom(10);
      }

    },

    DrawHeatMap(){
      let newData = this.districts;
      loadScript("https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js")
          .then(() => {
            ymaps.modules.require(['Heatmap'], function (Heatmap) {
              let data = [],
                  heatmap = new Heatmap();
              //heatmap.options.set('dissipating', true);
              heatmap.setMap(myMap);
              heatmap.options.set('radius', 40);
              heatmap.options.set('dissipating', true);
              heatmap.options.set('opacity', 0.7);
              heatmap.setData(newData);
            })
          })
      this.loadedMap = true;
    },
    setDistrictOnMap (feature) {
      myMap.geoObjects.removeAll();
      myMap.setCenter(feature.geometry.coordinates);
      myMap.setZoom(12);
      myMap.geoObjects
          .add(new ymaps.Placemark(feature.geometry.coordinates, {
            iconCaption: feature.id
          }, {
            preset: 'islands#icon',
            iconColor:'#bc4000'
          }))
    },
  },
  async beforeMount() {
    await loadYmap({...settings, debug: true})
    this.routes = await fetch('http://localhost:63342/transport/js/routes.json')
        .then(response => response.json())
    this.counter = this.updatedRoutes.length;

    this.districts = await fetch('http://localhost:63342/transport/js/heat.json')
        .then(response => response.json())
        .then(districts => {
          return new Promise(function(resolve, reject) {
            let districtsArr = [];

            const districtsLength = districts.length;
            let geoCode;
            for (const district of districts) {
              const fullName = district.name + ", Москва";
              geoCode = ymaps.geocode(fullName, {
                results: 1
              }).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                let coords = firstGeoObject.geometry.getCoordinates();
                district.name = district.name.replace('район ', '');
                district.name = district.name.replace(' район', '');
                let districtObj = {
                  id: district.name,
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  },
                  properties: {
                    weight: district.routePairsCount
                  },
                  pushed: false,
                }
                districtsArr.push(districtObj);
                if (districtsArr.length === districtsLength)
                {
                  districtsArr.sort((a, b) => a.properties.weight > b.properties.weight ? -1 : 1);
                  resolve(districtsArr);
                }
              })
            }
          });
        })
    this.DrawHeatMap();
  },

  computed: {
    Districts(){
      return this.districts;
    },
  },
  async mounted() {
    await loadYmap({...settings, debug: true})
        .then(() => {
          loadScript("https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js")
              .then(() => {
                //DataProcessing();
                ymaps.ready(init);
              });

          function init() {
            myMap = new ymaps.Map('heatmap', {
              center: moscowCenterCoords, // Москва
              zoom: 10,
              controls: []
            });
            myMap.options.set('maxZoom', 13);
            myMap.options.set('minZoom', 10);

            myMap.controls.add('zoomControl', {
              float: 'none',
              position: {
                top: '30px',
                left: '430px'
              }
            })
          }
        })
  }
}
</script>

<style scoped>

</style>