<template>
  <view @click="handleClick" :class="customClass" :style="rootStyle">
    <span :class="['iconfont', `icon-${name}`]"></span>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-icon',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'
import { addUnit, objToStyle } from '../common/util'
import { iconProps } from './types'

const props = defineProps(iconProps)
const emit = defineEmits(['click', 'touch'])

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

function handleClick(event: any) {
  emit('click', event)
}
</script>

<style>
@import './styles/iconfont.css';
</style>
