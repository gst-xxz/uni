<template>
  <view :style="{ height: addUnit(height) }">
    <view
      :class="cn(
        'navbarrelative text-center user-select-none box-border h-[44px] leading-[44px] bg-white',
        customClass, fixed ? 'is-fixed fixed top-0 left-0 w-full z-[500]' : '', bordered ? 'is-border hairline--bottom' : '')"
      :style="rootStyle">
      <view class="relative w-full h-full">
        <view class="absolute top-0 bottom-0 flex items-center px-12 py-0 text-base" v-if="$slots.capsule">
          <slot name="capsule" />
        </view>

        <view
          :class="cn('left-0 absolute top-0 bottom-0 flex items-center px-12 py-0 text-base', leftDisabled ? 'is-disabled' : '')"
          :hover-class="cn(leftDisabled || $slots.left ? '' : 'bg-[#eee]')" hover-stay-time="70"
          @click="handleClickLeft" v-else-if="!$slots.left">
          <pro-icon v-if="leftArrow" name="arrow-left" custom-class="text-2xl text-gray-1" />
          <view v-if="leftText" class="text-gray-1 inline-block align-middle">{{ leftText }}</view>
        </view>

        <view v-else
          :class="cn('left-0 absolute top-0 bottom-0 flex items-center px-12 py-0 text-base', leftDisabled ? 'is-disabled opacity-60' : '')"
          @click="handleClickLeft">
          <slot name="left" />
        </view>

        <view
          class="max-w-[60%] mx-auto my-0 h-full text-gray-1 font-semibold text-[18px] overflow-hidden text-ellipsis whitespace-nowrap">
          <slot name="title" />
          <block v-if="!$slots.title && title">{{ title }}</block>
        </view>
        <view
          :class="cn('right-0 absolute top-0 bottom-0 flex items-center px-12 py-0 text-base', rightDisabled ? 'is-disabled opacity-60' : '')"
          @click="handleClickRight" v-if="$slots.right || rightText" :hover-class="cn(rightDisabled ? '' : 'bg-[#eee]')"
          hover-stay-time="70">
          <slot name="right" />

          <view v-if="!$slots.right && rightText" class="text-gray-1 inline-block align-middle" hover-class="bg-[#eee]"
            hover-stay-time="70">
            {{ rightText }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
export default {
  name: 'pro-navbar',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { type CSSProperties, computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { getRect, addUnit, isDef, objToStyle } from '../common/util'
import { navbarProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(navbarProps)
const emit = defineEmits(['click-left', 'click-right'])

const height = ref<number | ''>('') // 占位高度

const { statusBarHeight } = uni.getSystemInfoSync()

watch(
  [() => props.fixed, () => props.placeholder],
  () => {
    setPlaceholderHeight()
  },
  { deep: true, immediate: false }
)

const rootStyle = computed(() => {
  const style: CSSProperties = {}
  if (props.fixed && isDef(props.zIndex)) {
    style['z-index'] = props.zIndex
  }
  if (props.safeAreaInsetTop) {
    style['padding-top'] = addUnit(statusBarHeight || 0)
  }
  return `${objToStyle(style)};${props.customStyle}`
})

onMounted(() => {
  if (props.fixed && props.placeholder) {
    nextTick(() => {
      setPlaceholderHeight()
    })
  }
})

function handleClickLeft() {
  if (!props.leftDisabled) {
    emit('click-left')
  }
}

function handleClickRight() {
  if (!props.rightDisabled) {
    emit('click-right')
  }
}

const { proxy } = getCurrentInstance() as any

function setPlaceholderHeight() {
  if (!props.fixed || !props.placeholder) {
    return
  }

  getRect('.navbar', false, proxy).then((res) => {
    height.value = res.height as number
  })
}
</script>
