<template>
  <view v-if="showControls" class="wd-swiper-nav__btn">
    <view class="wd-swiper-nav__btn--prev absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-6 left-[15px] bg-black/40"
      @click="handleNav('prev')" />
    <view class="wd-swiper-nav__btn--next absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-6 right-[15px] bg-black/40"
      @click="handleNav('next')" />
  </view>
  <view v-if="total >= minShowNum" :style="customStyle"
    :class="`wd-swiper-nav wd-swiper-nav--${direction} wd-swiper-nav--${type} wd-swiper-nav--${indicatorPosition} ${customClass}`">
    <block v-if="type === 'dots' || type === 'dots-bar'">
      <view v-for="(item, index) in total" :key="index"
        :class="`wd-swiper-nav__item--${type} ${current === index ? 'is-active' : ''} is-${direction}`"></view>
    </block>
    <block v-if="type === 'fraction'">{{ current + 1 }}/{{ total }}</block>
  </view>
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
