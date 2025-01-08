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

<style>
.wd-key-wrapper {
  position: relative;
  flex: 1;
  flex-basis: 33%;
  box-sizing: border-box;
  padding: 0 6px 6px 0;
}

.wd-key-wrapper--wider {
  flex-basis: 66%;
}

.wd-key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--wot-number-keyboard-key-height, 48px);
  font-size: var(--wot-number-keyboard-key-font-size, 28px);
  line-height: 1.5;
  background: var(--wot-number-keyboard-key-background, var(--wot-color-white, rgb(255, 255, 255)));
  border-radius: var(--wot-number-keyboard-key-border-radius, 8px);
}

.wd-key:active {
  background-color: var(--wot-number-keyboard-key-active-color, var(--wot-color-gray-3, #ebedf0));
}

.wd-key--large {
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 6px;
  left: 0;
  height: auto;
}

.wd-key--delete,
.wd-key--close {
  font-size: var(--wot-number-keyboard-delete-font-size, 16px);
}

.wd-key--active {
  background-color: var(--wot-number-keyboard-key-active-color, var(--wot-color-gray-3, #ebedf0));
}

.wd-key--close {
  color: var(--wot-number-keyboard-button-text-color, var(--wot-color-white, rgb(255, 255, 255)));
  background: var(--wot-number-keyboard--button-background, var(--wot-color-theme, #4d80f0));
}

.wd-key--close:active {
  background: var(--wot-number-keyboard--button-background, var(--wot-color-theme, #4d80f0));
  opacity: var(--wot-number-keyboard-button-active-opacity, 0.6);
}

.wd-key__loading-icon {
  color: var(--wot-number-keyboard-button-text-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-key__icon {
  font-size: var(--wot-number-keyboard-icon-size, 22px);
}
</style>
