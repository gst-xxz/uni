<template>
  <view :class="`relative flex-1 basis-1/3 box-border pt-0 pr-1.5 pb-1.5 pl-0 ${wider ? 'basis-2/3' : ''}`"
    @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view :class="`flex items-center justify-center active:bg-[#ebedf0] bg-white h-12 text-[28px] leading-[1.5] rounded-lg ${large ? 'absolute top-0 right-1.5 bottom-1.5 left-0 h-auto' : ''} ${type === 'delete' ? 'text-base' : ''} ${type === 'close' ? 'text-white bg-primary active:opacity-60 text-base' : ''
      }`">
      <pro-loading custom-class="text-white" v-if="props.loading" />
      <template v-if="type === 'delete'">
        <template v-if="text">
          {{ text }}
        </template>
        <pro-icon v-else custom-class="text-[22px]" name="keyboard-delete" size="22px"></pro-icon>
      </template>
      <template v-else-if="type === 'extra'">
        <template v-if="text">
          {{ text }}
        </template>
        <pro-icon v-else custom-class="text-[22px]" name="keyboard-collapse" size="22px"></pro-icon>
      </template>
      <template v-else>{{ text }}</template>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-key',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTouch } from '../../composables/useTouch'
import { keyProps } from './types'

const props = defineProps(keyProps)
const emit = defineEmits(['press'])

const touch = useTouch()
const active = ref<boolean>(false)

function onTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  active.value = true
}

function onTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

function onTouchEnd() {
  if (active.value) {
    active.value = false
    emit('press', props.text, props.type)
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
