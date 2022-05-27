<template>
  <main class="main">
    <section class="intro">
      <div class="container intro__container">
        <div class="intro__logo">
          <router-link to="/index">
            <a class="intro__logo-link">
              <img :src="require('/src/assets/Logo.svg')" alt="Анализ совпадения маршрутов
      наземного транспорта" class="intro__logo-pic">
            </a>
          </router-link>
          </div>

        <h1 class="intro__title">
          Анализ совпадения маршрутов
          наземного транспорта
        </h1>

        <nav class="intro__nav">
          <ul class="intro__list">
            <li class="intro__item">
              <router-link to="/heatmap">
                <a class="intro__link">Тепловая карта</a>
              </router-link>
            </li>
            <li class="intro__item">
              <router-link to="/transportmap">
                <a class="intro__link">Карта совпадающих маршрутов</a>
              </router-link>
            </li>
          </ul>
        </nav>

      </div>
    </section>

    <div class="basic">
      <div class="container basic__container">
        <div class="basic__goal">
          <figure class="basic__block">
            <h1 class="basic__goal-title">Цель нашего проекта</h1>
            <p class="basic__goal-text">Главное назначение разрабатываемого приложения – визуализация пересечения маршрутов наземного транспорта. Данная система будет интересна для пассажиров наземного транспорта города Москвы.</p>
          </figure>
        </div>
        <div class="basic__link-items">
          <div class="basic__buttons-container">
            <router-link to="/heatmap">
              <a href="./heatmap.html" class="basic__button-link">
                <figure class="basic__heatmap">
                  <figcaption class="basic__heatmap-button">
                    <div class="basic__heatmap-text">
                      <p class="basic__button-text">Тепловая карта по районам Москвы</p>
                    </div>
                    <img :src="require('/src/assets/heatmap.png')" class="basic__heatmap-img" alt="Тепловая карта по районам Москвы">
                  </figcaption>

                </figure>
              </a>
            </router-link>

            <router-link to="/transportmap">
              <a class="basic__button-link">
                <figure class="basic__transportmap">
                  <figcaption class="basic__transportmap-button">
                    <div class="basic__transportmap-text">
                      <p class="basic__button-text">Карта с маршрутами, у которых более 60% остановок совпадают</p>
                    </div>
                    <img :src="require('/src/assets/transportmap.png')" class="basic__transportmap-img" alt="Маршрутная карта по районам Москвы">
                  </figcaption>
                </figure>
              </a>
            </router-link>
          </div>
          <div class="basic__links-block-container">
            <figure class="basic__links-block">
              <h1 class="basic__links-title">Полезные ссылки</h1>
              <div class="basic__list-block">
                <ul class="basic__links-list">
                  <li class="basic__list-item">
                    <a href="https://transport.mos.ru/mostrans/services/troika " class="basic__link">Онлайн пополнение карты "Тройка"</a>
                  </li>
                  <li class="basic__list-item">
                    <a href="https://www.mosgortrans.ru/passenger/rules/" class="basic__link">Правила пользования наземным городским транспортом</a>
                  </li>
                  <li class="basic__list-item">
                    <a href="https://www.mosgortrans.ru/passenger/fares/" class="basic__link">Тарифы и билеты</a>
                  </li>
                  <li class="basic__list-item">
                    <a href="https://transport.mos.ru/trains/shema_prigorod" class="basic__link">Схема пригородных поездов Москвы и области</a>
                  </li>
                  <li class="basic__list-item">
                    <a href="https://transport.mos.ru/mostrans/closures" class="basic__link">Актуальные данные о перекрытиях дорог</a>
                  </li>
                </ul>
              </div>
            </figure>

          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container footer__container">
        <img :src="require('/src/assets/logo-footer.svg')" alt="Logo" class="footer__logo">
        <p class="footer__names">Агиев Андрей<br>
          Буров Александр<br>
          Махмутов Булат</p>
      </div>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'MainPage',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
