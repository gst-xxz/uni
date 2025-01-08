<template>
  <div @click="handleClick" :class="customClass" :style="rootStyle">
    <span :class="cn('iconfont', `icon-${name}`)"></span>
  </div>
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
import { addUnit, objToStyle, cn } from '../common/util'
import { iconProps } from './types'

const props = defineProps(iconProps)
const emit = defineEmits(['click', 'touch'])

const rootStyle = computed(() => {
  const style: CSSProperties = {}
  if (props.color) {
    style['color'] = props.color
  }
  style['font-size'] = addUnit(props.size ?? 14)
  return `${objToStyle(style)}; ${props.customStyle}`
})

function handleClick(event: any) {
  emit('click', event)
}
</script>

<style>
@import './assets/iconfont.css';
</style>
