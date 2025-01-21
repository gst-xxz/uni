<template>
  <div :class="cn(`wd-password-input relative my-0 mx-4 select-none`, customClass)" :style="customStyle">
    <div @touchstart="onTouchStart" class="wd-password-input__security flex w-full h-[50px] cursor-pointer">
      <div
        v-for="(_, index) in length"
        :key="index"
        :class="
          cn(
            `wd-password-input__item relative flex flex-1 justify-center items-center h-full text-[#323233] text-xl leading-[1.2] bg-white`,
            gutter ? '' : 'is-border border border-solid border-[#ebedf0] first:rounded-l-md last:rounded-r-md border-r-0 last:border-r'
          )
        "
        :style="{ marginLeft: index !== 0 && gutter ? addUnit(gutter) : 0 }"
      >
        <div
          v-if="focused && index === modelValue.length"
          class="wd-password-input__cursor absolute top-1/2 left-1/2 w-px h-[40%] bg-[#323233] -translate-x-1/2 -translate-y-1/2 animate-[cursor-flicker_infinite]"
        ></div>
        <div v-else :class="cn(`wd-password-input__value`)">
          <div
            :class="
              cn(
                'wd-password-input__mask absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-[#323233] rounded-full -translate-x-1/2 -translate-y-1/2 invisible',
                mask && modelValue[index] ? 'visible' : 'invisible'
              )
            "
          ></div>
          <span v-if="!mask && modelValue[index]">{{ modelValue[index] }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="info || errorInfo"
      :class="cn(`wd-password-input__info mt-4 text-sm text-center text-[#909399]`, errorInfo ? 'is-error text-danger' : '')"
    >
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
