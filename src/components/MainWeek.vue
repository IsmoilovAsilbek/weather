<script>
import { mapState } from 'vuex'
import MainWeekItem from '@/components/MainWeekItem.vue'

export default {
  components: { MainWeekItem },
  computed: {
    ...mapState(['weather']),
    days() {
      return this.weather?.daily?.slice(0, 7) ?? []
    },
    min() {
      return Math.min(...this.days.map(d => d.temp.min))
    },
    max() {
      return Math.max(...this.days.map(d => d.temp.max))
    }
  }
}
</script>

<template>
  <section class="main__week-section">
    <h2 class="main__week-title">Прогноз на неделю</h2>

    <div class="main__week">
      <MainWeekItem
          v-for="(day, i) in days"
          :key="day.dt"
          :item="day"
          :index="i"
          :offset="weather.timezone_offset"
          :min="min"
          :max="max"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.main__week-section {
  margin-top: 40px;
}

.main__week-title {
  position: relative;
  display: inline-block;
  margin-bottom: 22px;
  font-size: 26px;
  font-weight: 700;
  color: var(--week-text, #fff);
  animation: titleIn 0.6s ease 0.35s backwards;

  // Sarlavha ostidagi chiziq chapdan o'ngga chiziladi
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 100%;
    height: 3px;
    border-radius: 3px;
    background: linear-gradient(90deg, #ffd666, transparent);
    transform-origin: left center;
    animation: lineGrow 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.6s backwards;
  }
}

.main__week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 16px;

  // Kichik ekranda kartalar yonga suriladi
  @media (max-width: 1100px) {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 160px;
    overflow-x: auto;
    padding: 16px 4px 24px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

@media (max-width: 600px) {
  .main__week {
    grid-auto-columns: 140px;
  }

  .main__week-title {
    font-size: 22px;
  }
}

@keyframes titleIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
}

@keyframes lineGrow {
  from {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .main__week-title,
  .main__week-title::after {
    animation: none;
  }
}
</style>