<template>
  <view :class="wrapperClass">
    <view :class="loadingClass" :style="loadingStyle">
      <view v-if="type === 'spinner'" v-for="(item, index) in array12" :key="index" class="wd-loading__dot" />
    </view>
    <view class="wd-loading__text" :style="textStyle">
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
    wrapperClass () {
      return `wd-loading wd-loading-${this.type} ${this.customClass}`
    },
    loadingClass () {
      return `wd-loading__spinner wd-loading__spinner--${this.type}`
    },
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
@keyframes wd-rotate {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.wd-loading {
  align-items: center;
  color: var(--loading-spinner-color, #c8c9cc);
  display: inline-flex;
  justify-content: center
}

.wd-loading__spinner {
  animation: wd-rotate var(--loading-spinner-animation-duration, .8s) linear infinite;
  box-sizing: border-box;
  height: var(--loading-spinner-size, 30px);
  max-height: 100%;
  max-width: 100%;
  position: relative;
  width: var(--loading-spinner-size, 30px)
}

.wd-loading__spinner--spinner {
  animation-timing-function: steps(12)
}

.wd-loading__spinner--circular {
  border: 1px solid transparent;
  border-radius: 100%;
  border-top-color: initial
}

.wd-loading__text {
  color: var(--loading-text-color, #969799);
  font-size: var(--loading-text-font-size, 14px);
  line-height: var(--loading-text-line-height, 20px);
  margin-left: var(--padding-xs, 8px)
}

.wd-loading__text:empty {
  display: none
}

.wd-loading--vertical {
  flex-direction: column
}

.wd-loading--vertical .wd-loading__text {
  margin: var(--padding-xs, 8px) 0 0
}

.wd-loading__dot {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%
}

.wd-loading__dot:before {
  background-color: currentColor;
  border-radius: 40%;
  content: " ";
  display: block;
  height: 25%;
  margin: 0 auto;
  width: 2px
}

.wd-loading__dot:first-of-type {
  opacity: 1;
  transform: rotate(30deg)
}

.wd-loading__dot:nth-of-type(2) {
  opacity: .9375;
  transform: rotate(60deg)
}

.wd-loading__dot:nth-of-type(3) {
  opacity: .875;
  transform: rotate(90deg)
}

.wd-loading__dot:nth-of-type(4) {
  opacity: .8125;
  transform: rotate(120deg)
}

.wd-loading__dot:nth-of-type(5) {
  opacity: .75;
  transform: rotate(150deg)
}

.wd-loading__dot:nth-of-type(6) {
  opacity: .6875;
  transform: rotate(180deg)
}

.wd-loading__dot:nth-of-type(7) {
  opacity: .625;
  transform: rotate(210deg)
}

.wd-loading__dot:nth-of-type(8) {
  opacity: .5625;
  transform: rotate(240deg)
}

.wd-loading__dot:nth-of-type(9) {
  opacity: .5;
  transform: rotate(270deg)
}

.wd-loading__dot:nth-of-type(10) {
  opacity: .4375;
  transform: rotate(300deg)
}

.wd-loading__dot:nth-of-type(11) {
  opacity: .375;
  transform: rotate(330deg)
}

.wd-loading__dot:nth-of-type(12) {
  opacity: .3125;
  transform: rotate(1turn)
}
</style>
