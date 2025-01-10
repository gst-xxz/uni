<template>
  <div v-if="showControls" class="wd-swiper-nav__btn">
    <div class="wd-swiper-nav__btn--prev" @click="handleNav('prev')" />
    <div class="wd-swiper-nav__btn--next" @click="handleNav('next')" />
  </div>
  <div
    v-if="total >= minShowNum"
    :style="customStyle"
    :class="cn(`wd-swiper-nav`, `wd-swiper-nav--${direction}`, `wd-swiper-nav--${type}`, `wd-swiper-nav--${indicatorPosition}`, customClass)"
  >
    <block v-if="type === 'dots' || type === 'dots-bar'">
      <div
        v-for="(_, index) in total"
        :key="index"
        :class="cn(`wd-swiper-nav__item--${type}`, current === index ? 'is-active' : '', `is-${direction}`)"
      ></div>
    </block>
    <block v-if="type === 'fraction'">{{ current + 1 }}/{{ total }}</block>
  </div>
</template>

<script lang="ts" setup>
import { cn } from '../common/util'
import { swiperNavprops } from './types'

defineProps(swiperNavprops)

const emit = defineEmits(['change'])

function handleNav(dir: 'prev' | 'next') {
  const source: string = 'nav'
  emit('change', { dir, source })
}
</script>

<style>
.wd-swiper-nav__btn--prev,
.wd-swiper-nav__btn--next {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  width: var(--wot-swiper-nav-btn-size, 1.5rem);
  height: var(--wot-swiper-nav-btn-size, 1.5rem);
  border-radius: 50%;
  background: var(--wot-swiper-nav-btn-bg-color, var(--wot-font-gray-3, rgba(0, 0, 0, 0.4)));
}

.wd-swiper-nav__btn--prev:after,
.wd-swiper-nav__btn--next:after {
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  content: '';
  width: 0.375rem;
  height: 0.375rem;
  border-color: var(--wot-swiper-nav-btn-color, var(--wot-font-white-1, rgb(255, 255, 255)));
  border-style: solid;
}

.wd-swiper-nav__btn--prev {
  left: 0.9375rem;
}

.wd-swiper-nav__btn--prev:after {
  margin-left: 0.125rem;
  border-width: 0.0625rem 0 0 0.0625rem;
  -webkit-transform: translate(-50%, -50%) rotateZ(-45deg);
  transform: translate(-50%, -50%) rotate(-45deg);
}

.wd-swiper-nav__btn--next {
  right: 0.9375rem;
}

.wd-swiper-nav__btn--next:after {
  margin-left: -0.125rem;
  border-width: 0.0625rem 0.0625rem 0 0;
  -webkit-transform: translate(-50%, -50%) rotateZ(45deg);
  transform: translate(-50%, -50%) rotate(45deg);
}

.wd-swiper-nav--dots,
.wd-swiper-nav--dots-bar {
  display: flex;
  flex-direction: row;
}

.wd-swiper-nav--fraction {
  padding: 0 0.5rem;
  height: var(--wot-swiper-nav-fraction-height, 1.5rem);
  line-height: var(--wot-swiper-nav-fraction-height, 1.5rem);
  border-radius: calc(var(--wot-swiper-nav-fraction-height, 1.5rem) / 2);
  background: var(--wot-swiper-nav-fraction-bg-color, var(--wot-font-gray-3, rgba(0, 0, 0, 0.4)));
  color: var(--wot-swiper-nav-fraction-color, var(--wot-font-white-1, rgb(255, 255, 255)));
  font-size: var(--wot-swiper-nav-fraction-font-size, 0.75rem);
}

.wd-swiper-nav__item--dots,
.wd-swiper-nav__item--dots-bar {
  width: var(--wot-swiper-nav-dot-size, 0.375rem);
  height: var(--wot-swiper-nav-dot-size, 0.375rem);
  background: var(--wot-swiper-nav-dot-color, var(--wot-font-white-2, rgba(255, 255, 255, 0.55)));
  border-radius: 50%;
  margin: 0 0.3125rem;
  transition: all 0.4s ease-in;
}

.wd-swiper-nav__item--dots.is-vertical,
.wd-swiper-nav__item--dots-bar.is-vertical {
  margin: 0.3125rem 0;
}

.wd-swiper-nav__item--dots.is-active,
.wd-swiper-nav__item--dots-bar.is-active {
  background-color: var(--wot-swiper-nav-dot-active-color, var(--wot-font-white-1, rgb(255, 255, 255)));
}

.wd-swiper-nav__item--dots-bar.is-vertical.is-active {
  width: var(--wot-swiper-nav-dot-size, 0.375rem);
  height: var(--wot-swiper-nav-dots-bar-active-width, 1.25rem);
}

.wd-swiper-nav__item--dots-bar.is-active {
  width: var(--wot-swiper-nav-dots-bar-active-width, 1.25rem);
  border-radius: calc(var(--wot-swiper-nav-dot-size, 0.375rem) / 2);
  background-color: var(--wot-swiper-nav-dot-active-color, var(--wot-font-white-1, rgb(255, 255, 255)));
}

.wd-swiper-nav--left {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.wd-swiper-nav--right {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.wd-swiper-nav--top-left {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}

.wd-swiper-nav--top {
  position: absolute;
  left: 50%;
  top: 0.75rem;
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
}

.wd-swiper-nav--top-right {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.wd-swiper-nav--bottom-left {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
}

.wd-swiper-nav--bottom {
  position: absolute;
  left: 50%;
  bottom: 0.75rem;
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
}

.wd-swiper-nav--bottom-right {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
}

.wd-swiper-nav--vertical {
  flex-direction: column;
}
</style>
