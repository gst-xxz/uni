<template>
  <view :class="cn('text-[0]', customClass, { 'block': vertical })">
    <slot />
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-steps',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { useChildren } from '../composables/useChildren'
import { STEPS_KEY, stepsProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(stepsProps)

const { linkChildren } = useChildren(STEPS_KEY)

linkChildren({ props })
</script>
