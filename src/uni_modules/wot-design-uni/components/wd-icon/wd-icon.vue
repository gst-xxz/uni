<template>
  <view @click="handleClick" :class="rootClass" :style="rootStyle">
    <span :class="className"></span>
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-icon',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'
import { addUnit, isDef, objToStyle, isImageUrl } from '../common/util'
import { iconProps } from './types'

const props = defineProps(iconProps)
const emit = defineEmits(['click', 'touch'])

const isImage = computed(() => {
  return isDef(props.name) && isImageUrl(props.name)
})

const rootClass = computed(() => {
  const prefix = props.classPrefix
  return `${prefix} ${props.customClass} ${isImage.value ? 'wd-icon--image' : prefix + '-' + props.name}`
})

const rootStyle = computed(() => {
  const style: CSSProperties = {}
  if (props.color) {
    style['color'] = props.color
  }
  if (props.size) {
    style['font-size'] = addUnit(props.size)
  }
  return `${objToStyle(style)}; ${props.customStyle}`
})

const className = computed(() => {
  return `iconfont icon-${props.name}`
})

function handleClick(event: any) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
