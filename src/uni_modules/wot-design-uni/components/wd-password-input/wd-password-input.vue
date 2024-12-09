<template>
  <div :class="`wd-password-input ${customClass}`" :style="customStyle">
    <div @touchstart="onTouchStart" class="wd-password-input__security">
      <div v-for="(_, index) in length" :key="index" :class="`wd-password-input__item ${gutter ? '' : 'is-border'}`"
        :style="{ marginLeft: index !== 0 && gutter ? addUnit(gutter) : 0 }">
        <div v-if="focused && index === modelValue.length" class="wd-password-input__cursor">
        </div>
        <div v-else :class="`wd-password-input__value`">
          <div :style="{ visibility: mask && modelValue[index] ? 'visible' : 'hidden' }"
            class="wd-password-input__mask">
          </div>
          <text v-if="!mask && modelValue[index]">{{ modelValue[index] }}</text>
        </div>
      </div>
    </div>
    <div v-if="info || errorInfo" :class="`wd-password-input__info ${errorInfo ? 'is-error' : ''}`">
      {{ errorInfo || info }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-password-input',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { addUnit } from '../common/util'
import { passwordInputProps } from './types'

defineProps(passwordInputProps)

const emit = defineEmits(['focus'])

function onTouchStart(event: Event) {
  emit('focus', event)
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
