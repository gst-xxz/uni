<template>
  <div :class="cn(`wd-img relative inline-block`, round ? 'is-round overflow-hidden rounded-full' : '', customClass)"
    @click="handleClick" :style="rootStyle">
    <img :class="cn(`wd-img__image block w-full h-full box-border`, customImage)"
      :style="status !== 'success' ? 'width: 0;height: 0;' : ''" :src="src" :mode="mode"
      :show-menu-by-longpress="showMenuByLongpress" :lazy-load="lazyLoad" @load="handleLoad" @error="handleError" />
    <slot v-if="status === 'loading'" name="loading"></slot>
    <slot v-if="status === 'error'" name="error"></slot>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-img',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { addUnit, cn, isDef, objToStyle } from '../common/util'
import { imgProps } from './types'

const props = defineProps(imgProps)
const emit = defineEmits<{
  (e: 'error', event: Event): void
  (e: 'click', event: MouseEvent): void
  (e: 'load', event: Event): void
}>()

const rootStyle = computed(() => {
  const style: Record<string, string | number> = {}
  if (isDef(props.height)) {
    style['height'] = addUnit(props.height)
  }
  if (isDef(props.width)) {
    style['width'] = addUnit(props.width)
  }
  if (isDef(props.radius)) {
    style['border-radius'] = addUnit(props.radius)
    style['overflow'] = 'hidden'
  }
  return `${objToStyle(style)};${props.customStyle}`
})

const status = ref<'loading' | 'error' | 'success'>('loading')

function handleError(event: any) {
  status.value = 'error'
  emit('error', event)
}
function handleClick(event: MouseEvent) {
  if (props.enablePreview && props.src) {
    uni.previewImage({
      urls: [props.src]
    })
  }
  emit('click', event)
}
function handleLoad(event: any) {
  status.value = 'success'
  emit('load', event)
}
</script>
