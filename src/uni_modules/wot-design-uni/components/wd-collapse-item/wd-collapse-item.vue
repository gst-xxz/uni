<template>
  <div :class="cn(`wd-collapse-item is-border`, disabled ? 'is-disabled' : '', customClass)" :style="customStyle">
    <div
      :class="
        cn(
          `wd-collapse-item__header`,
          expanded ? 'is-expanded' : '',
          isFirst ? 'wd-collapse-item__header-first' : '',
          $slots.title ? 'is-custom' : ''
        )
      "
      @click="handleClick"
    >
      <slot name="title" :expanded="expanded" :disabled="disabled" :isFirst="isFirst">
        <span class="wd-collapse-item__title">{{ title }}</span>
        <wd-icon name="arrow-down" :custom-class="cn(`wd-collapse-item__arrow`, expanded ? 'is-retract' : '')" />
      </slot>
    </div>
    <div class="wd-collapse-item__wrapper" :style="contentStyle" @transitionend="handleTransitionEnd">
      <div class="wd-collapse-item__body" :class="customBodyClass" :style="customBodyStyle" :id="collapseId">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-collapse-item',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, watch, type CSSProperties } from 'vue'
import { addUnit, cn, getRect, isArray, isDef, isPromise, isString, pause, uuid } from '../common/util'
import { useParent } from '../composables/useParent'
import { COLLAPSE_KEY } from '../wd-collapse/types'
import { collapseItemProps, type CollapseItemExpose } from './types'

const collapseId = ref<string>(`collapseId${uuid()}`)

const props = defineProps(collapseItemProps)

const { parent: collapse, index } = useParent(COLLAPSE_KEY)

const height = ref<string | number>('')
const inited = ref<boolean>(false)
const expanded = ref<boolean>(false)
const { proxy } = getCurrentInstance() as any

/**
 * 容器样式，(动画)
 */
const isFirst = computed(() => {
  return index.value === 0
})

/**
 * 容器样式，(动画)
 */
const contentStyle = computed(() => {
  const style: CSSProperties = {}
  if (inited.value) {
    style.transition = 'height 0.3s ease-in-out'
  }
  if (!expanded.value) {
    style.height = '0px'
  } else if (height.value) {
    style.height = addUnit(height.value)
  }
  return style
})

/**
 * 是否选中
 */
const isSelected = computed(() => {
  const modelValue = collapse ? collapse?.props.modelValue || [] : []
  const { name } = props
  return (isString(modelValue) && modelValue === name) || (isArray(modelValue) && modelValue.indexOf(name as string) >= 0)
})

watch(
  () => isSelected.value,
  (newVal) => {
    updateExpand(newVal)
  }
)

onMounted(() => {
  updateExpand(isSelected.value)
})

async function updateExpand(useBeforeExpand: boolean = true) {
  try {
    if (useBeforeExpand) {
      await handleBeforeExpand()
    }
    initRect()
  } catch (error) {
    /* empty */
  }
}

function initRect() {
  getRect(`#${collapseId.value}`, false, proxy).then(async (rect) => {
    const { height: rectHeight } = rect
    height.value = isDef(rectHeight) ? Number(rectHeight) : ''
    await pause()
    if (isSelected.value) {
      expanded.value = true
    } else {
      expanded.value = false
    }
    if (!inited.value) {
      inited.value = true
    }
  })
}

function handleTransitionEnd() {
  if (expanded.value) {
    height.value = ''
  }
}

// 点击子项
async function handleClick() {
  if (props.disabled) return
  try {
    await updateExpand()
    const { name } = props
    collapse && collapse.toggle(name, !expanded.value)
  } catch (error) {
    /* empty */
  }
}

/**
 * 展开前钩子
 */
function handleBeforeExpand() {
  return new Promise<void>((resolve, reject) => {
    const { name } = props
    const nextexpanded = !expanded.value
    if (nextexpanded && props.beforeExpend) {
      const response = props.beforeExpend(name)
      if (!response) {
        reject()
      }
      if (isPromise(response)) {
        response.then(() => resolve()).catch(reject)
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

function getExpanded() {
  return expanded.value
}

defineExpose<CollapseItemExpose>({ getExpanded, updateExpand })
</script>

<style>
.wd-collapse-item {
  position: relative;
}

.wd-collapse-item:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-color-border-light, #e8e8e8);
}

.wd-collapse-item__header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--wot-collapse-header-padding, 13px var(--wot-size-side-padding, 15px));
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.wd-collapse-item__header.is-expanded {
  position: relative;
}

.wd-collapse-item__header.is-expanded:after {
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

.wd-collapse-item__header.is-custom {
  display: block;
}

.wd-collapse-item__title {
  color: var(--wot-collapse-title-color, rgba(0, 0, 0, 0.85));
  font-weight: var(--wot-fw-medium, 500);
  font-size: var(--wot-collapse-title-fs, 16px);
}

.wd-collapse-item__arrow {
  display: block;
  font-size: var(--wot-collapse-arrow-size, 18px);
  color: var(--wot-collapse-arrow-color, #d8d8d8);
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
}

.wd-collapse-item__arrow.is-retract {
  -webkit-transform: rotate(-180deg);
  transform: rotate(-180deg);
}

.wd-collapse-item__wrapper {
  position: relative;
  overflow: hidden;
  will-change: height;
}

.wd-collapse-item__body {
  color: var(--wot-collapse-body-color, rgba(0, 0, 0, 0.65));
  font-size: var(--wot-collapse-body-fs, 14px);
  padding: var(--wot-collapse-body-padding, 14px var(--wot-size-side-padding, 15px));
  line-height: 1.43;
}

.wd-collapse-item.is-disabled .wd-collapse-item__title,
.wd-collapse-item.is-disabled .wd-collapse-item__arrow {
  color: var(--wot-collapse-disabled-color, rgba(0, 0, 0, 0.15));
}
</style>
