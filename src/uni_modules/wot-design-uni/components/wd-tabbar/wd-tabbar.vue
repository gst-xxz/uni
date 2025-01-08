<template>
  <div
    :class="cn({ 'wd-tabbar__placeholder': fixed && placeholder && safeAreaInsetBottom && shape === 'round' })"
    :style="{ height: addUnit(height) }"
  >
    <div
      :class="
        cn(
          `wd-tabbar wd-tabbar--${shape} ${customClass} ${fixed ? 'is-fixed' : ''} ${safeAreaInsetBottom ? 'is-safe' : ''} ${
            bordered ? 'is-border' : ''
          }`
        )
      "
      :style="rootStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-tabbar',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, watch, nextTick, computed, type CSSProperties } from 'vue'
import type { TabbarItem } from '../wd-tabbar-item/types'
import { addUnit, cn, getRect, isDef, objToStyle } from '../common/util'
import { useChildren } from '../composables/useChildren'
import { TABBAR_KEY, tabbarProps } from './types'

const props = defineProps(tabbarProps)
const emit = defineEmits(['change', 'update:modelValue'])

const height = ref<number | string>('') // 占位高度
const { proxy } = getCurrentInstance() as any

const { linkChildren } = useChildren(TABBAR_KEY)

linkChildren({
  props,
  setChange
})

const rootStyle = computed(() => {
  const style: CSSProperties = {}
  if (isDef(props.zIndex)) {
    style['z-index'] = props.zIndex
  }
  return `${objToStyle(style)};${props.customStyle}`
})

watch(
  [() => props.fixed, () => props.placeholder],
  () => {
    setPlaceholderHeight()
  },
  { deep: true, immediate: false }
)

onMounted(() => {
  if (props.fixed && props.placeholder) {
    nextTick(() => {
      setPlaceholderHeight()
    })
  }
})

/**
 * 子项状态变更
 * @param child 子项
 */
function setChange(child: TabbarItem) {
  let active = child.name
  emit('update:modelValue', active)
  emit('change', {
    value: active
  })
}

function setPlaceholderHeight() {
  if (!props.fixed || !props.placeholder) {
    return
  }

  getRect('.wd-tabbar', false, proxy).then((res) => {
    height.value = Number(res.height)
  })
}
</script>
<style>
.wot-theme-dark .wd-tabbar {
  background: #131313;
}

.wd-tabbar {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
  background: var(--wot-color-white, rgb(255, 255, 255));
  height: var(--wot-tabbar-height, 50px);
}

.wd-tabbar__placeholder {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.wd-tabbar--round {
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 999px;
  box-shadow: var(
    --wot-tabbar-box-shadow,
    0 6px 30px 5px rgba(0, 0, 0, 0.05),
    0 16px 24px 2px rgba(0, 0, 0, 0.04),
    0 8px 10px -5px rgba(0, 0, 0, 0.08)
  );
}

.wd-tabbar--round.is-fixed.is-safe {
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
}

.wd-tabbar--default.is-fixed.is-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.wd-tabbar--default.is-border {
  position: relative;
}

.wd-tabbar--default.is-border:after {
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

.wd-tabbar.is-fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 500;
}

[data-v-1e3acd37] .page-wraper {
  background: #f6f6f6;
}
</style>
