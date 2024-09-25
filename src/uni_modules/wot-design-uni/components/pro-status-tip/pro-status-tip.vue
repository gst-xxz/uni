<template>
  <view
    :class="cn('w-full my-0 mx-auto box-border flex flex-col items-center py-[5px] px-2.5 text-black/45 text-sm', customClass)"
    :style="customStyle">
    <wd-img v-if="imgUrl" :mode="imageMode" :src="imgUrl" custom-class="my-0 mx-auto w-40 h-40"
      :custom-style="imgStyle"></wd-img>
    <view v-if="tip" class="text-black/45 text-sm leading-4 mt-5 mx-auto mb-0 text-center break-all">
      {{ tip }}
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-status-tip',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'
import { addUnit, isDef, isObj, objToStyle } from '../common/util'
import { statusTipProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

const props = defineProps(statusTipProps)

// 图片地址
const imgUrl = computed(() => {
  // 改用网络地址，避免小程序打包的时候统一打包进去导致包过大问题
  let img: string = ''
  switch (props.image) {
    case 'collect':
      img = 'https://img.wot-design-uni.cn/wdu/collect.png'
      break
    case 'comment':
      img = 'https://img.wot-design-uni.cn/wdu/comment.png'
      break
    case 'content':
      img = 'https://img.wot-design-uni.cn/wdu/content.png'
      break
    case 'halo':
      img = 'https://img.wot-design-uni.cn/wdu/halo.png'
      break
    case 'message':
      img = 'https://img.wot-design-uni.cn/wdu/message.png'
      break
    case 'network':
      img = 'https://img.wot-design-uni.cn/wdu/network.png'
      break
    case 'search':
      img = 'https://img.wot-design-uni.cn/wdu/search.png'
      break
    default:
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