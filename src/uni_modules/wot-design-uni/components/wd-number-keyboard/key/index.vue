<template>
  <view
    :class="cn(`wd-key-wrapper relative flex-1 box-border pt-0 pr-1.5 pb-1.5 pl-0 ${wider ? 'wd-key-wrapper--wider' : ''}`)"
    @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view :class="`wd-key flex items-center justify-center ${props.large ? 'wd-key--large absolute top-0 r-1.5 bottom-1.5 left-0 h-auto' : ''} ${props.type === 'delete' ? 'wd-key--delete' : ''} ${props.type === 'close' ? 'wd-key--close text-white' : ''
      }`">
      <pro-loading custom-class="wd-key__loading-icon text-white" v-if="props.loading" />
      <template v-if="type === 'delete'">
        <template v-if="text">
          {{ text }}
        </template>
        <pro-icon v-else custom-class="wd-key__icon text-[22px]" name="keyboard-delete" size="22px"></pro-icon>
      </template>
      <template v-else-if="type === 'extra'">
        <template v-if="text">
          {{ text }}
        </template>
        <pro-icon v-else custom-class="wd-key__icon text-[22px]" name="keyboard-collapse" size="22px"></pro-icon>
      </template>
      <template v-else>{{ text }}</template>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'wd-key',
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
import { cn } from '@/uni_modules/pro-core/lib/utils'

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
