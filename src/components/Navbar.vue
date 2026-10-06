<script>
import logo from '@/assets/images/Header logo.svg'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      logo
    }
  },
  computed: {
    ...mapState(['city', 'loading']),
    getCity: {
      get() {
        return this.city
      },
      set(val) {
        this.setCity(val)
      }
    }
  },
  methods: {
    ...mapMutations(['setCity']),
    ...mapActions(['getWeather']),
    search() {
      if (!this.getCity.trim() || this.loading) return
      this.getWeather({ city: this.getCity })
    }
  }
}
</script>

<template>
  <nav class="nav">
    <div class="nav__box container">
      <a href="#" class="nav__box-link">
        <img :src="logo" alt="svg" class="nav__box-link-image">
        <span>vue weather</span>
      </a>
      <div class="nav__box-search" :class="{ 'is-loading': loading }">
        <img src="../assets/images/kaplya.svg" alt="svg" @click="search">
        <input
            type="text"
            placeholder="Выбрать город"
            class="nav__box-search-input"
            v-model="getCity"
            @keydown.enter="search"
        >
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav__box {
  @media (max-width: 750px) {
    flex-direction: column;
    gap: 30px;
  }
}

.nav__box-link-image {
  transition: transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.nav__box-link:hover .nav__box-link-image {
  transform: rotate(180deg);
}

.nav__box-search {
  position: relative;
  transition: box-shadow 0.25s ease;

  img {
    cursor: pointer;
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
  }

  // So'rov ketayotganda kichik aylanuvchi indikator
  &.is-loading::after {
    content: "";
    position: absolute;
    right: 14px;
    top: 50%;
    width: 16px;
    height: 16px;
    margin-top: -8px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 750px) {
  .nav__box-search {
    width: 100%;
    max-width: 420px;
  }

  .nav__box-search-input {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav__box-link-image {
    transition: none;
  }
}
</style>