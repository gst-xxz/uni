<template>
  <div class="wd-curtain-wrapper">
    <wd-popup
      v-model="show"
      transition="zoom-in"
      position="center"
      :close-on-click-modal="closeOnClickModal"
      :hide-when-close="hideWhenClose"
      :z-index="zIndex"
      @before-enter="beforeenter"
      @enter="enter"
      @after-enter="afterenter"
      @before-leave="beforeleave"
      @leave="leave"
      @after-leave="afterleave"
      @close="close"
      @click-modal="clickModal"
      :custom-class="cn(`wd-curtain inline-block rounded-3xl !overflow-y-visible bg-transparent text-[0]`, customClass)"
      :custom-style="customStyle"
    >
      <div class="wd-curtain__content relative inline-block bg-transparent rounded-3xl">
        <img
          :src="src"
          class="wd-curtain__content-img block w-auto h-auto rounded-3xl"
          :style="imgStyle"
          @click="clickImage"
          @error="imgErr"
          @load="imgLoad"
        />
        <slot name="close">
          <wd-icon
            name="close-outline"
            class=""
            :custom-class="
              cn(
                `wd-curtain__content-close absolute m-0 p-1.5 top-2.5 right-2.5 text-white text-2xl tap-highlight-transparent`,
                closePosition === 'top' && 'my-0 mr-0 -ml-[18px] -top-[62px] right-[unset] left-1/2 bottom-[unset]',
                closePosition === 'top-left' && 'm-0 -top-[62px] right-[unset] -left-1.5 bottom-[unset]',
                closePosition === 'top-right' && 'm-0 -top-[62px] left-[unset] -right-1.5 bottom-[unset]',
                closePosition === 'bottom' && 'my-0 mr-0 -ml-[18px] -bottom-[62px] right-[unset] left-1/2 top-[unset]',
                closePosition === 'bottom-left' && 'm-0 -bottom-[62px] right-[unset] -left-1.5 top-[unset]',
                closePosition === 'bottom-right' && 'm-0 -bottom-[62px] left-[unset] -right-1.5 top-[unset]',
                customCloseClass
              )
            "
            :custom-style="customCloseStyle"
            @click="close"
          />
        </slot>
      </div>
    </wd-popup>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-curtain',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref, watch, type CSSProperties } from 'vue'
import { curtainProps } from './types'
import { addUnit, cn } from '../common/util'

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
const imgScale = ref<number>(1)

watch(
  () => props.value,
  (newVal) => {
    if (newVal && imgSucc.value) {
      show.value = true
    } else {
      show.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const imgStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (props.width) {
    style.width = addUnit(props.width)
    style.height = addUnit(props.width / imgScale.value)
  }
  return style
})

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
