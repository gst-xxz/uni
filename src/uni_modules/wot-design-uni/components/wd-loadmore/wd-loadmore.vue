<template>
  <div :class="cn('wd-loadmore w-full h-12 leading-[48px] text-center text-black/45', customClass)" :style="customStyle" @click="reload">
    <wd-divider v-if="state === 'finished'">{{ finishedText }}</wd-divider>
    <block v-if="state === 'error'">
      <span class="wd-loadmore__text inline-block text-sm align-middle">{{ errorText }}</span>
      <span class="wd-loadmore__text inline-block text-sm align-middle is-light my-0 mx-1.5 text-primary">点击重试</span>
      <wd-icon name="refresh" custom-class="wd-loadmore__refresh inline-block text-primary align-middle text-base" />
    </block>
    <block v-if="state === 'loading'">
      <wd-loading
        v-bind="loadingProps as Partial<LoadingProps>"
        :class="cn(`wd-loadmore__loading inline-block mr-2 align-middle w-4 h-4`, customClass)"
      />
      <span class="wd-loadmore__text">{{ loadingText }}</span>
    </block>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-loadmore',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { loadmoreProps, type LoadMoreState } from './types'
import type { LoadingProps } from '../wd-loading/types'
import { cn } from '../common/util'

const props = defineProps(loadmoreProps)
const emit = defineEmits(['reload'])

const currentState = ref<LoadMoreState | null>(null)

function reload() {
  if (props.state !== 'error') {
    return
  }
  currentState.value = 'loading'
  emit('reload')
}
</script>
