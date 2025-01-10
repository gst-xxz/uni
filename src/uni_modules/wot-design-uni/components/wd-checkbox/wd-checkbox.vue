<template>
  <div
    :class="
      cn(
        `wd-checkbox`,
        innerCell ? 'is-cell-box' : '',
        innerShape === 'button' ? 'is-button-box' : '',
        isChecked ? 'is-checked' : '',
        isFirst ? 'is-first-child' : '',
        isLast ? 'is-last-child' : '',
        innerInline ? 'is-inline' : '',
        innerShape === 'button' ? 'is-button' : '',
        innerDisabled ? 'is-disabled' : '',
        innerSize ? 'is-' + innerSize : '',
        customClass
      )
    "
    :style="customStyle"
    @click="toggle"
  >
    <!--shape为button时，移除wd-checkbox__shape，只保留wd-checkbox__label-->
    <div
      v-if="innerShape !== 'button'"
      :class="cn(`wd-checkbox__shape ${innerShape === 'square' ? 'is-square' : ''} ${customShapeClass}`)"
      :style="isChecked && !innerDisabled && innerCheckedColor ? 'color :' + innerCheckedColor : ''"
    >
      <wd-icon custom-class="wd-checkbox__check" name="check-bold" />
    </div>
    <!--shape为button时只保留wd-checkbox__label-->
    <div
      :class="cn(`wd-checkbox__label ${customLabelClass}`)"
      :style="isChecked && innerShape === 'button' && !innerDisabled && innerCheckedColor ? 'color:' + innerCheckedColor : ''"
    >
      <!--button选中时展示的icon-->
      <wd-icon v-if="innerShape === 'button' && isChecked" custom-class="wd-checkbox__btn-check" name="check-bold" />
      <!--文案-->
      <div class="wd-checkbox__txt" :style="maxWidth ? 'max-width:' + maxWidth : ''">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-checkbox',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, getCurrentInstance, onBeforeMount, watch } from 'vue'
import { useParent } from '../composables/useParent'
import { CHECKBOX_GROUP_KEY } from '../wd-checkbox-group/types'
import { cn, getPropByPath, isDef } from '../common/util'
import { checkboxProps, type CheckboxExpose, type CheckShape } from './types'

const props = defineProps(checkboxProps)
const emit = defineEmits(['change', 'update:modelValue'])

defineExpose<CheckboxExpose>({
  toggle
})

const { parent: checkboxGroup, index } = useParent(CHECKBOX_GROUP_KEY)

const isChecked = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.props.modelValue.indexOf(props.modelValue) > -1
  } else {
    return props.modelValue === props.trueValue
  }
}) // 是否被选中

const isFirst = computed(() => {
  return index.value === 0
})

const isLast = computed(() => {
  const children = isDef(checkboxGroup) ? checkboxGroup.children : []
  return index.value === children.length - 1
})
const { proxy } = getCurrentInstance() as any

watch(
  () => props.modelValue,
  () => {
    // 组合使用走这个逻辑
    if (checkboxGroup) {
      checkName()
    }
  }
)

watch(
  () => props.shape,
  (newValue) => {
    const type = ['circle', 'square', 'button']
    if (isDef(newValue) && type.indexOf(newValue) === -1) console.error(`shape must be one of ${type.toString()}`)
  }
)

const innerShape = computed<CheckShape>(() => {
  return props.shape || getPropByPath(checkboxGroup, 'props.shape') || 'circle'
})

const innerCheckedColor = computed(() => {
  return props.checkedColor || getPropByPath(checkboxGroup, 'props.checkedColor')
})

const innerDisabled = computed(() => {
  if (!checkboxGroup) {
    return props.disabled
  }
  const { max, min, modelValue, disabled } = checkboxGroup.props
  if (
    (max && modelValue.length >= max && !isChecked.value) ||
    (min && modelValue.length <= min && isChecked.value) ||
    props.disabled === true ||
    (disabled && props.disabled === null)
  ) {
    return true
  }

  return props.disabled
})

const innerInline = computed(() => {
  return getPropByPath(checkboxGroup, 'props.inline') || false
})

const innerCell = computed(() => {
  return getPropByPath(checkboxGroup, 'props.cell') || false
})

const innerSize = computed(() => {
  return props.size || getPropByPath(checkboxGroup, 'props.size')
})

onBeforeMount(() => {
  // eslint-disable-next-line quotes
  if (props.modelValue === null) console.error("checkbox's value must be set")
})

/**
 * @description 检测checkbox绑定的value是否和其它checkbox的value冲突
 * @param {Object} self 自身
 * @param  myName 自己的标识符
 */
function checkName() {
  checkboxGroup &&
    checkboxGroup.children &&
    checkboxGroup.children.forEach((child: any) => {
      if (child.$.uid !== proxy.$.uid && child.modelValue === props.modelValue) {
        console.error(`The checkbox's bound value: ${props.modelValue} has been used`)
      }
    })
}
/**
 * @description 点击checkbox的Event handle
 */
function toggle() {
  if (innerDisabled.value) return
  // 复选框单独使用时点击反选，并且在checkbox上触发change事件
  if (checkboxGroup) {
    emit('change', {
      value: !isChecked.value
    })
    checkboxGroup.changeSelectState(props.modelValue)
  } else {
    const newVal = props.modelValue === props.trueValue ? props.falseValue : props.trueValue
    emit('update:modelValue', newVal)
    emit('change', {
      value: newVal
    })
  }
}
</script>

<style>
.wd-checkbox {
  display: block;
  margin-bottom: var(--wot-checkbox-margin, 10px);
  font-size: 0;
  -webkit-tap-highlight-color: transparent;
  line-height: 1.2;
}

.wd-checkbox.is-last-child {
  margin-bottom: 0;
}

.wd-checkbox__shape {
  position: relative;
  display: inline-block;
  width: var(--wot-checkbox-size, 16px);
  height: var(--wot-checkbox-size, 16px);
  border: 2px solid var(--wot-checkbox-border-color, #dcdcdc);
  border-radius: 50%;
  color: var(--wot-checkbox-check-color, var(--wot-color-white, rgb(255, 255, 255)));
  background: var(--wot-checkbox-bg, var(--wot-color-white, rgb(255, 255, 255)));
  vertical-align: middle;
  transition: background 0.2s;
  box-sizing: border-box;
}

.wd-checkbox__shape.is-square {
  border-radius: var(--wot-checkbox-square-radius, 4px);
}

.wd-checkbox__input {
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  opacity: 0;
}

.wd-checkbox__btn-check {
  display: inline-block;
  font-size: var(--wot-checkbox-icon-size, 14px);
  margin-right: 4px;
  vertical-align: middle;
}

.wd-checkbox__txt {
  display: inline-block;
  vertical-align: middle;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wd-checkbox__label {
  position: relative;
  display: inline-block;
  margin-left: var(--wot-checkbox-label-margin, 9px);
  vertical-align: middle;
  font-size: var(--wot-checkbox-label-fs, 14px);
  color: var(--wot-checkbox-label-color, rgba(0, 0, 0, 0.85));
}

.wd-checkbox__check {
  color: var(--wot-checkbox-check-color, var(--wot-color-white, rgb(255, 255, 255)));
  font-size: var(--wot-checkbox-icon-size, 14px);
  opacity: 0;
  transition: opacity 0.2s;
}

.wd-checkbox.is-checked .wd-checkbox__shape {
  color: var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0));
  background: currentColor;
  border-color: currentColor;
}

.wd-checkbox.is-checked .wd-checkbox__check {
  opacity: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.wd-checkbox.is-button {
  display: inline-block;
  margin-bottom: 0;
  margin-right: var(--wot-checkbox-margin, 10px);
  vertical-align: top;
  font-size: var(--wot-checkbox-button-font-size, 14px);
}

.wd-checkbox.is-button.is-last-child {
  margin-right: 0;
}

.wd-checkbox.is-button .wd-checkbox__shape {
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
  border: none;
}

.wd-checkbox.is-button .wd-checkbox__label {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: var(--wot-checkbox-button-min-width, 78px);
  height: var(--wot-checkbox-button-height, 32px);
  font-size: var(--wot-checkbox-button-font-size, 14px);
  margin-left: 0;
  padding: 5px 15px;
  border: 1px solid var(--wot-checkbox-button-border, #f5f5f5);
  background-color: var(--wot-checkbox-button-bg, rgba(0, 0, 0, 0.04));
  border-radius: var(--wot-checkbox-button-radius, 16px);
  transition: color 0.2s, border 0.2s;
  box-sizing: border-box;
}

.wd-checkbox.is-button.is-checked .wd-checkbox__label {
  color: var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0));
  background-color: var(--wot-checkbox-bg, var(--wot-color-white, rgb(255, 255, 255)));
  border-color: var(--wot-checkbox-checked-color, var(--wot-color-theme, #4d80f0));
  border-color: currentColor;
}

.wd-checkbox.is-inline {
  display: inline-block;
  margin-bottom: 0;
  margin-right: var(--wot-checkbox-margin, 10px);
}

.wd-checkbox.is-inline.is-last-child {
  margin-right: 0;
}

.wd-checkbox.is-disabled .wd-checkbox__shape {
  border-color: var(--wot-checkbox-border-color, #dcdcdc);
  background: var(--wot-checkbox-disabled-check-bg, rgba(0, 0, 0, 0.15));
}

.wd-checkbox.is-disabled .wd-checkbox__label {
  color: var(--wot-checkbox-disabled-label-color, rgba(0, 0, 0, 0.25));
}

.wd-checkbox.is-disabled.is-checked .wd-checkbox__shape {
  color: var(--wot-checkbox-disabled-check-color, rgba(0, 0, 0, 0.15));
}

.wd-checkbox.is-disabled.is-checked .wd-checkbox__label {
  color: var(--wot-checkbox-disabled-label-color, rgba(0, 0, 0, 0.25));
}

.wd-checkbox.is-disabled.is-button .wd-checkbox__label {
  background: var(--wot-checkbox-disabled-color, rgba(0, 0, 0, 0.04));
  border-color: var(--wot-checkbox-button-border, #f5f5f5);
  color: var(--wot-checkbox-disabled-label-color, rgba(0, 0, 0, 0.25));
}

.wd-checkbox.is-disabled.is-button.is-checked .wd-checkbox__label {
  border-color: var(--wot-checkbox-button-disabled-border, rgba(0, 0, 0, 0.15));
}

.wd-checkbox.is-cell-box {
  padding: 13px 15px;
  margin: 0;
}

.wd-checkbox.is-cell-box.is-large {
  padding: 14px 15px;
}

.wd-checkbox.is-button-box {
  display: inline-flex;
  width: 33.3333%;
  padding: 12px 12px 0 0;
  box-sizing: border-box;
}

.wd-checkbox.is-button-box .wd-checkbox__label {
  width: 100%;
}

.wd-checkbox.is-button-box:last-child:after {
  content: '';
  display: table;
  clear: both;
}

.wd-checkbox.is-large .wd-checkbox__shape {
  width: var(--wot-checkbox-large-size, 18px);
  height: var(--wot-checkbox-large-size, 18px);
  font-size: var(--wot-checkbox-large-size, 18px);
}

.wd-checkbox.is-large .wd-checkbox__label {
  font-size: var(--wot-checkbox-large-label-fs, 16px);
}
</style>
