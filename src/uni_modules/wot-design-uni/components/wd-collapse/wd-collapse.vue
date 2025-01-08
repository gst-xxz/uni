<template>
  <div :class="cn(`wd-collapse ${viewmore ? 'is-viewmore' : ''}`, customClass)" :style="customStyle">
    <!-- 普通或手风琴 -->
    <block v-if="!viewmore">
      <slot></slot>
    </block>
    <!-- 查看更多模式 -->
    <div v-else>
      <div
        :class="cn(`wd-collapse__content ${!modelValue ? 'is-retract' : ''} `)"
        :style="`-webkit-line-clamp: ${contentLineNum}; -webkit-box-orient: vertical`"
      >
        <slot></slot>
      </div>
      <div class="wd-collapse__more" @click="handleMore">
        <!-- 自定义展开按钮 -->
        <div v-if="useMoreSlot" :class="customMoreSlotClass">
          <slot name="more"></slot>
        </div>
        <!-- 显示展开或折叠按钮 -->
        <block v-else>
          <span class="wd-collapse__more-txt">{{ !modelValue ? translate('expand') : translate('retract') }}</span>
          <div :class="cn(`wd-collapse__arrow ${modelValue ? 'is-retract' : ''}`)">
            <wd-icon name="arrow-down"></wd-icon>
          </div>
        </block>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-collapse',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { COLLAPSE_KEY, collapseProps, type CollapseExpose, type CollapseToggleAllOptions } from './types'
import { useChildren } from '../composables/useChildren'
import { cn, isArray, isBoolean, isDef } from '../common/util'
import { useTranslate } from '../composables/useTranslate'

const props = defineProps(collapseProps)
const emit = defineEmits(['change', 'update:modelValue'])

const { translate } = useTranslate('collapse')
const contentLineNum = ref<number>(0) // 查看更多的折叠面板，收起时的显示行数

const { linkChildren, children } = useChildren(COLLAPSE_KEY)

linkChildren({ props, toggle })

watch(
  () => props.modelValue,
  (newVal) => {
    const { viewmore, accordion } = props
    // 手风琴状态下 value 类型只能为 string
    if (accordion && typeof newVal !== 'string') {
      console.error('accordion value must be string')
    } else if (!accordion && !viewmore && !isArray(newVal)) {
      console.error('value must be Array')
    }
  },
  { deep: true }
)

watch(
  () => props.lineNum,
  (newVal) => {
    if (newVal <= 0) {
      console.error('lineNum must greater than 0')
    }
  },
  { deep: true, immediate: true }
)

onBeforeMount(() => {
  const { lineNum, viewmore, modelValue } = props
  contentLineNum.value = viewmore && !modelValue ? lineNum : 0
})

function updateChange(activeNames: string | string[] | boolean) {
  emit('update:modelValue', activeNames)
  emit('change', {
    value: activeNames
  })
}

function toggle(name: string, expanded: boolean) {
  const { accordion, modelValue } = props
  if (accordion) {
    updateChange(name === modelValue ? '' : name)
  } else if (expanded) {
    updateChange((modelValue as string[]).concat(name))
  } else {
    updateChange((modelValue as string[]).filter((activeName) => activeName !== name))
  }
}

/**
 * 切换所有面板展开状态，传 true 为全部展开，false 为全部收起，不传参为全部切换
 * @param options 面板状态
 */
const toggleAll = (options: CollapseToggleAllOptions = {}) => {
  if (props.accordion) {
    return
  }
  if (isBoolean(options)) {
    options = { expanded: options }
  }

  const { expanded, skipDisabled } = options
  const names: string[] = []
  children.forEach((item, index) => {
    if (item.disabled && skipDisabled) {
      if (item.$.exposed!.getExpanded()) {
        names.push(item.name || index)
      }
    } else if (isDef(expanded) ? expanded : !item.$.exposed!.getExpanded()) {
      names.push(item.name || index)
    }
  })
  updateChange(names)
}

/**
 * 查看更多点击
 */
function handleMore() {
  emit('update:modelValue', !props.modelValue)
  emit('change', {
    value: !props.modelValue
  })
}

defineExpose<CollapseExpose>({
  toggleAll
})
</script>

<style>
.wot-theme-dark .wd-collapse {
  background: #1b1b1b;
}

.wot-theme-dark .wd-collapse__content {
  color: rgba(232, 230, 227, 0.8);
}

.wd-collapse {
  background: var(--wot-color-white, rgb(255, 255, 255));
}

.wd-collapse.is-viewmore {
  padding: var(--wot-collapse-side-padding, var(--wot-size-side-padding, 15px));
}

.wd-collapse__content {
  font-size: var(--wot-collapse-body-fs, 14px);
  color: var(--wot-collapse-body-color, rgba(0, 0, 0, 0.65));
}

.wd-collapse__content.is-retract {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: var(--wot-collapse-retract-fs, 14px);
}

.wd-collapse__more {
  display: inline-block;
  font-size: var(--wot-collapse-retract-fs, 14px);
  margin-top: 8px;
  color: var(--wot-collapse-more-color, var(--wot-color-theme, #4d80f0));
  -webkit-user-select: none;
  user-select: none;
}

.wd-collapse__more-txt {
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}

.wd-collapse__arrow {
  display: inline-block;
  vertical-align: middle;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
  font-size: var(--wot-collapse-arrow-size, 18px);
  height: var(--wot-collapse-arrow-size, 18px);
  line-height: var(--wot-collapse-arrow-size, 18px);
}

.wd-collapse__arrow.is-retract {
  -webkit-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
</style>
