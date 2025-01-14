<template>
  <div :class="cn(`wd-collapse bg-white`, viewmore ? 'is-viewmore p-[15px]' : '', customClass)" :style="customStyle">
    <!-- 普通或手风琴 -->
    <block v-if="!viewmore">
      <slot></slot>
    </block>
    <!-- 查看更多模式 -->
    <div v-else>
      <div
        :class="cn(`wd-collapse__content text-sm text-black/65`, !modelValue ? 'is-retract line-clamp-1 text-sm' : '')"
        :style="`-webkit-line-clamp: ${viewmore && !modelValue ? lineNum : 0};`"
      >
        <slot></slot>
      </div>
      <div class="wd-collapse__more inline-block text-sm mt-2 text-primary select-none" @click="handleMore">
        <!-- 自定义展开按钮 -->
        <div v-if="useMoreSlot" :class="customMoreSlotClass">
          <slot name="more"></slot>
        </div>
        <!-- 显示展开或折叠按钮 -->
        <block v-else>
          <span class="wd-collapse__more-txt inline-block align-middle mr-1">{{ !modelValue ? '展开' : '收起' }}</span>
          <div
            :class="
              cn(
                `wd-collapse__arrow inline-block align-middle transition-[transform_0.1s] text-lg leading-[18px] h-[18px]`,
                modelValue ? 'is-retract -rotate-180' : ''
              )
            "
          >
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
import { watch } from 'vue'
import { COLLAPSE_KEY, collapseProps, type CollapseExpose, type CollapseToggleAllOptions } from './types'
import { useChildren } from '../composables/useChildren'
import { cn, isArray, isBoolean } from '../common/util'

const props = defineProps(collapseProps)
const emit = defineEmits(['change', 'update:modelValue'])

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
    } else if (expanded ?? !item.$.exposed!.getExpanded()) {
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
