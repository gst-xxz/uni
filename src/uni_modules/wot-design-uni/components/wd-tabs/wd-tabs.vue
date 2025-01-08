<template>
  <template v-if="sticky">
    <wd-sticky-box>
      <div
        :class="cn(`wd-tabs ${customClass} ${innerSlidable ? 'is-slide' : ''} ${mapNum < children.length && mapNum !== 0 ? 'is-map' : ''}`)"
        :style="customStyle"
      >
        <wd-sticky :offset-top="offsetTop">
          <div class="wd-tabs__nav wd-tabs__nav--sticky">
            <div class="wd-tabs__nav--wrap">
              <scroll-view :scroll-x="innerSlidable" scroll-with-animation :scroll-left="state.scrollLeft">
                <div class="wd-tabs__nav-container">
                  <div
                    @click="handleSelect(index)"
                    v-for="(item, index) in children"
                    :key="index"
                    :class="cn(`wd-tabs__nav-item  ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`)"
                    :style="state.activeIndex === index ? (color ? 'color:' + color : '') : inactiveColor ? 'color:' + inactiveColor : ''"
                  >
                    <wd-badge v-if="item.badgeProps" v-bind="item.badgeProps">
                      <span class="wd-tabs__nav-item-text">{{ item.title }}</span>
                    </wd-badge>
                    <span v-else class="wd-tabs__nav-item-text">{{ item.title }}</span>

                    <div class="wd-tabs__line wd-tabs__line--inner" v-if="state.activeIndex === index && state.useInnerLine"></div>
                  </div>
                  <div class="wd-tabs__line" :style="state.lineStyle"></div>
                </div>
              </scroll-view>
            </div>
            <div class="wd-tabs__map" v-if="mapNum < children.length && mapNum !== 0">
              <div :class="cn(`wd-tabs__map-btn  ${state.animating ? 'is-open' : ''}`)" @click="toggleMap">
                <div :class="cn(`wd-tabs__map-arrow  ${state.animating ? 'is-open' : ''}`)">
                  <wd-icon name="arrow-down" />
                </div>
              </div>
              <div class="wd-tabs__map-header" :style="`${state.mapShow ? '' : 'display:none;'}  ${state.animating ? 'opacity:1;' : ''}`">
                {{ mapTitle || translate('all') }}
              </div>
              <div :class="cn(`wd-tabs__map-body  ${state.animating ? 'is-open' : ''}`)" :style="state.mapShow ? '' : 'display:none'">
                <div class="wd-tabs__map-nav-item" v-for="(item, index) in children" :key="index" @click="handleSelect(index)">
                  <div
                    :class="cn(`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''}  ${item.disabled ? 'is-disabled' : ''}`)"
                    :style="
                      state.activeIndex === index
                        ? color
                          ? 'color:' + color + ';border-color:' + color
                          : ''
                        : inactiveColor
                        ? 'color:' + inactiveColor
                        : ''
                    "
                  >
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </wd-sticky>

        <div class="wd-tabs__container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
          <div :class="cn(['wd-tabs__body', animated ? 'is-animated' : ''])" :style="bodyStyle">
            <slot />
          </div>
        </div>

        <div class="wd-tabs__mask" :style="`${state.mapShow ? '' : 'display:none;'} ${state.animating ? 'opacity:1;' : ''}`" @click="toggleMap"></div>
      </div>
    </wd-sticky-box>
  </template>

  <template v-else>
    <div :class="cn(`wd-tabs ${customClass} ${innerSlidable ? 'is-slide' : ''} ${mapNum < children.length && mapNum !== 0 ? 'is-map' : ''}`)">
      <div class="wd-tabs__nav">
        <div class="wd-tabs__nav--wrap">
          <scroll-view :scroll-x="innerSlidable" scroll-with-animation :scroll-left="state.scrollLeft">
            <div class="wd-tabs__nav-container">
              <div
                v-for="(item, index) in children"
                @click="handleSelect(index)"
                :key="index"
                :class="cn(`wd-tabs__nav-item ${state.activeIndex === index ? 'is-active' : ''} ${item.disabled ? 'is-disabled' : ''}`)"
                :style="state.activeIndex === index ? (color ? 'color:' + color : '') : inactiveColor ? 'color:' + inactiveColor : ''"
              >
                <wd-badge custom-class="wd-tabs__nav-item-badge" v-if="item.badgeProps" v-bind="item.badgeProps">
                  <span class="wd-tabs__nav-item-text">{{ item.title }}</span>
                </wd-badge>
                <span v-else class="wd-tabs__nav-item-text">{{ item.title }}</span>
                <div class="wd-tabs__line wd-tabs__line--inner" v-if="state.activeIndex === index && state.useInnerLine"></div>
              </div>
              <div class="wd-tabs__line" :style="state.lineStyle"></div>
            </div>
          </scroll-view>
        </div>
        <div class="wd-tabs__map" v-if="mapNum < children.length && mapNum !== 0">
          <div class="wd-tabs__map-btn" @click="toggleMap">
            <div :class="cn(`wd-tabs__map-arrow ${state.animating ? 'is-open' : ''}`)">
              <wd-icon name="arrow-down" />
            </div>
          </div>
          <div class="wd-tabs__map-header" :style="`${state.mapShow ? '' : 'display:none;'}  ${state.animating ? 'opacity:1;' : ''}`">
            {{ translate('all') }}
          </div>
          <div :class="cn(`wd-tabs__map-body ${state.animating ? 'is-open' : ''}`)" :style="state.mapShow ? '' : 'display:none'">
            <div class="wd-tabs__map-nav-item" v-for="(item, index) in children" :key="index" @click="handleSelect(index)">
              <div :class="cn(`wd-tabs__map-nav-btn ${state.activeIndex === index ? 'is-active' : ''}  ${item.disabled ? 'is-disabled' : ''}`)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wd-tabs__container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
        <div :class="cn(['wd-tabs__body', animated ? 'is-animated' : ''])" :style="bodyStyle">
          <slot />
        </div>
      </div>

      <div class="wd-tabs__mask" :style="`${state.mapShow ? '' : 'display:none;'}  ${state.animating ? 'opacity:1' : ''}`" @click="toggleMap"></div>
    </div>
  </template>
</template>
<script lang="ts">
export default {
  name: 'wd-tabs',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import wdSticky from '../wd-sticky/wd-sticky.vue'
import wdStickyBox from '../wd-sticky-box/wd-sticky-box.vue'
import { computed, getCurrentInstance, onMounted, watch, nextTick, reactive, type CSSProperties, type ComponentInstance } from 'vue'
import { addUnit, checkNumRange, debounce, getRect, isDef, isNumber, isString, objToStyle, cn } from '../common/util'
import { useTouch } from '../composables/useTouch'
import { TABS_KEY, tabsProps, type TabsExpose } from './types'
import { useChildren } from '../composables/useChildren'
import { useTranslate } from '../composables/useTranslate'

const $item = '.wd-tabs__nav-item'
const $itemText = '.wd-tabs__nav-item-text'
const $container = '.wd-tabs__nav-container'

const props = defineProps(tabsProps)
const emit = defineEmits(['change', 'disabled', 'click', 'update:modelValue'])

const { translate } = useTranslate('tabs')

const state = reactive({
  activeIndex: 0, // 选中值的索引，默认第一个
  lineStyle: 'display:none;', // 激活项边框线样式
  useInnerLine: false, // 是否使用内部激活项边框线，当外部激活下划线未成功渲染时显示内部定位的
  inited: false, // 是否初始化
  animating: false, // 是否动画中
  mapShow: false, // map的开关
  scrollLeft: 0 // scroll-view偏移量
})

const { children, linkChildren } = useChildren(TABS_KEY)
linkChildren({ state, props })

const { proxy } = getCurrentInstance() as any

const touch = useTouch()

const innerSlidable = computed(() => {
  return props.slidable === 'always' || children.length > props.slidableNum
})

const bodyStyle = computed(() => {
  if (!props.animated) {
    return ''
  }

  return objToStyle({
    left: -100 * state.activeIndex + '%',
    'transition-duration': props.duration + 'ms',
    '-webkit-transition-duration': props.duration + 'ms'
  })
})

const getTabName = (tab: ComponentInstance<any>, index: number) => {
  return isDef(tab.name) ? tab.name : index
}

/**
 * 更新激活项
 * @param value 激活值
 * @param init 是否已初始化
 * @param setScroll // 是否设置scroll-view滚动
 */
const updateActive = (value: number | string = 0, init: boolean = false, setScroll: boolean = true) => {
  // 没有tab子元素，不执行任何操作
  if (children.length === 0) return

  value = getActiveIndex(value)
  // 被禁用，不执行任何操作
  if (children[value].disabled) return
  state.activeIndex = value
  if (setScroll) {
    updateLineStyle(init === false)
    scrollIntoView()
  }
  setActiveTab()
}

/**
 * @description 修改选中的tab Index
 * @param {String |Number } value - radio绑定的value或者tab索引，默认值0
 * @param {Boolean } init - 是否伴随初始化操作
 */
const setActive = debounce(updateActive, 100, { leading: true })

watch(
  () => props.modelValue,
  (newValue) => {
    if (!isNumber(newValue) && !isString(newValue)) {
      console.error('[wot design] error(wd-tabs): the type of value should be number or string')
    }
    // 保证不为非空字符串，小于0的数字
    if (newValue === '' || !isDef(newValue)) {
      // eslint-disable-next-line quotes
      console.error("[wot design] error(wd-tabs): tabs's value cannot be '' null or undefined")
    }
    if (typeof newValue === 'number' && newValue < 0) {
      // eslint-disable-next-line quotes
      console.error("[wot design] error(wd-tabs): tabs's value cannot be less than zero")
    }
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.modelValue,
  (newValue) => {
    const index = getActiveIndex(newValue)
    setActive(newValue, false, index !== state.activeIndex)
  },
  {
    immediate: false,
    deep: true
  }
)

watch(
  () => children.length,
  () => {
    if (state.inited) {
      nextTick(() => {
        setActive(props.modelValue)
      })
    }
  }
)

watch(
  () => props.slidableNum,
  (newValue) => {
    checkNumRange(newValue, 'slidableNum')
  }
)

watch(
  () => props.mapNum,
  (newValue) => {
    checkNumRange(newValue, 'mapNum')
  }
)

onMounted(() => {
  state.inited = true
  nextTick(() => {
    updateActive(props.modelValue, true)
    state.useInnerLine = true
  })
})

function toggleMap() {
  if (state.mapShow) {
    state.animating = false
    setTimeout(() => {
      state.mapShow = false
    }, 300)
  } else {
    state.mapShow = true
    setTimeout(() => {
      state.animating = true
    }, 100)
  }
}

/**
 * 更新 underline的偏移量
 * @param animation 是否开启动画
 */
async function updateLineStyle(animation: boolean = true) {
  if (!state.inited) return
  const { autoLineWidth, lineWidth, lineHeight } = props
  try {
    const lineStyle: CSSProperties = {}
    if (isDef(lineWidth)) {
      lineStyle.width = addUnit(lineWidth)
    } else {
      if (autoLineWidth) {
        const textRects = await getRect($itemText, true, proxy)
        const textWidth = Number(textRects[state.activeIndex].width)
        lineStyle.width = addUnit(textWidth)
      }
    }
    if (isDef(lineHeight)) {
      lineStyle.height = addUnit(lineHeight)
      lineStyle.borderRadius = `calc(${addUnit(lineHeight)} / 2)`
    }
    const rects = await getRect($item, true, proxy)
    const rect = rects[state.activeIndex]
    let left = rects.slice(0, state.activeIndex).reduce((prev, curr) => prev + Number(curr.width), 0) + Number(rect.width) / 2
    if (left) {
      lineStyle.transform = `translateX(${left}px) translateX(-50%)`
      if (animation) {
        lineStyle.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);'
      }
      state.useInnerLine = false
      state.lineStyle = objToStyle(lineStyle)
    }
  } catch (error) {
    console.error('[wot design] error(wd-tabs): update line style failed', error)
  }
}

function setActiveTab() {
  if (!state.inited) return
  const name = getTabName(children[state.activeIndex], state.activeIndex)
  if (name !== props.modelValue) {
    emit('change', {
      index: state.activeIndex,
      name: name
    })
    emit('update:modelValue', name)
  }
}

function scrollIntoView() {
  if (!state.inited) return
  Promise.all([getRect($item, true, proxy), getRect($container, false, proxy)]).then(([navItemsRects, navRect]) => {
    // 选中元素
    const selectItem = navItemsRects[state.activeIndex]
    // 选中元素之前的节点的宽度总和
    const offsetLeft = (navItemsRects as any).slice(0, state.activeIndex).reduce((prev: any, curr: any) => prev + curr.width, 0)
    // scroll-view滑动到selectItem的偏移量
    const left = offsetLeft - ((navRect as any).width - Number(selectItem.width)) / 2
    if (left === state.scrollLeft) {
      state.scrollLeft = left + Math.random() / 10000
    } else {
      state.scrollLeft = left
    }
  })
}

/**
 * @description 单击tab的处理
 * @param index
 */
function handleSelect(index: number) {
  if (index === undefined) return
  const { disabled } = children[index]
  const name = getTabName(children[index], index)

  if (disabled) {
    emit('disabled', {
      index,
      name
    })
    return
  }
  state.mapShow && toggleMap()
  setActive(index)
  emit('click', {
    index,
    name
  })
}
function onTouchStart(event: any) {
  if (!props.swipeable) return
  touch.touchStart(event)
}
function onTouchMove(event: any) {
  if (!props.swipeable) return
  touch.touchMove(event)
}
function onTouchEnd() {
  if (!props.swipeable) return
  const { direction, deltaX, offsetX } = touch
  const minSwipeDistance = 50
  if (direction.value === 'horizontal' && offsetX.value >= minSwipeDistance) {
    if (deltaX.value > 0 && state.activeIndex !== 0) {
      setActive(state.activeIndex - 1)
    } else if (deltaX.value < 0 && state.activeIndex !== children.length - 1) {
      setActive(state.activeIndex + 1)
    }
  }
}
function getActiveIndex(value: number | string) {
  // name代表的索引超过了children长度的边界，自动用0兜底
  if (isNumber(value) && value >= children.length) {
    // eslint-disable-next-line prettier/prettier
    console.error('[wot design] warning(wd-tabs): the type of tabs\' value is Number shouldn\'t be less than its children')
    value = 0
  }
  // 如果是字符串直接匹配，匹配不到用0兜底
  if (isString(value)) {
    const index = children.findIndex((item) => item.name === value)
    value = index === -1 ? 0 : index
  }

  return value
}

defineExpose<TabsExpose>({
  setActive,
  scrollIntoView,
  updateLineStyle
})
</script>
<style>
.wd-tabs {
  position: relative;
  background: #fff;
  width: 100%;
}

.wd-tabs__nav {
  left: 0;
  right: 0;
  height: var(--wot-tabs-nav-height, 42px);
  background-color: #fff;
  width: 100%;
  position: relative;
}

.wd-tabs__nav--wrap {
  height: 100%;
  overflow: hidden;
}

.wd-tabs__nav--sticky {
  width: 100vw;
}

.wd-tabs__nav-container {
  position: relative;
  display: flex;
  -webkit-user-select: none;
  user-select: none;
}

.wd-tabs__nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  height: var(--wot-tabs-nav-height, 42px);
  font-size: var(--wot-tabs-nav-fs, var(--wot-fs-content, 14px));
  color: var(--wot-tabs-nav-color, rgba(0, 0, 0, 0.85));
  transition: color 0.3s;
}

.wd-tabs__nav-item.is-active {
  font-weight: 600;
}

.wd-tabs__nav-item.is-disabled {
  color: var(--wot-tabs-nav-disabled-color, rgba(0, 0, 0, 0.25));
}

.wd-tabs__nav-item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-tabs__nav-item-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
}

.wd-tabs__line {
  position: absolute;
  bottom: 4px;
  left: 0;
  z-index: 1;
  height: var(--wot-tabs-nav-line-height, 3px);
  width: var(--wot-tabs-nav-line-width, 19px);
  background: var(--wot-tabs-nav-line-bg-color, var(--wot-color-theme, #4d80f0));
  border-radius: calc(var(--wot-tabs-nav-line-height, 3px) / 2);
}

.wd-tabs__line--inner {
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
}

.wd-tabs__container {
  overflow: hidden;
}

.wd-tabs__body {
  position: relative;
  width: 100%;
  height: 100%;
}

.wd-tabs__body.is-animated {
  display: flex;
  transition-property: left;
}

.wd-tabs__map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.wd-tabs__map-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: var(--wot-tabs-nav-height, 42px);
  height: var(--wot-tabs-nav-height, 42px);
  line-height: var(--wot-tabs-nav-height, 42px);
  text-align: center;
  color: var(--wot-tabs-nav-map-arrow-color, rgba(0, 0, 0, 0.65));
  z-index: 1;
  background: var(--wot-tabs-nav-bg, var(--wot-color-white, rgb(255, 255, 255)));
  -webkit-tap-highlight-color: transparent;
}

.wd-tabs__map-btn:before {
  position: absolute;
  content: '';
  top: 0;
  left: -24px;
  width: 24px;
  height: var(--wot-tabs-nav-height, 42px)-1;
  background: var(--wot-tabs-nav-map-btn-before-bg, linear-gradient(270deg, rgb(255, 255, 255) 1%, rgba(255, 255, 255, 0) 100%));
}

.wd-tabs__map-arrow {
  display: block;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.wd-tabs__map-arrow.is-open {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.wd-tabs__map-header {
  padding-left: 17px;
  height: var(--wot-tabs-nav-height, 42px);
  line-height: var(--wot-tabs-nav-height, 42px);
  font-size: var(--wot-tabs-nav-map-fs, var(--wot-fs-content, 14px));
  color: var(--wot-tabs-nav-map-color, rgba(0, 0, 0, 0.85));
  transition: opacity 0.3s;
  background: #fff;
  opacity: 0;
  position: relative;
}

.wd-tabs__map-header:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-tabs__map-header:after {
  z-index: 3;
}

.wd-tabs__map-body {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 15px 10px;
  background: #fff;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  -webkit-transform: scaleY(0);
  transform: scaleY(0);
  -webkit-transform-origin: center top;
  transform-origin: center top;
}

.wd-tabs__map-body.is-open {
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
}

.wd-tabs__map-nav-item {
  flex-basis: 33%;
}

.wd-tabs__map-nav-item:nth-child(3n + 2) {
  text-align: center;
}

.wd-tabs__map-nav-item:nth-child(3n + 3) {
  text-align: right;
}

.wd-tabs__map-nav-btn {
  outline: none;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 107px;
  height: 32px;
  line-height: 32px;
  background-color: var(--wot-tabs-nav-map-button-back-color, rgba(0, 0, 0, 0.04));
  border-color: transparent;
  margin-bottom: 10px;
  border-radius: var(--wot-tabs-nav-map-button-radius, 16px);
  color: var(--wot-tabs-nav-map-color, rgba(0, 0, 0, 0.85));
  font-size: var(--wot-tabs-nav-map-fs, var(--wot-fs-content, 14px));
  text-align: center;
  transition: color 0.3s, border-color 0.3s;
}

.wd-tabs__map-nav-btn.is-active {
  color: var(--wot-tabs-nav-active-color, var(--wot-color-theme, #4d80f0));
  border: 1px solid var(--wot-tabs-nav-active-color, var(--wot-color-theme, #4d80f0));
  background-color: var(--wot-tabs-nav-bg, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-tabs__map-nav-btn.is-disabled {
  color: var(--wot-tabs-nav-disabled-color, rgba(0, 0, 0, 0.25));
  border-color: #f4f4f4;
}

.wd-tabs__mask {
  position: absolute;
  top: var(--wot-tabs-nav-height, 42px);
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--wot-tabs-nav-map-modal-bg, var(--wot-overlay-bg, rgba(0, 0, 0, 0.65)));
  opacity: 0;
  transition: opacity 0.3s;
}

.wd-tabs.is-slide .wd-tabs__nav-item {
  flex: 0 0 auto;
  padding: 0 17px;
}

.wd-tabs.is-map .wd-tabs__nav--wrap {
  padding-right: 40px;
}

@media screen and (max-width: 330px) {
  .wd-tabs__map-nav-btn {
    width: 90px;
  }
}
</style>
