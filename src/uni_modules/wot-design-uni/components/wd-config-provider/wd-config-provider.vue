<template>
  <div :class="cn(`wot-theme-${theme}`, customClass)">
    <slot />
  </div>
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
import { configProviderProps } from './types'
import { cn } from '../common/util'

defineProps(configProviderProps)
</script>
