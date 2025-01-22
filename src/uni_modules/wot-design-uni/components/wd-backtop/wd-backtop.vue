<template>
  <wd-transition :show="show" name="fade">
    <div
      :class="
        cn(
          `wd-backtop fixed bg-[#e1e1e1] w-10 h-10 flex justify-center items-center text-gray-8`,
          shape === 'circle' ? 'rounded-full' : '',
          shape === 'square' ? 'rounded' : '',
          customClass
        )
      "
      :style="style"
      @click="handleBacktop"
    >
      <slot v-if="$slots.default"></slot>
      <wd-icon v-else custom-class="wd-backtop__backicon text-xl" name="backtop" :custom-style="iconStyle" />
    </div>
  </wd-transition>
</template>

<script lang="ts">
export default {
  name: 'wd-backtop',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref, type CSSProperties } from 'vue'
import { backtopProps } from './types'
import { addUnit, cn } from '../common/util'
import { onPageScroll } from '@dcloudio/uni-app'

const props = defineProps(backtopProps)

const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})
const show = computed(() => scrollTop.value > props.top)

function handleBacktop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: props.duration
  })
}

const style = computed<CSSProperties>(() => ({
  ...props.customStyle,
  'z-index': props.zIndex,
  bottom: addUnit(props.bottom),
  right: addUnit(props.right)
}))
</script>
