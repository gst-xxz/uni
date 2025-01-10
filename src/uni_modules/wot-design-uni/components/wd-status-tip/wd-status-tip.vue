<template>
  <div
    :class="cn(`wd-status-tip py-[5px] px-2.5 w-full my-0 mx-auto text-black/45 text-sm box-border flex flex-col items-center`, customClass)"
    :style="customStyle"
  >
    <slot name="image" v-if="$slots.image"></slot>
    <wd-img
      v-else-if="imgUrl"
      :mode="imageMode"
      :src="imgUrl"
      custom-class="wd-status-tip__image my-0 mx-auto w-40 h-40"
      :custom-style="imgStyle"
    ></wd-img>
    <div v-if="tip" class="wd-status-tip__text text-sm leading-4 text-black/45 text-center break-words mt-5 mx-auto mb-0">{{ tip }}</div>
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
import { addUnit, cn, isDef, isObj } from '../common/util'
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
  return style
})
</script>
