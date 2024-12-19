<template>
  <div
    :class="cn(`wd-key-wrapper ${wider ? 'wd-key-wrapper--wider' : ''}`)"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div :class="cn('wd-key', large ? 'wd-key--large' : '', type === 'delete' ? 'wd-key--delete' : '', type === 'close' ? 'wd-key--close' : '')">
      <wd-loading custom-class="wd-key__loading-icon" v-if="loading" />
      <template v-if="type === 'delete'">
        <template v-if="text">
          {{ text }}
        </template>
        <wd-icon v-else custom-class="wd-key__icon" name="keyboard-delete" size="22px"></wd-icon>
      </template>
      <template v-else-if="type === 'extra'">
        <template v-if="text">
          {{ text }}
        </template>
        <wd-icon v-else custom-class="wd-key__icon" name="keyboard-collapse" size="22px"></wd-icon>
      </template>
      <template v-else>{{ text }}</template>
    </div>
  </div>
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
import { cn } from '../../common/util'

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
