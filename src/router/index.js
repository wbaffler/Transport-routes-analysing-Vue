
import {createRouter, createWebHistory} from "vue-router";
import MainPage from '/src/components/main.vue'
import HeatMap from '/src/components/heatmap.vue'
import TransportMap from '/src/components/transportmap.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';


const routes = [
    {
        path: '/',
        redirect: "/index"
    },
    {
        path: '/index',
        name: 'Home',
        component: MainPage,
        meta: { auth: true, title: 'Совпадение маршрутов наземного транспорта' },
    },
    {
        path: '/heatmap',
        name: 'Heat Map',
        component: HeatMap,
        meta: { auth: true, title: 'Тепловая карта' },
    },
    {
        path: '/transportmap',
        name: 'Transport Map',
        component: TransportMap,
        meta: { auth: true, title: 'Транспортная карта' },
    }

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeResolve((to, from, next) => {
    if (to.name) {
        // Запустить отображение загрузки
        NProgress.start()
    }
    next()
})

router.afterEach(() => {
    // Завершить отображение загрузки
    NProgress.done()
})

export default router