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
      :custom-class="cn(`wd-curtain`, customClass)"
      :custom-style="customStyle"
    >
      <div class="wd-curtain__content">
        <img :src="src" class="wd-curtain__content-img" :style="imgStyle" @click="clickImage" @error="imgErr" @load="imgLoad" />
        <slot name="close">
          <wd-icon
            name="close-outline"
            :custom-class="cn(`wd-curtain__content-close`, closePosition, customCloseClass)"
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

<style>
.wd-curtain-wrapper .wd-curtain {
  display: inline-block;
  border-radius: var(--wot-curtain-content-radius, 24px);
  overflow-y: visible !important;
  background: transparent;
  font-size: 0;
}

.wd-curtain__content {
  position: relative;
  display: inline-block;
  background: transparent;
  border-radius: var(--wot-curtain-content-radius, 24px);
}

.wd-curtain__content-link {
  display: block;
  border-radius: var(--wot-curtain-content-radius, 24px);
}

.wd-curtain__content-img {
  display: block;
  width: auto;
  height: auto;
  border-radius: var(--wot-curtain-content-radius, 24px);
}

.wd-curtain__content-close {
  position: absolute;
  margin: 0;
  padding: 6px;
  top: 10px;
  right: 10px;
  color: var(--wot-curtain-content-close-color, var(--wot-color-white, rgb(255, 255, 255)));
  font-size: var(--wot-curtain-content-close-fs, var(--wot-fs-big, 24px));
  -webkit-tap-highlight-color: transparent;
}

.wd-curtain__content-close.top {
  margin: 0 0 0 -18px;
  top: -62px;
  right: unset;
  left: 50%;
  bottom: unset;
}

.wd-curtain__content-close.top-left {
  margin: 0;
  top: -62px;
  right: unset;
  left: -6px;
  bottom: unset;
}

.wd-curtain__content-close.top-right {
  margin: 0;
  top: -62px;
  right: -6px;
  left: unset;
  bottom: unset;
}

.wd-curtain__content-close.bottom {
  margin: 0 0 0 -18px;
  top: unset;
  right: unset;
  left: 50%;
  bottom: -62px;
}

.wd-curtain__content-close.bottom-left {
  margin: 0;
  top: unset;
  right: unset;
  left: -6px;
  bottom: -62px;
}

.wd-curtain__content-close.bottom-right {
  margin: 0;
  top: unset;
  right: -6px;
  left: unset;
  bottom: -62px;
}
</style>
