<template>
  <wd-overlay v-if="cover" :z-index="zIndex" lock-scroll :show="show" custom-style="background-color: transparent;pointer-events: auto;"></wd-overlay>
  <wd-transition name="fade" :show="show" :custom-style="transitionStyle" @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
    <div :class="rootClass">
      <!--iconName优先级更高-->
      <wd-loading v-if="iconName === 'loading'" :type="loadingType" :color="loadingColor" :size="loadingSize" custom-class="wd-toast__icon" />
      <div
        class="wd-toast__iconWrap wd-toast__icon"
        v-else-if="iconName === 'success' || iconName === 'warning' || iconName === 'info' || iconName === 'error'"
      >
        <div class="wd-toast__iconBox">
          <wd-icon :name="iconName" custom-class="wd-toast__icon" :size="iconSize" />
        </div>
      </div>
      <wd-icon v-else-if="iconClass" custom-class="wd-toast__icon" :size="iconSize" :class-prefix="classPrefix" :name="iconClass"></wd-icon>
      <!--文本-->
      <div v-if="msg" class="wd-toast__msg">{{ msg }}</div>
    </div>
  </wd-transition>
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
import { defaultOptions, getToastOptionKey } from '.'
import { toastProps, type ToastLoadingType, type ToastOptions } from './types'
import { addUnit, isDef, isFunction, objToStyle } from '../common/util'

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
const classPrefix = ref<string>('wd-icon') // 图标前缀
const iconClass = ref<string>('') // 图标类名

let opened: (() => void) | null = null

let closed: (() => void) | null = null

const toastOptionKey = getToastOptionKey(props.selector)
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
  return `wd-toast ${props.customClass} wd-toast--${position.value} ${
    (iconName.value !== 'loading' || msg.value) && (iconName.value || iconClass.value) ? 'wd-toast--with-icon' : ''
  } ${iconName.value === 'loading' && !msg.value ? 'wd-toast--loading' : ''}`
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
      classPrefix.value = isDef(option.classPrefix) ? option.classPrefix : 'wd-icon'
      closed = isFunction(option.closed) ? option.closed : null
      opened = isFunction(option.opened) ? option.opened : null
    }
  }
}
</script>
<style>
.wd-toast {
  display: inline-block;
  max-width: var(--wot-toast-max-width, 300px);
  padding: var(--wot-toast-padding, 16px 24px);
  background-color: var(--wot-toast-bg, var(--wot-overlay-bg, rgba(0, 0, 0, 0.65)));
  border-radius: var(--wot-toast-radius, 8px);
  color: #fff;
  transition: all 0.2s;
  font-size: var(--wot-toast-fs, var(--wot-fs-content, 14px));
  box-sizing: border-box;
  box-shadow: var(--wot-toast-box-shadow, 0px 6px 16px 0px rgba(0, 0, 0, 0.08));
}

.wd-toast__msg {
  font-size: var(--wot-toast-fs, var(--wot-fs-content, 14px));
  line-height: 20px;
  text-align: left;
  font-family: San Francisco, Rotobo, arial, PingFang SC, Noto SansCJK, Microsoft Yahei, sans-serif;
}

.wd-toast__icon {
  display: inline-block;
  margin-right: var(--wot-toast-icon-margin-right, 12px);
  font-size: var(--wot-toast-icon-size, 32px);
}

.wd-toast__iconWrap {
  font-size: 0;
  line-height: 0;
  vertical-align: middle;
}

.wd-toast__iconBox {
  display: block;
  width: 100%;
  height: 100%;
}

.wd-toast__iconSvg {
  width: var(--wot-toast-icon-size, 32px);
  height: var(--wot-toast-icon-size, 32px);
  background-size: cover;
  background-repeat: no-repeat;
}

.wd-toast__loading {
  margin-bottom: 16px;
  display: inline-block;
}

.wd-toast--top {
  -webkit-transform: translate3d(0, -40vh, 0);
  transform: translate3d(0, -40vh, 0);
}

.wd-toast--middle {
  -webkit-transform: translate3d(0%, -18.8vh, 0);
  transform: translate3d(0, -18.8vh, 0);
}

.wd-toast--bottom {
  -webkit-transform: translate3d(0, 40vh, 0);
  transform: translate3d(0, 40vh, 0);
}

.wd-toast--with-icon {
  min-width: var(--wot-toast-with-icon-min-width, 150px);
  display: inline-flex;
  align-items: center;
}

.wd-toast--loading {
  min-width: auto;
  padding: var(--wot-toast-loading-padding, 10px);
}
</style>
