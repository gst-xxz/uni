<template>
  <div @click="handleClick" :class="customClass" :style="styles">
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
import { computed } from 'vue'
import { addUnit, cn } from '../common/util'
import { iconProps } from './types'

const props = defineProps(iconProps)
const emit = defineEmits(['click', 'touch'])

function handleClick(event: any) {
  emit('click', event)
}

const styles = computed(() => ({
  ...props.customStyle,
  color: props.color,
  fontSize: addUnit(props.size)
}))
</script>

<style>
@import './assets/iconfont.css';
</style>
