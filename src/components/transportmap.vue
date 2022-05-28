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
    <div id="transportmap" ></div>
    <div id="data-container">
      <div class="map-container">
        <div class="districts-choice">
          <h1 class="districts-choice__title">Карта совпадающих маршрутов</h1>
          <a href="#" id="districts-choice__button">
            <p id="districts-choice__button-text" v-on:click="DistrictButtonEvent()">Выбор района</p>
          </a>
        </div>

        <div id="transport-info" >
          <div id="transport-info__text-container">
            <h1 id="transport-info__title-district">{{ districtName }}</h1>

            <p class="transport-info__text-count">Количество совпадающих маршрутов</p>
            <p id="transport-info__counter">{{counter}}</p>
            <input id="transport-info__search" type="text" v-model="query" placeholder="Название маршрута">

          </div>
          <div class="transport-info__list" v-if="!allTransportMode">
            <a class="transport-info__route-link" href="#" v-for="r in loadedRoutes" v-on:click="routeButtonEvent(r)"
               :class="{ 'transport-info__route-link-pushed': r.pushed }">
              <p class="transport-info__type-transport">{{r.firstRoute.type}}</p>
              <h2 class="transport-info__routes-text">{{r.firstRoute.number + "-" + r.secondRoute.number}}</h2>
              <p class="transport-info__percent">{{(r.matchPercentage * 100).toFixed(0) + '%'}}</p>
            </a>
          </div>

          <div class="transport-info__list" v-if="allTransportMode">
            <a class="transport-info__route-link" href="#" v-for="r in loadedAllRoutes" v-on:click="routeButtonEvent(r)"
               :class="{ 'transport-info__route-link-pushed': r.pushed }">
              <p class="transport-info__type-transport">{{r.type}}</p>
              <h2 class="transport-info__routes-text">{{r.number}}</h2>
            </a>
          </div>
        </div>


      </div>
      <a href="#" v-on:click="AllTransportButEvent()" >
        <div id="all-transport-area" :class="{ 'all-transport-area-active': allTransportMode }"></div>
      </a>



      <div id="districts-window" v-if="districtsWindowSeen">
        <div id="districts-window__container-top">
          <h1 id="districts-window__title">Выбор района</h1>
          <a href="#">
            <div id="districts-window__cross-but" v-on:click="CloseButtonEvent()"></div>
          </a>
        </div>
        <div id="districts-window__list">
          <a id="districts-window__district-link" href="#" v-for="d in districts" v-on:click="DistrictChoiceEvent(d)">
            <h2 id="districts-window__districts-text">{{ d.obj.name }}</h2>
          </a>
        </div>
      </div>

    </div>


  </main>
</template>

<script>
import { loadScript } from "vue-plugin-load-script";
import { loadYmap } from 'vue-yandex-maps';
import router from "@/router";


const settings = {
  apiKey: '0264e5d4-2f0f-4c70-9944-1c0d8b4cddf1',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1'
}
let myMap;
const moscowCenterCoords = {0: 55.76, 1: 37.64};
const allDistricts = "Все районы"

export default {
name: "TransportMap",
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
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    routeButtonEvent(r){
      r.pushed = !r.pushed
      for (let route of this.routes){
        if (route !== r){
          route.pushed = false;
        }
      }
      if (r.pushed) {
        this.setRouteOnMap(r);
      }
      else{
        this.DisplayAllRoutes(this.updatedRoutes, this.currentDistrict);
      }

    },
    AllTransportButEvent(){
      this.allTransportMode = !this.allTransportMode;
      if (this.allTransportMode){
        this.updatedRoutes = this.allRoutes;
      }
      else {
        this.updatedRoutes = this.routes;
      }
      this.DisplayRoutesOnMap(this.currentDistrict);
    },
    DistrictButtonEvent(){
      this.districtsWindowSeen = true
    },
    CloseButtonEvent(){
      this.districtsWindowSeen = false
    },
    DistrictChoiceEvent(district){
      this.districtsWindowSeen = false
      this.currentDistrict = district;
      this.districtName = district.obj.name;
      this.DisplayRoutesInList(district);
      this.DisplayRoutesOnMap(district);
    },
    DisplayRoutesInList(district){
      let arr = [];
      if (district !== this.districts[0]) {
        for (let searchedRouteInDistrict of district.obj.routePairsId) {
          let route = this.routes.find(r =>
              r.firstRoute.id === searchedRouteInDistrict.item1 &
              r.secondRoute.id === searchedRouteInDistrict.item2 ||
              r.firstRoute.id === searchedRouteInDistrict.item2 &
              r.secondRoute.id === searchedRouteInDistrict.item1)
          arr.push(route);
          //arr = arr.map(obj=> ({ ...obj, pushed: false }))
        }
        arr = arr.map(obj=> ({ ...obj, pushed: false }))
        this.zoom = 13;
        this.updatedRoutes = arr;
      }
      else{
        this.zoom = 10;
        this.updatedRoutes = this.routes;
      }
      this.counter = this.updatedRoutes.length;
    },
    DisplayRoutesOnMap(district){
      myMap.geoObjects.removeAll();
      myMap.setCenter(district.coords);
      myMap.setZoom(this.zoom);
      for (const route of this.updatedRoutes) {
        let coordinates = [];
        for (let stop of route.stops){

          coordinates.push([stop.latitude, stop.longitude]);

        }
        this.DrawRouteOnMap(coordinates, route, true);
      }
    },

    setRouteOnMap(route) {
      let coordinates = [];
      for (let stop of route.stops){
        coordinates.push([stop.latitude, stop.longitude]);
      }
      const coords = [route.stops[0].latitude, route.stops[0].longitude];
      myMap.geoObjects.removeAll();
      myMap.setCenter(coords);
      myMap.setZoom(13);
      this.DrawRouteOnMap(coordinates, route);
    },
    DrawRouteOnMap(coordinates, route, isDistrict){
      let headerBalloon;
      let stringBalloon;
      if (route.matchPercentage){
        headerBalloon = route.firstRoute.type +": " + route.firstRoute.number + " - " + route.secondRoute.number;
        stringBalloon = "Совпадение: " + (route.matchPercentage * 100).toFixed(0) + '%';
      }
      else {
        headerBalloon = route.type +": " + route.number;

      }
      let routeLine = new ymaps.Polyline(
          coordinates,
          {
            balloonContentHeader: headerBalloon,
            balloonContent: stringBalloon,
          }, {
            // Задаем опции геообъекта.
            // Отключаем кнопку закрытия балуна.
            balloonCloseButton: true,
            // Цвет линии.
            strokeColor: route.color,
            // Ширина линии.
            strokeWidth: 2,
            // Коэффициент прозрачности.
            strokeOpacity: 1
          });
      if (!isDistrict){
        for (let r of route.stops){
          myMap.geoObjects
              .add(new ymaps.Placemark([r.latitude, r.longitude], {
                //hintContent: '1',
                hintContent: r.name
              }, {
                preset: 'islands#circleIcon',
                iconColor: route.color,
              }))
        }
      }
      myMap.geoObjects.add(routeLine);
    },

    DisplayAllRoutes (routes, district){
      myMap.geoObjects.removeAll();

      myMap.setCenter(district.coords);
      myMap.setZoom(this.zoom);

      for (let route of routes){
        let coordinates = [];
        for (let stop of route.stops){
          coordinates.push([stop.latitude, stop.longitude]);
        }
        this.DrawRouteOnMap(coordinates, route, true);
      }
    },
    setRouteColor(routes){
      return new Promise(function (resolve){
        const getRanHex = size => {
          let result = [];
          let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

          for (let n = 0; n < size; n++) {
            result.push(hexRef[Math.floor(Math.random() * 16)]);
          }
          return result.join('');
        }

        for (let route of routes) {
          route.color = '#' + getRanHex(6)
        }
        resolve(routes);
      })
    }
  },

  async beforeMount() {
    await loadYmap({...settings, debug: true})
    this.routes = await fetch('http://localhost:63342/transport/js/routes.json')
        .then(response => response.json())
        .then(r => this.setRouteColor(r));
    this.routes = this.routes.map(obj=> ({ ...obj, pushed: false }))
    this.updatedRoutes = this.routes;
    this.counter = this.updatedRoutes.length;

    this.districts = await fetch('http://localhost:63342/transport/js/heat.json')
        .then(response => response.json())
        .then(districts => {
          return new Promise(function(resolve, reject) {
            let districtsArr = [];
            let districtAll = {
              obj: {
                name: allDistricts
              },
              coords: moscowCenterCoords
            };
            const districtsLength = districts.length + 1;
            districtsArr.push(districtAll);
            //BuildDistrictsWindow(districtAll, moscowCenterCoords, listPlace, routes);
            let geoCode;
            for (const district of districts) {
              const fullName = district.name + ", Москва";
              geoCode = ymaps.geocode(fullName, {
                results: 1
              }).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
                let coords = firstGeoObject.geometry.getCoordinates();
                let districtObj = {
                  obj: district,
                  coords: coords
                }
                districtsArr.push(districtObj);
                if (districtsArr.length === districtsLength)
                {
                  resolve(districtsArr.sort((a, b) => a.obj.routePairsCount > b.obj.routePairsCount ? -1 : 1));
                }
              })
            }
          });
        })

    this.currentDistrict = this.districts[0];
    this.DisplayRoutesOnMap(this.currentDistrict);


    this.allRoutes = await fetch('http://localhost:63342/transport/js/allroutes.json')
        .then(response => response.json())
        .then(r => this.setRouteColor(r));
    this.allRoutes = this.allRoutes.map(obj=> ({ ...obj, pushed: false }))


  },
  computed: {
    loadedRoutes(){
      return this.updatedRoutes.filter(r => r.firstRoute.number.includes(this.query));
    },
    loadedAllRoutes(){
      return this.allRoutes.filter(r => r.number.includes(this.query));
    },

  },

  async mounted() {
    const moscowCenterCoords = [55.76, 37.64];

    await loadYmap({...settings, debug: true})
        .then(() => {
          ymaps.ready(init);
        })
    function init () {
      myMap = new ymaps.Map('transportmap', {
        center: moscowCenterCoords, // Москва
        zoom: 10,
        controls: []
      });
      myMap.options.set('minZoom', 10);

      myMap.controls.add('zoomControl', {
        float: 'none',
        position: {
          top: '30px',
          left: '430px'
        }
      });
    }
  }
}
</script>

<style scoped>

</style>