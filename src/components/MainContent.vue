<script>
import { mapState } from 'vuex'
import { getIcon } from '@/icons'
import { unix } from '@/unix'
import { windDirection, hpaToMmHg } from '@/helpers'
import tempImg from '@/assets/images/temp.svg'
import davleniyeImg from '@/assets/images/davleniye.svg'
import osadkiImg from '@/assets/images/osadki.svg'
import windImg from '@/assets/images/wind.svg'
import kaplyaImg from '@/assets/images/kaplya.svg'
import sunImg from '@/assets/images/sun.svg'

export default {
  data() {
    return {
      shownTemp: 0,
      now: Date.now(),
      clock: null,
      raf: null
    }
  },
  computed: {
    ...mapState(['weather']),
    current() {
      return this.weather.current
    },
    offset() {
      return this.weather.timezone_offset
    },
    getTime() {
      try {
        return new Date(this.now).toLocaleTimeString('ru-RU', {
          timeZone: this.weather.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23'
        })
      } catch {
        return '--:--'
      }
    },
    getImg() {
      return getIcon(this.current.weather)
    },
    description() {
      const text = this.current.weather?.[0]?.description || ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
    pressure() {
      const mm = hpaToMmHg(this.current.pressure)
      const label = mm < 740 ? 'пониженное' : mm > 770 ? 'повышенное' : 'нормальное'
      return `${mm} мм рт. ст. — ${label}`
    },
    precipitation() {
      const mm = this.current.rain?.['1h'] ?? this.current.snow?.['1h']
      if (mm) return `${mm} мм/ч`

      const pop = Math.round((this.weather.daily?.[0]?.pop ?? 0) * 100)
      return pop ? `Без осадков (вероятность сегодня ${pop}%)` : 'Без осадков'
    },
    content() {
      const c = this.current
      return [
        {
          img: tempImg,
          name: 'Температура',
          info: `${Math.round(c.temp)}°C — ощущается как ${Math.round(c.feels_like)}°C`
        },
        { img: davleniyeImg, name: 'Давление', info: this.pressure },
        { img: osadkiImg, name: 'Облачность', info: `${c.clouds} %` },
        {
          img: windImg,
          name: 'Ветер',
          info: `${c.wind_speed} м/с, ${windDirection(c.wind_deg)}`
        },
        { img: kaplyaImg, name: 'Влажность', info: `${c.humidity} %` },
        { img: osadkiImg, name: 'Осадки', info: this.precipitation },
        {
          img: sunImg,
          name: 'Восход / закат',
          info: `${unix(c.sunrise, 'time', this.offset)} / ${unix(c.sunset, 'time', this.offset)}`
        }
      ]
    }
  },
  watch: {
    'weather.current.temp': {
      immediate: true,
      handler(value) {
        this.animateTemp(Math.round(value))
      }
    }
  },
  mounted() {
    this.clock = setInterval(() => {
      this.now = Date.now()
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.clock)
    cancelAnimationFrame(this.raf)
  },
  methods: {
    // Kartaga sichqoncha olib borilganda 3D egilish
    onTilt(e) {
      // Telefon (sichqoncha yo'q) va reduced-motion da egilish o'chiq
      if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-4px)`
    },
    onLeave(e) {
      e.currentTarget.style.transform = ''
    },
    animateTemp(to) {
      cancelAnimationFrame(this.raf)
      const from = this.shownTemp
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced || from === to) {
        this.shownTemp = to
        return
      }

      const start = performance.now()
      const duration = 900

      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        this.shownTemp = Math.round(from + (to - from) * eased)
        if (p < 1) this.raf = requestAnimationFrame(tick)
      }

      this.raf = requestAnimationFrame(tick)
    }
  }
}
</script>

<template>
  <div class="main__content">

    <div class="main__content-left" v-if="weather">
      <div class="main__content-left-box">
        <p class="main__content-left-box-degree">{{ shownTemp }}°</p>
        <p class="main__content-left-box-desc">{{ description }}</p>
        <p class="main__content-left-box-today">Сегодня</p>
        <p class="main__content-left-box-time">Время: {{ getTime }}</p>
        <p class="main__content-left-box-city">Город: {{ weather.name.toUpperCase() }}</p>
      </div>
      <Transition name="swap" mode="out-in">
        <img :key="getImg" :src="getImg" alt="svg" class="main__content-left-img">
      </Transition>
    </div>

    <div class="main__content-right">
      <img src="../assets/images/headerBg.png" alt="png" class="main__content-right-bg">

      <div
          class="main__content-right-item"
          v-for="(item, i) in content"
          :key="item.name"
          :style="{ '--i': i }"
          @mousemove="onTilt"
          @mouseleave="onLeave"
      >
        <div class="main__content-right-item-img">
          <img :src="item.img" alt="svg">
        </div>
        <span>{{ item.name }}</span>
        <p>{{ item.info }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.main__content {
  @media (max-width: 1250px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
}

// Sahifa ochilishidagi yagona ketma-ketlik: chap blok -> o'ng kartalar -> hafta
.main__content-left-box {
  animation: slideRight 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
}

.main__content-left-box-desc {
  margin-bottom: 8px;
  font-size: 18px;
  opacity: 0.85;
}

.main__content-left-img {
  // `translate` alohida xususiyat, shuning uchun Transition'dagi transform bilan to'qnashmaydi
  animation: float 5s ease-in-out infinite, glow 4s ease-in-out infinite;
}

.main__content-right-item {
  animation: slideUp 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  animation-delay: calc(0.15s + var(--i, 0) * 60ms);
  transition: transform 0.2s ease-out;

  &:hover .main__content-right-item-img {
    transform: scale(1.12) rotate(-6deg);
  }
}

.main__content-right-item-img {
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

// Ob-havo ikonkasi almashganda
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes glow {
  50% {
    filter: drop-shadow(0 0 28px rgba(255, 214, 102, 0.75));
  }
}

@keyframes float {
  50% {
    translate: 0 -12px;
  }
}

@media (max-width: 750px) {
  .main__content-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }

  .main__content-left-box-degree {
    font-size: clamp(72px, 24vw, 120px);
  }

  .main__content-left-img {
    width: min(240px, 65vw);
    height: auto;
  }

  .main__content-right {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .main__content-right-item {
    max-width: 100%;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 480px) {
  .main__content-left-box-desc {
    font-size: 16px;
  }

  .main__content-right-item {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .main__content-left-box,
  .main__content-left-img,
  .main__content-right-item,
  .main__content-right-item-img,
  .swap-enter-active,
  .swap-leave-active {
    animation: none;
    transition: none;
  }
}
</style>