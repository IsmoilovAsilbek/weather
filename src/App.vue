<script>
import Navbar from "@/components/Navbar.vue";
import MainData from "@/components/MainData.vue";
import WeatherFx from "@/components/Weatherfx.vue";
import {mapActions, mapMutations, mapState} from "vuex";

// Geolokatsiya ruxsat berilmasa shu shahar ko'rsatiladi
const DEFAULT_CITY = 'Tashkent'

export default {
  components: {MainData, Navbar, WeatherFx},
  data() {
    return {
      toastTimer: null
    }
  },
  created() {
    this.getLocation();
  },
  beforeUnmount() {
    clearTimeout(this.toastTimer)
  },
  computed: {
    ...mapState(['weather', 'error'])
  },
  watch: {
    // Ma'lumot bor paytda xato chiqsa, 4 soniyadan keyin yo'qoladi
    error(message) {
      clearTimeout(this.toastTimer)
      if (message && this.weather) {
        this.toastTimer = setTimeout(() => this.setError(''), 4000)
      }
    }
  },
  methods: {
    ...mapActions(['getWeather']),
    ...mapMutations(['setError']),
    getLocation() {
      const fallback = () => this.getWeather({city: DEFAULT_CITY})

      if (!("geolocation" in navigator)) {
        console.error("Geolocation is not supported on the user's device.");
        return fallback()
      }

      navigator.geolocation.getCurrentPosition(
          ({coords}) => {
            this.getWeather({lat: coords.latitude, lon: coords.longitude});
          },
          (error) => {
            console.error("Geolocation error:", error.message);
            fallback()
          },
          {timeout: 8000}
      );
    }
  }
}
</script>

<template>
  <div v-if="weather" class="wrapper">
    <WeatherFx :weather="weather.current.weather"/>
    <header class="header">
      <Navbar/>
      <!-- key o'zgarganda (yangi shahar) kontent yumshoq almashadi -->
      <Transition name="fade" mode="out-in">
        <MainData :key="weather.name + weather.current.dt"/>
      </Transition>
    </header>

    <Transition name="toast">
      <p v-if="error" class="toast" role="alert">{{ error }}</p>
    </Transition>
  </div>

  <div v-else-if="error" class="wrapper-loader">
    <p class="load-error">{{ error }}</p>
    <button class="load-retry" @click="getLocation">Повторить</button>
  </div>

  <div v-else class="wrapper-loader">
    <span class="loader"></span>
  </div>

</template>

<style>

.header {
  min-height: 100vh;
  min-height: 100dvh; /* telefonda manzil paneli hisobga olinadi */
  display: flex;
  flex-direction: column;
}

.wrapper-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100vh;
}

.loader {
  animation: rotate 1s infinite;
  height: 50px;
  width: 50px;
}

.loader:before,
.loader:after {
  border-radius: 50%;
  content: "";
  display: block;
  height: 20px;
  width: 20px;
}

.loader:before {
  animation: ball1 1s infinite;
  background-color: #fff;
  box-shadow: 30px 0 0 #ff3d00;
  margin-bottom: 10px;
}

.loader:after {
  animation: ball2 1s infinite;
  background-color: #ff3d00;
  box-shadow: 30px 0 0 #fff;
}

/* Xato ekrani */
.load-error {
  max-width: 320px;
  text-align: center;
  color: #fff;
  font-size: 18px;
}

.load-retry {
  padding: 10px 24px;
  border: 0;
  border-radius: 8px;
  background: #ff3d00;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.load-retry:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.load-retry:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

/* Xabar (toast) */
.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 15px;
  z-index: 10;
  width: max-content;
  max-width: calc(100vw - 32px);
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg) scale(0.8)
  }

  50% {
    transform: rotate(360deg) scale(1.2)
  }

  100% {
    transform: rotate(720deg) scale(0.8)
  }
}

@keyframes ball1 {
  0% {
    box-shadow: 30px 0 0 #ff3d00;
  }

  50% {
    box-shadow: 0 0 0 #ff3d00;
    margin-bottom: 0;
    transform: translate(15px, 15px);
  }

  100% {
    box-shadow: 30px 0 0 #ff3d00;
    margin-bottom: 10px;
  }
}

@keyframes ball2 {
  0% {
    box-shadow: 30px 0 0 #fff;
  }

  50% {
    box-shadow: 0 0 0 #fff;
    margin-top: -20px;
    transform: translate(15px, 15px);
  }

  100% {
    box-shadow: 30px 0 0 #fff;
    margin-top: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>