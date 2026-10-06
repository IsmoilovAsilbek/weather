<script>
import MainContent from '@/components/MainContent.vue';
import MainWeek from '@/components/MainWeek.vue';
import Weatherfx from "@/components/Weatherfx.vue";

    export default {
        components: {
          Weatherfx,
            MainContent,
            MainWeek,

        }
    }
</script>

<template>
    <main class="main container">
        <MainContent/>
        <MainWeek/>
      <Weatherfx/>
    </main>
</template>

<style scoped lang="scss">

</style>
