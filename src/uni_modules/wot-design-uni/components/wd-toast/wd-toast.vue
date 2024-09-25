<template>
  <pro-overlay v-if="cover" :z-index="zIndex" lock-scroll :show="show"
    custom-style="background-color: transparent;pointer-events: auto;"></pro-overlay>
  <pro-transition name="fade" :show="show" :custom-style="transitionStyle" @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave">
    <view :class="cn('wd-toast inline-block text-white box-border max-w-[300px] py-4 px-6 bg-black/65', customClass, `wd-toast--${position} ${(iconName !== 'loading' || msg) && (iconName || iconClass) ? 'min-h-[150px] inline-flex items-center' : ''
      } ${iconName === 'loading' && !msg ? 'wd-toast--loading' : ''}`)">
      <!--iconName优先级更高-->
      <pro-loading v-if="iconName === 'loading'" :type="loadingType" :color="loadingColor" :size="loadingSize"
        custom-class="inline-block mr-3 text-[32px]" />
      <view class="align-middle inline-block mr-3 text-[32px]"
        v-else-if="iconName === 'success' || iconName === 'warning' || iconName === 'info' || iconName === 'error'">
        <view class="block w-full h-full">
          <pro-icon class="w-8 h-8 leading-8" :name="iconName" :size="iconSize"></pro-icon>
        </view>
      </view>
      <pro-icon v-else-if="iconClass" custom-class="inline-block mr-3 text-[32px]" :size="iconSize"
        :class-prefix="classPrefix" :name="iconClass"></pro-icon>
      <!--文本-->
      <view v-if="msg" class="text-left text-sm">{{ msg }}</view>
    </view>
  </pro-transition>
</template>

<script lang="ts">
export default {
  name: 'wd-toast',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { computed, inject, ref, watch, type CSSProperties } from 'vue'
import { defaultOptions, toastDefaultOptionKey, } from '.'
import { toastProps, type ToastLoadingType, type ToastOptions } from './types'
import { addUnit, isDef, isFunction, objToStyle } from '../common/util'
import { cn } from '@/uni_modules/pro-core/lib/utils'

const props = defineProps(toastProps)

const iconName = ref<string>('') // 图标类型
const msg = ref<string>('') // 消息内容
const position = ref<string>('middle')
const show = ref<boolean>(false)
const zIndex = ref<number>(100)
const loadingType = ref<ToastLoadingType>('circular')
const loadingColor = ref<string>('#4D80F0')
const iconSize = ref<string>() // 图标大小
const loadingSize = ref<string>() // loading大小
const cover = ref<boolean>(false) // 是否存在遮罩层
const classPrefix = ref<string>('pro-icon') // 图标前缀
const iconClass = ref<string>('') // 图标类名

let opened: (() => void) | null = null

let closed: (() => void) | null = null

const toastOptionKey = props.selector ? toastDefaultOptionKey + props.selector : toastDefaultOptionKey
const toastOption = inject(toastOptionKey, ref<ToastOptions>(defaultOptions)) // toast选项

// 监听options变化展示
watch(
  () => toastOption.value,
  (newVal: ToastOptions) => {
    reset(newVal)
  },
  {
    deep: true,
    immediate: true
  }
)

/**
 * 动画自定义样式
 */
const transitionStyle = computed(() => {
  const style: CSSProperties = {
    'z-index': zIndex.value,
    position: 'fixed',
    top: '50%',
    left: 0,
    width: '100%',
    transform: 'translate(0, -50%)',
    'text-align': 'center'
  }
  return objToStyle(style)
})

const rootClass = computed(() => {
  return
})

function handleAfterEnter() {
  if (isFunction(opened)) {
    opened()
  }
}

function handleAfterLeave() {
  if (isFunction(closed)) {
    closed()
  }
}

/**
 * 重置toast选项值
 * @param option toast选项值
 */
function reset(option: ToastOptions) {
  if (option) {
    show.value = isDef(option.show) ? option.show : false

    if (show.value) {
      iconName.value = isDef(option.iconName!) ? option.iconName! : ''
      iconClass.value = isDef(option.iconClass!) ? option.iconClass! : ''
      msg.value = isDef(option.msg!) ? option.msg! : ''
      position.value = isDef(option.position!) ? option.position! : 'middle'
      zIndex.value = isDef(option.zIndex!) ? option.zIndex! : 100
      loadingType.value = isDef(option.loadingType!) ? option.loadingType! : 'circular'
      loadingColor.value = isDef(option.loadingColor!) ? option.loadingColor! : '#4D80F0'
      iconSize.value = isDef(option.iconSize) ? addUnit(option.iconSize) : option.iconSize
      loadingSize.value = isDef(option.loadingSize) ? addUnit(option.loadingSize) : option.loadingSize
      cover.value = isDef(option.cover!) ? option.cover! : false
      classPrefix.value = isDef(option.classPrefix) ? option.classPrefix : 'pro-icon'
      closed = isFunction(option.closed) ? option.closed : null
      opened = isFunction(option.opened) ? option.opened : null
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
