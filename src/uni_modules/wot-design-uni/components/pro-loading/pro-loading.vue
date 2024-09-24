<template>
  <view
    :class="['pro-loading inline-flex items-center justify-center text-[#c8c9cc]', `pro-loading-${type}`, customClass]">
    <view :class="['pro-loading__spinner', `pro-loading__spinner--${type}`]" :style="loadingStyle">
      <view v-if="type === 'spinner'" v-for="(item, index) in array12" :key="index" class="pro-loading__dot" />
    </view>
    <view class="pro-loading__text" :style="textStyle">
      <slot />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // spinner | circular
    type: { type: String, default: 'circular' },
    color: { type: String, default: '#c9c9c9' },
    size: {
      type: [String, Number],
      default: '30px'
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    loadingStyle () {
      return {
        color: this.color,
        width: typeof this.size === 'string' ? this.size : `${this.size}px`,
        height: typeof this.size === 'string' ? this.size : `${this.size}px`
      }
    },
    textStyle () {
      return {
        fontSize: typeof this.size === 'string' ? this.size : `${this.size}px`
      }
    },
    array12 () {
      return new Array(12).fill(0)
    }
  }
}
</script>
<style>
@keyframes pro-rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.pro-loading__spinner {
  animation: pro-rotate var(--loading-spinner-animation-duration, .8s) linear infinite;
  box-sizing: border-box;
  height: var(--loading-spinner-size, 30px);
  max-height: 100%;
  max-width: 100%;
  position: relative;
  width: var(--loading-spinner-size, 30px)
}

.pro-loading__spinner--spinner {
  animation-timing-function: steps(12)
}

.pro-loading__spinner--circular {
  border: 1px solid transparent;
  border-radius: 100%;
  border-top-color: initial
}

.pro-loading__text {
  color: var(--loading-text-color, #969799);
  font-size: var(--loading-text-font-size, 14px);
  line-height: var(--loading-text-line-height, 20px);
  margin-left: var(--padding-xs, 8px)
}

.pro-loading__text:empty {
  display: none
}

.pro-loading--vertical {
  flex-direction: column
}

.pro-loading--vertical .pro-loading__text {
  margin: var(--padding-xs, 8px) 0 0
}

.pro-loading__dot {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%
}

.pro-loading__dot:before {
  background-color: currentColor;
  border-radius: 40%;
  content: " ";
  display: block;
  height: 25%;
  margin: 0 auto;
  width: 2px
}

.pro-loading__dot:first-of-type {
  opacity: 1;
  transform: rotate(30deg)
}

.pro-loading__dot:nth-of-type(2) {
  opacity: .9375;
  transform: rotate(60deg)
}

.pro-loading__dot:nth-of-type(3) {
  opacity: .875;
  transform: rotate(90deg)
}

.pro-loading__dot:nth-of-type(4) {
  opacity: .8125;
  transform: rotate(120deg)
}

.pro-loading__dot:nth-of-type(5) {
  opacity: .75;
  transform: rotate(150deg)
}

.pro-loading__dot:nth-of-type(6) {
  opacity: .6875;
  transform: rotate(180deg)
}

.pro-loading__dot:nth-of-type(7) {
  opacity: .625;
  transform: rotate(210deg)
}

.pro-loading__dot:nth-of-type(8) {
  opacity: .5625;
  transform: rotate(240deg)
}

.pro-loading__dot:nth-of-type(9) {
  opacity: .5;
  transform: rotate(270deg)
}

.pro-loading__dot:nth-of-type(10) {
  opacity: .4375;
  transform: rotate(300deg)
}

.pro-loading__dot:nth-of-type(11) {
  opacity: .375;
  transform: rotate(330deg)
}

.pro-loading__dot:nth-of-type(12) {
  opacity: .3125;
  transform: rotate(1turn)
}
</style>
