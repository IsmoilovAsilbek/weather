<script>
import { getIcon } from '@/icons.js'
import { unix } from '@/unix.js'

export default {
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    },
    offset: {
      type: Number,
      default: 0
    },
    // Haftadagi eng past va eng baland harorat (shkala uchun)
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isToday() {
      return this.index === 0
    },
    getImg() {
      return getIcon(this.item.weather, { daily: true })
    },
    getWeekDay() {
      return this.isToday ? 'Сегодня' : unix(this.item.dt, 'weekday', this.offset)
    },
    getDay() {
      return unix(this.item.dt, 'day', this.offset)
    },
    getMonth() {
      return unix(this.item.dt, 'month', this.offset)
    },
    getInfo() {
      const text = this.item.weather?.[0]?.description
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Нет данных'
    },
    pop() {
      return Math.round((this.item.pop ?? 0) * 100)
    },
    // Kunlik harorat oralig'i haftaga nisbatan qayerda turishini ko'rsatadi
    barStyle() {
      const range = this.max - this.min || 1
      const width = Math.max(((this.item.temp.max - this.item.temp.min) / range) * 100, 10)
      const left = Math.min(((this.item.temp.min - this.min) / range) * 100, 100 - width)
      return { left: `${left}%`, width: `${width}%` }
    }
  }
}
</script>

<template>
  <div class="main__week-item" :class="{ 'is-today': isToday }" :style="{ '--i': index }">
    <p class="main__week-item-weekday">{{ getWeekDay }}</p>
    <p class="main__week-item-month">{{ getDay }} {{ getMonth }}</p>
    <img :src="getImg" alt="svg" class="main__week-item-img">

    <div class="main__week-item-temps">
      <p class="main__week-item-tempday">{{ Math.round(item.temp.max) }}°</p>
      <p class="main__week-item-tempnight">{{ Math.round(item.temp.night) }}°</p>
    </div>

    <div class="main__week-item-bar">
      <span class="main__week-item-bar-fill" :style="barStyle"></span>
    </div>

    <p class="main__week-item-info">{{ getInfo }}</p>

    <p class="main__week-item-pop" :class="{ 'is-dry': !pop }">
      <img src="../assets/images/kaplya.svg" alt="svg">
      {{ pop }}%
    </p>
  </div>
</template>

<style scoped lang="scss">
.main__week-item {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 22px 14px 18px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--week-text, #fff);
  text-align: center;
  // backwards: animatsiya tugagach hover transform'ga xalaqit bermaydi
  animation: weekIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  animation-delay: calc(0.5s + var(--i, 0) * 80ms);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease;

  // Hover paytida yaltiroq chiziq o'tadi
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.28) 50%, transparent 70%);
    transform: translateX(-130%);
    transition: transform 0.8s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-12px) scale(1.03);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);

    &::after {
      transform: translateX(130%);
    }

    .main__week-item-img {
      transform: scale(1.18) rotate(-6deg);
    }
  }

  // Bugungi kun ajralib turadi
  &.is-today {
    border-color: rgba(255, 214, 102, 0.85);
    background: rgba(255, 214, 102, 0.16);
    animation: weekIn 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards,
    todayGlow 3s ease-in-out 1.4s infinite;
    animation-delay: calc(0.5s + var(--i, 0) * 80ms), 1.4s;
  }
}

.main__week-item-weekday {
  font-size: 18px;
  font-weight: 700;
}

.main__week-item-month {
  font-size: 14px;
  opacity: 0.75;
}

.main__week-item-img {
  width: 68px;
  height: 68px;
  margin: 6px 0;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.main__week-item-temps {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.main__week-item-tempday {
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}

.main__week-item-tempnight {
  font-size: 18px;
  opacity: 0.65;
}

// Harorat shkalasi
.main__week-item-bar {
  position: relative;
  width: 100%;
  height: 6px;
  margin: 4px 0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
}

.main__week-item-bar-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 6px;
  background: linear-gradient(90deg, #5cc8ff, #ffd666, #ff7a3d);
  transform-origin: left center;
  animation: barGrow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  animation-delay: calc(0.9s + var(--i, 0) * 80ms);
}

.main__week-item-info {
  min-height: 2.6em;
  font-size: 14px;
  line-height: 1.3;
  opacity: 0.9;
}

.main__week-item-pop {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;

  img {
    width: 11px;
    height: 11px;
  }

  &.is-dry {
    opacity: 0.45;
  }
}

@keyframes weekIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
  }
}

@keyframes barGrow {
  from {
    transform: scaleX(0);
  }
}

@keyframes todayGlow {
  50% {
    box-shadow: 0 0 28px rgba(255, 214, 102, 0.55);
  }
}

@media (max-width: 1100px) {
  .main__week-item {
    scroll-snap-align: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .main__week-item,
  .main__week-item::after,
  .main__week-item-img,
  .main__week-item-bar-fill {
    animation: none !important;
    transition: none !important;
  }
}
</style>