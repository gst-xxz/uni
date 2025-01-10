<template>
  <div :style="{ height: addUnit(height) }">
    <div
      :class="
        cn(
          `wd-navbar relative text-center select-none h-11 leading-[44px] bg-white box-border`,
          customClass,
          fixed ? 'is-fixed fixed left-0 top-0 w-full z-[500]' : '',
          bordered ? 'is-border hairline hairline--bottom' : ''
        )
      "
      :style="rootStyle"
    >
      <div class="wd-navbar__content relative w-full h-full">
        <div class="wd-navbar__capsule absolute top-0 bottom-0 text-base flex items-center py-0 px-3 left-0" v-if="$slots.capsule">
          <slot name="capsule" />
        </div>

        <div
          :class="
            cn(`wd-navbar__left absolute top-0 bottom-0 text-base flex items-center py-0 px-3 left-0`, leftDisabled ? 'is-disabled opacity-60' : '')
          "
          @click="handleClickLeft"
          v-else-if="!$slots.left"
        >
          <wd-icon v-if="leftArrow" name="arrow-left" custom-class="wd-navbar__arrow text-2xl text-black/10" />
          <div v-if="leftText" class="wd-navbar__text inline-block align-middle text-black/10">{{ leftText }}</div>
        </div>

        <div
          v-else
          :class="
            cn(`wd-navbar__left absolute top-0 bottom-0 text-base flex items-center py-0 px-3 left-0`, leftDisabled ? 'is-disabled opacity-60' : '')
          "
          @click="handleClickLeft"
        >
          <slot name="left" />
        </div>

        <div
          class="wd-navbar__title max-w-[60%] h-full my-0 mx-auto text-black/10 font-semibold text-lg overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <slot name="title" />
          <block v-if="!$slots.title && title">{{ title }}</block>
        </div>
        <div
          :class="
            cn(
              `wd-navbar__right absolute top-0 bottom-0 text-base flex items-center py-0 px-3 right-0`,
              rightDisabled ? 'is-disabled opacity-60' : ''
            )
          "
          @click="handleClickRight"
          v-if="$slots.right || rightText"
        >
          <slot name="right" />

          <div
            v-if="!$slots.right && rightText"
            class="wd-navbar__text inline-block align-middle text-black/10"
            hover-class="wd-navbar__text--hover"
            :hover-stay-time="70"
          >
            {{ rightText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-navbar',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { type CSSProperties, computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { getRect, addUnit, isDef, cn } from '../common/util'
import { navbarProps } from './types'

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
  const style: CSSProperties = {
    ...props.customStyle
  }
  if (props.fixed && isDef(props.zIndex)) {
    style['z-index'] = props.zIndex
  }
  if (props.safeAreaInsetTop) {
    style['padding-top'] = addUnit(statusBarHeight || 0)
  }
  return style
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

  getRect('.wd-navbar', false, proxy).then((res) => {
    height.value = res.height as number
  })
}
</script>
