<template>
  <div v-if="showControls" class="wd-swiper-nav__btn">
    <div class="wd-swiper-nav__btn--prev" @click="handleNav('prev')" />
    <div class="wd-swiper-nav__btn--next" @click="handleNav('next')" />
  </div>
  <div v-if="total >= minShowNum" :style="customStyle"
    :class="`wd-swiper-nav wd-swiper-nav--${direction} wd-swiper-nav--${type} wd-swiper-nav--${indicatorPosition} ${customClass}`">
    <block v-if="type === 'dots' || type === 'dots-bar'">
      <div v-for="(_, index) in total" :key="index"
        :class="`wd-swiper-nav__item--${type} ${current === index ? 'is-active' : ''} is-${direction}`">
      </div>
    </block>
    <block v-if="type === 'fraction'">{{ current + 1 }}/{{ total }}</block>
  </div>
</template>

<script lang="ts" setup>
import { swiperNavprops } from './types'

defineProps(swiperNavprops)

const emit = defineEmits(['change'])

function handleNav(dir: 'prev' | 'next') {
  const source: string = 'nav'
  emit('change', { dir, source })
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
