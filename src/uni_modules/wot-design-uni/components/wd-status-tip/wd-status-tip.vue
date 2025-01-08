<template>
  <div :class="`wd-status-tip  ${customClass}`" :style="customStyle">
    <slot name="image" v-if="$slots.image"></slot>
    <wd-img v-else-if="imgUrl" :mode="imageMode" :src="imgUrl" custom-class="wd-status-tip__image" :custom-style="imgStyle"></wd-img>
    <div v-if="tip" class="wd-status-tip__text">{{ tip }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-status-tip',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import wdImg from '../wd-img/wd-img.vue'
import { computed, type CSSProperties } from 'vue'
import { addUnit, isDef, isObj, objToStyle } from '../common/util'
import { statusTipProps } from './types'

const props = defineProps(statusTipProps)

// 图片地址
const imgUrl = computed(() => {
  // 改用网络地址，避免小程序打包的时候统一打包进去导致包过大问题
  let img: string = ''
  if (['search', 'network', 'content', 'collect', 'comment', 'halo', 'message'].includes(props.image)) {
    img = `${props.urlPrefix}${props.image}.png`
  } else {
    img = props.image
  }
  return img
})

/**
 * 图片样式
 */
const imgStyle = computed(() => {
  let style: CSSProperties = {}
  if (props.imageSize) {
    if (isObj(props.imageSize)) {
      isDef(props.imageSize.height) && (style.height = addUnit(props.imageSize.height))
      isDef(props.imageSize.width) && (style.width = addUnit(props.imageSize.width))
    } else {
      style = {
        height: addUnit(props.imageSize),
        width: addUnit(props.imageSize)
      }
    }
  }
  return `${objToStyle(style)}`
})
</script>
<style>
.wd-status-tip {
  padding: var(--wot-statustip-padding, 5px 10px);
  width: 100%;
  margin: 0 auto;
  color: var(--wot-statustip-color, rgba(0, 0, 0, 0.45));
  font-size: var(--wot-statustip-fs, var(--wot-fs-content, 14px));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wd-status-tip__image {
  margin: 0 auto;
  width: 160px;
  height: 160px;
}

.wd-status-tip__text {
  margin: 20px auto 0;
  font-size: var(--wot-statustip-fs, var(--wot-fs-content, 14px));
  line-height: var(--wot-statustip-line-height, 16px);
  color: var(--wot-statustip-color, rgba(0, 0, 0, 0.45));
  text-align: center;
  overflow-wrap: break-word;
}
</style>
