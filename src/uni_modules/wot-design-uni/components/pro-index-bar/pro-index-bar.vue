<template>
  <view class="relative w-full h-full" :id="indexBarId">
    <!-- #ifdef MP-DINGTALK -->
    <view class="pro-index-anchor" :id="indexBarId">
      <!-- #endif -->
      <scroll-view :scrollTop="scrollState.scrollTop" :scroll-y="true" class="w-full h-full" @scroll="hanleScroll">
        <slot></slot>
      </scroll-view>
      <view class="absolute -top-1/2 right-1 -translate-y-1/2" @touchstart.stop.prevent="handleTouchStart"
        @touchmove.stop.prevent="handleTouchMove" @touchend.stop.prevent="handleTouchEnd"
        @touchcancel.stop.prevent="handleTouchEnd">
        <view
          :class="cn('text-xs text-black py-1 px-1.5 font-medium', { 'text-primary': item.index === state.activeIndex })"
          v-for="item in children" :key="item.index">
          {{ item.index }}
        </view>
      </view>
      <!-- #ifdef MP-DINGTALK -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import type { AnchorIndex } from './type'
import { indexBarInjectionKey, indexBarProps } from './type'
import { ref, getCurrentInstance, onMounted, reactive, nextTick, watch } from 'vue'
import { getRect, isDef, uuid, requestAnimationFrame } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { cn } from '@/uni_modules/pro-core/lib/utils'
const props = defineProps(indexBarProps)

const indexBarId = ref<string>(`indexBar${uuid()}`)

const { proxy } = getCurrentInstance()!

const state = reactive({
  activeIndex: null as AnchorIndex | null
})

const { linkChildren, children } = useChildren(indexBarInjectionKey)

linkChildren({ props, anchorState: state })

watch(
  () => children,
  (newValue) => {
    if (!newValue.length) {
      state.activeIndex = null // 或者设置为一个默认值，如第一个子项的索引
      return
    }

    if (!isDef(state.activeIndex) || !newValue.find((item) => item.index === state.activeIndex)) {
      state.activeIndex = newValue[0].index
    }
  },
  { deep: true, immediate: true }
)

const scrollState = reactive({
  scrollTop: 0, // 即将滚动到的位置
  prevScrollTop: 0, // 上次记录的位置
  // 滚动距离
  touching: false
})

// 组件距离页面顶部的高度
let offsetTop = 0
let sidebarInfo = {
  // 侧边栏距离顶部的高度
  offsetTop: 0,
  // 高度固定24px
  indexHeight: 24
}

function init() {
  setTimeout(() => {
    Promise.all([
      getRect(`#${indexBarId.value}`, false, proxy),
      getRect('.wd-index-bar__sidebar', false, proxy),
      getRect('.wd-index-bar__index', false, proxy)
    ]).then(([bar, sidebar, index]) => {
      offsetTop = bar.top!
      sidebarInfo.offsetTop = sidebar.top!
      sidebarInfo.indexHeight = index.height!
    })
  }, 100)
}

onMounted(() => {
  init()
})

function hanleScroll(scrollEvent: any) {
  if (scrollState.touching) {
    return
  }
  const { detail } = scrollEvent
  const scrolltop = Math.floor(detail.scrollTop)
  const anchor = children.find((item, index) => {
    if (!isDef(children[index + 1])) return true
    if (item.$.exposed!.top.value - offsetTop <= scrolltop && children[index + 1].$.exposed!.top.value - offsetTop > scrolltop) return true
    return false
  })
  if (isDef(anchor) && state.activeIndex !== anchor.index) {
    state.activeIndex = anchor.index
  }
  scrollState.prevScrollTop = scrolltop
}

function getAnchorByPageY(pageY: number) {
  const y = pageY - sidebarInfo.offsetTop
  let idx = Math.floor(y / sidebarInfo.indexHeight)
  if (idx < 0) idx = 0
  else if (idx > children.length - 1) idx = children.length - 1
  return children[idx]
}

function handleTouchStart() {
  scrollState.touching = true
}

function handleTouchMove(e: TouchEvent) {
  const clientY = e.touches[0].pageY
  if (state.activeIndex === getAnchorByPageY(clientY).index) {
    return
  }
  state.activeIndex = getAnchorByPageY(clientY).index
  setScrollTop(getAnchorByPageY(clientY).$.exposed!.top.value - offsetTop)
}

function handleTouchEnd(e: TouchEvent) {
  const clientY = e.changedTouches[0].pageY
  state.activeIndex = getAnchorByPageY(clientY).index
  setScrollTop(getAnchorByPageY(clientY).$.exposed!.top.value - offsetTop)
  requestAnimationFrame(() => {
    scrollState.touching = false
  })
}

function setScrollTop(top: number) {
  if (scrollState.scrollTop === top) {
    scrollState.scrollTop = scrollState.prevScrollTop
    nextTick(() => {
      scrollState.scrollTop = top
    })
  } else {
    scrollState.scrollTop = top
  }
}
</script>
