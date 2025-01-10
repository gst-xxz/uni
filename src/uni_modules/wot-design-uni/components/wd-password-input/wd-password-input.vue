<template>
  <div :class="cn(`wd-password-input relative my-0 mx-4 select-none`, customClass)" :style="customStyle">
    <div @touchstart="onTouchStart" class="wd-password-input__security flex w-full h-[50px] cursor-pointer">
      <div
        v-for="(_, index) in length"
        :key="index"
        :class="cn(`wd-password-input__item`, gutter ? '' : 'is-border')"
        :style="{ marginLeft: index !== 0 && gutter ? addUnit(gutter) : 0 }"
      >
        <div v-if="focused && index === modelValue.length" class="wd-password-input__cursor"></div>
        <div v-else :class="cn(`wd-password-input__value`)">
          <div :class="cn('wd-password-input__mask', mask && modelValue[index] ? 'visible' : 'invisible')"></div>
          <span v-if="!mask && modelValue[index]">{{ modelValue[index] }}</span>
        </div>
      </div>
    </div>
    <div v-if="info || errorInfo" :class="cn(`wd-password-input__info`, errorInfo ? 'is-error text-danger' : '')">
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
import { addUnit, cn } from '../common/util'
import { passwordInputProps } from './types'

defineProps(passwordInputProps)

const emit = defineEmits(['focus'])

function onTouchStart(event: Event) {
  emit('focus', event)
}
</script>

<style>
.wd-password-input__item {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--wot-password-input-text-color, var(--wot-color-gray-8, #323233));
  font-size: var(--wot-password-input-margin, 20px);
  line-height: 1.2;
  background: var(--wot-password-input-background, #fff);
}

.wd-password-input__item.is-border {
  border: 1px solid var(--wot-password-border-color, #ebedf0);
}

.wd-password-input__item.is-border:not(:last-child) {
  border-right: none;
}

.wd-password-input__item.is-border:first-child {
  border-top-left-radius: var(--wot-password-input-radius, 6px);
  border-bottom-left-radius: var(--wot-password-input-radius, 6px);
}

.wd-password-input__item.is-border:last-child {
  border-top-right-radius: var(--wot-password-input-radius, 6px);
  border-bottom-right-radius: var(--wot-password-input-radius, 6px);
}

.wd-password-input__mask {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--wot-password-input-dot-size, 10px);
  height: var(--wot-password-input-dot-size, 10px);
  background: var(--wot-password-input-dot-color, var(--wot-color-gray-8, #323233));
  border-radius: 100%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  visibility: hidden;
}

.wd-password-input__cursor {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--wot-password-input-cursor-width, 1px);
  height: var(--wot-password-input-cursor-height, 40%);
  background: var(--wot-password-input-cursor-color, var(--wot-color-gray-8, #323233));
  transform: translate(-50%, -50%);
  animation: var(--wot-password-input-cursor-duration, 1s) cursor-flicker infinite;
}

.wd-password-input__info {
  margin-top: var(--wot-password-input-margin, 16px);
  font-size: var(--wot-password-input-info-font-size, var(--wot-fs-content, 14px));
  text-align: center;
  color: var(--wot-password-input-info-color, var(--wot-color-info, #909399));
}

@keyframes cursor-flicker {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
