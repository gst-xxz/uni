<template>
  <div
    @click="handleClick"
    :class="customClass"
    :style="{
      ...customStyle,
      color,
      fontSize: addUnit(size)
    }"
  >
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
import { addUnit, cn } from '../common/util'
import { iconProps } from './types'

defineProps(iconProps)
const emit = defineEmits(['click', 'touch'])

function handleClick(event: any) {
  emit('click', event)
}
</script>

<style>
@import './assets/iconfont.css';
</style>
