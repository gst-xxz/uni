<template>
  <view
    :class="cn(`wd-key-wrapper relative flex-1 box-border pt-0 pr-1.5 pb-1.5 pl-0 basis-1/3 ${wider ? 'wd-key-wrapper--wider basis-2/3' : ''}`)"
    @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view :class="cn(`
      wd-key flex items-center justify-center h-12 text-[28px] leading-[1.5] bg-white rounded-lg active:bg-[#ebedf0]
      ${props.large ? 'wd-key--large absolute top-0 r-1.5 bottom-1.5 left-0 h-auto' : ''} 
      ${props.type === 'delete' ? 'wd-key--delete text-base' : ''} 
      ${props.type === 'close' ? 'wd-key--close text-base text-white bg-primary active:bg-primary active:opacity-60' : ''}
    `)">
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