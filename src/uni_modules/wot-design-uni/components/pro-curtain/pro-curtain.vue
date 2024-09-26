<template>
  <view>
    <pro-popup v-model="show" transition="zoom-in" position="center" :close-on-click-modal="closeOnClickModal"
      :hide-when-close="hideWhenClose" @before-enter="beforeenter" @enter="enter" @after-enter="afterenter"
      @before-leave="beforeleave" @leave="leave" @after-leave="afterleave" @close="close" @click-modal="clickModal"
      :custom-class="cn(`inline-block overflow-y-visible text-[0] bg-transparent rounded-3xl ${customClass}`)"
      :custom-style="customStyle">
      <view class="relative inline-block bg-transparent rounded-3xl">
        <image :src="src" class="block w-auto h-auto rounded-3xl" :style="imgStyle" @click="clickImage" @error="imgErr"
          @load="imgLoad"></image>
        <pro-icon name="cross" :custom-class="cn(
          `absolute top-2.5 right-2.5 p-1.5 m-0 text-white text-2xl tap-transparent`, {
          'my-0 mr-0 ml-[-18px] top-[-62px] right-unset left-1/2 bottom-unset': closePosition === 'top',
          'm-0 top-[-62px] right-unset left-[-6px] bottom-unset': closePosition === 'top-left',
          'm-0 top-[-62px] right-[-6px] left-unset bottom-unset': closePosition === 'top-right',
          'm-0 ml-[-18px] top-unset right-unset left-1/2 bottom-[-62px]': closePosition === 'bottom',
          'm-0 top-unset right-unset left-[-6px] bottom-[-62px]': closePosition === 'bottom-left',
          'm-0 top-unset right-[-6px] left-unset bottom-[-62px]': closePosition === 'bottom-right'
        })" @click="close" />
      </view>
    </pro-popup>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-curtain',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { curtainProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(curtainProps)

const emit = defineEmits([
  'beforeenter',
  'enter',
  'afterenter',
  'beforeleave',
  'leave',
  'afterleave',
  'close',
  'closed',
  'click-modal',
  'load',
  'error',
  'click'
])

const show = ref<boolean>(false)
const imgSucc = ref<boolean>(true)
const imgStyle = ref<string>('')
const imgScale = ref<number>(1)

watch(
  () => props.value,
  () => {
    computedShowImg()
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.width,
  () => {
    computeImgStyle()
  },
  {
    deep: true,
    immediate: true
  }
)

function computedShowImg() {
  if (props.value && imgSucc.value) {
    show.value = true
  } else {
    show.value = false
    close()
  }
}

function computeImgStyle() {
  let style = ''
  if (props.width) {
    style += `width: ${props.width}px ;`
    style += `height: ${props.width / imgScale.value}px`
  }
  imgStyle.value = style
}

function beforeenter() {
  emit('beforeenter')
}

function enter() {
  emit('enter')
}
function afterenter() {
  emit('afterenter')
}

function beforeleave() {
  emit('beforeleave')
}

function leave() {
  emit('leave')
}

function afterleave() {
  emit('afterleave')
  emit('closed')
}

function close() {
  show.value = false
  emit('close')
}

function clickModal() {
  emit('click-modal')
}

function imgLoad(event: any) {
  const { height, width } = event.detail
  imgScale.value = width / height
  imgSucc.value = true
  computeImgStyle()
  emit('load')
}
function imgErr() {
  imgSucc.value = false
  emit('error')
}

function clickImage() {
  if (props.to) {
    uni.navigateTo({
      url: props.to
    })
  }
  emit('click')
  close()
}
</script>
