<template>
  <view :class="cn('pro-count-down text-sm text-gray-8', customClass)" :style="customStyle">
    <slot :current="current" v-if="$slots.default" />
    <block v-else>{{ timeText }}</block>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-count-down',
  options: {
  }
}
</script>

<script setup lang="ts">
import { watch, computed, onMounted } from 'vue'
import { parseFormat } from './utils'
import { useCountDown } from '../composables/useCountDown'
import { countDownProps, type CountDownExpose } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils'

const props = defineProps(countDownProps)

const emit = defineEmits(['change', 'finish'])

const { start, pause, reset, current } = useCountDown({
  time: props.time,
  millisecond: props.millisecond,
  onChange: (current) => emit('change', current),
  onFinish: () => emit('finish')
})

const timeText = computed(() => parseFormat(props.format, current.value))

const resetTime = () => {
  reset(props.time)
  if (props.autoStart) {
    start()
  }
}

watch(() => props.time, resetTime, { immediate: false })

onMounted(() => {
  resetTime()
})

defineExpose<CountDownExpose>({
  start,
  pause,
  reset: resetTime
})
</script>
