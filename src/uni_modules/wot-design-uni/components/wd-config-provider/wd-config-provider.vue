<template>
  <view :class="themeClass">
    <slot />
  </view>
</template>

<script lang="ts">
export default {
  name: 'wd-config-provider',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { configProviderProps } from './types'

const props = defineProps(configProviderProps)

const themeClass = computed(() => {
  return `wot-theme-${props.theme} ${props.customClass} ${props.theme}`
})

</script>

<style lang="scss" scoped></style>
