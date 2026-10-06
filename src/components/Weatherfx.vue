```vue
<script>
export default {
  props: {
    weather: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    kind() {
      const id = this.weather?.[0]?.id ?? 800

      if (id >= 200 && id < 600) return "rain"
      if (id >= 600 && id < 700) return "snow"
      if (id >= 700 && id < 800) return "mist"
      if (id === 800) return "clear"

      return "clouds"
    },

    particles() {
      const random = (min, max) =>
          min + Math.random() * (max - min)

      const mobile =
          typeof window !== "undefined" &&
          window.innerWidth <= 480

      const create = (count, callback) =>
          Array.from({ length: count }, (_, index) => ({
            id: index,
            style: callback()
          }))

      if (this.kind === "rain") {
        return create(mobile ? 35 : 70, () => ({
          "--x": `${random(0, 100)}vw`,
          "--size": `${random(35, 80)}px`,
          "--duration": `${random(0.7, 1.3)}s`,
          "--delay": `-${random(0, 2)}s`,
          "--drift": `${random(-40, -15)}px`
        }))
      }

      if (this.kind === "snow") {
        return create(mobile ? 25 : 45, () => ({
          "--x": `${random(0, 100)}vw`,
          "--size": `${random(4, 9)}px`,
          "--duration": `${random(7, 14)}s`,
          "--delay": `-${random(0, 14)}s`,
          "--sway": `${random(-45, 45)}px`
        }))
      }

      if (this.kind === "clouds") {
        return create(mobile ? 3 : 5, () => ({
          "--y": `${random(5, 75)}vh`,
          "--size": `${random(35, 60)}vw`,
          "--duration": `${random(40, 70)}s`,
          "--delay": `-${random(0, 60)}s`
        }))
      }

      if (this.kind === "mist") {
        return create(mobile ? 4 : 7, () => ({
          "--y": `${random(10, 75)}vh`,
          "--size": `${random(40, 70)}vw`,
          "--duration": `${random(35, 60)}s`,
          "--delay": `-${random(0, 50)}s`
        }))
      }

      return [
        { id: 0, style: {} },
        { id: 1, style: {} }
      ]
    }
  }
}
</script>

<template>
  <div
      class="weather-fx"
      :class="`weather-fx--${kind}`"
      aria-hidden="true"
  >
    <span
        v-for="particle in particles"
        :key="particle.id"
        class="weather-fx__particle"
        :style="particle.style"
    ></span>
  </div>
</template>

<style scoped>
.weather-fx {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* =========================
   YOMG'IR
========================= */

.weather-fx--rain .weather-fx__particle {
  position: absolute;
  top: -100px;
  left: var(--x);

  width: 2px;
  height: var(--size);

  background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.6)
  );

  animation:
      rain-fall
      var(--duration)
      linear
      var(--delay)
      infinite;
}

@keyframes rain-fall {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(
        var(--drift),
        120vh,
        0
    );
  }
}

/* =========================
   QOR
========================= */

.weather-fx--snow .weather-fx__particle {
  position: absolute;
  top: -20px;
  left: var(--x);

  width: var(--size);
  height: var(--size);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.9);

  box-shadow:
      0 0 6px rgba(255, 255, 255, 0.6);

  animation:
      snow-fall
      var(--duration)
      linear
      var(--delay)
      infinite;
}

@keyframes snow-fall {
  0% {
    transform: translate3d(0, 0, 0);
  }

  50% {
    transform: translate3d(
        var(--sway),
        55vh,
        0
    );
  }

  100% {
    transform: translate3d(
        0,
        115vh,
        0
    );
  }
}

/* =========================
   BULUT
========================= */

.weather-fx--clouds .weather-fx__particle {
  position: absolute;
  top: var(--y);
  left: -60vw;

  width: var(--size);
  height: 25vh;

  max-width: 100vw;

  border-radius: 50%;

  background: rgba(
      255,
      255,
      255,
      0.12
  );

  filter: blur(45px);

  animation:
      cloud-move
      var(--duration)
      linear
      var(--delay)
      infinite;
}

@keyframes cloud-move {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(190vw);
  }
}

/* =========================
   TUMAN
========================= */

.weather-fx--mist .weather-fx__particle {
  position: absolute;
  top: var(--y);
  left: -60vw;

  width: var(--size);
  height: 18vh;

  max-width: 100vw;

  border-radius: 50%;

  background: rgba(
      255,
      255,
      255,
      0.16
  );

  filter: blur(35px);

  animation:
      mist-move
      var(--duration)
      linear
      var(--delay)
      infinite;
}

@keyframes mist-move {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(190vw);
  }
}

/* =========================
   QUYOSH
========================= */

.weather-fx--clear .weather-fx__particle:first-child {
  position: absolute;

  top: -25vmax;
  right: -25vmax;

  width: 60vmax;
  height: 60vmax;

  border-radius: 50%;

  background: radial-gradient(
      circle,
      rgba(255, 220, 120, 0.35),
      transparent 65%
  );

  animation:
      sun-pulse
      6s
      ease-in-out
      infinite;
}

.weather-fx--clear .weather-fx__particle:last-child {
  position: absolute;

  top: -40vmax;
  right: -40vmax;

  width: 90vmax;
  height: 90vmax;

  background: repeating-conic-gradient(
      from 0deg,
      rgba(255, 230, 150, 0.1)
      0deg 6deg,
      transparent 6deg 18deg
  );

  mask-image: radial-gradient(
      circle,
      #000 10%,
      transparent 65%
  );

  -webkit-mask-image: radial-gradient(
      circle,
      #000 10%,
      transparent 65%
  );

  animation:
      sun-rays
      90s
      linear
      infinite;
}

@keyframes sun-pulse {
  50% {
    transform: scale(1.12);
    opacity: 0.7;
  }
}

@keyframes sun-rays {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   TABLET
========================= */

@media (max-width: 768px) {
  .weather-fx--clouds .weather-fx__particle {
    filter: blur(30px);
    height: 20vh;
  }

  .weather-fx--mist .weather-fx__particle {
    filter: blur(25px);
    height: 15vh;
  }

  .weather-fx--clear .weather-fx__particle:first-child {
    width: 50vmax;
    height: 50vmax;
  }

  .weather-fx--clear .weather-fx__particle:last-child {
    width: 75vmax;
    height: 75vmax;
  }
}

/* =========================
   TELEFON
========================= */

@media (max-width: 480px) {
  .weather-fx {
    width: 100vw;
    height: 100dvh;
  }

  .weather-fx--rain .weather-fx__particle {
    width: 1.5px;
  }

  .weather-fx--snow .weather-fx__particle {
    opacity: 0.8;
  }

  .weather-fx--clouds .weather-fx__particle {
    filter: blur(22px);
    height: 16vh;
  }

  .weather-fx--mist .weather-fx__particle {
    filter: blur(18px);
    height: 12vh;
  }

  .weather-fx--clear .weather-fx__particle:first-child {
    top: -18vmax;
    right: -18vmax;

    width: 45vmax;
    height: 45vmax;
  }

  .weather-fx--clear .weather-fx__particle:last-child {
    top: -30vmax;
    right: -30vmax;

    width: 65vmax;
    height: 65vmax;
  }
}

/* =========================
   KICHIK TELEFON
========================= */

@media (max-width: 375px) {
  .weather-fx--rain .weather-fx__particle {
    opacity: 0.75;
  }

  .weather-fx--clouds .weather-fx__particle {
    filter: blur(18px);
  }

  .weather-fx--mist .weather-fx__particle {
    filter: blur(15px);
  }

  .weather-fx--clear .weather-fx__particle:first-child {
    top: -15vmax;
    right: -15vmax;

    width: 40vmax;
    height: 40vmax;
  }

  .weather-fx--clear .weather-fx__particle:last-child {
    top: -25vmax;
    right: -25vmax;

    width: 55vmax;
    height: 55vmax;
  }
}

/* =========================
   REDUCED MOTION
========================= */

@media (prefers-reduced-motion: reduce) {
  .weather-fx__particle {
    animation: none !important;
  }
}
</style>
```
