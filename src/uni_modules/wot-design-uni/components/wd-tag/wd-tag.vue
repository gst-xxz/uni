<template>
  <div :class="rootClass" :style="rootStyle" @click="handleClick">
    <div v-if="useIconSlot" class="wd-tag__icon">
      <slot name="icon" />
    </div>
    <wd-icon v-else-if="icon" :name="icon" custom-class="wd-tag__icon" />
    <div class="wd-tag__text" :style="textStyle">
      <slot />
    </div>
    <div class="wd-tag__close" v-if="closable && round" @click.stop="handleClose">
      <wd-icon name="error-fill" />
    </div>
    <input
      v-if="dynamicInput && dynamic"
      class="wd-tag__add-text"
      :placeholder="translate('placeholder')"
      type="text"
      :focus="true"
      v-model="dynamicValue"
      @blur="handleBlur"
      @confirm="handleConfirm"
    />
    <div v-else-if="dynamic" class="wd-tag__text" :style="textStyle" @click.stop="handleAdd">
      <slot name="add" v-if="$slots.add"></slot>
      <template v-else>
        <wd-icon name="add" custom-class="wd-tag__add wd-tag__icon" />
        <span>{{ translate('add') }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-tag',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { objToStyle } from '../common/util'
import { computed, ref, watch } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { tagProps } from './types'

const props = defineProps(tagProps)
const emit = defineEmits(['click', 'close', 'confirm'])

const { translate } = useTranslate('tag')

const tagClass = ref<string>('')
const dynamicValue = ref<string>('')
const dynamicInput = ref<boolean>(false)

watch(
  [() => props.useIconSlot, () => props.icon, () => props.plain, () => props.dynamic, () => props.round, () => props.mark],
  () => {
    computeTagClass()
  },
  { deep: true, immediate: true }
)

watch(
  () => props.type,
  (newValue) => {
    if (!newValue) return
    // type: 'primary', 'danger', 'warning', 'success'
    const type = ['primary', 'danger', 'warning', 'success', 'default']
    if (type.indexOf(newValue) === -1) console.error(`type must be one of ${type.toString()}`)
    computeTagClass()
  },
  { deep: true, immediate: true }
)

watch(
  () => dynamicInput.value,
  () => {
    computeTagClass()
  },
  { deep: true, immediate: true }
)

const rootClass = computed(() => {
  return `wd-tag ${props.customClass} ${tagClass.value}`
})

const rootStyle = computed(() => {
  const rootStyle: Record<string, any> = {}
  if (!props.plain && props.bgColor) {
    rootStyle['background'] = props.bgColor
  }
  if (props.bgColor) {
    rootStyle['border-color'] = props.bgColor
  }
  return `${objToStyle(rootStyle)};${props.customStyle}`
})

const textStyle = computed(() => {
  const textStyle: Record<string, any> = {}
  if (props.color) {
    textStyle['color'] = props.color
  }
  return objToStyle(textStyle)
})

function computeTagClass() {
  const { type, plain, round, mark, dynamic, icon, useIconSlot } = props
  let tagClassList: string[] = []
  type && tagClassList.push(`is-${type}`)
  plain && tagClassList.push('is-plain')
  round && tagClassList.push('is-round')
  mark && tagClassList.push('is-mark')
  dynamic && tagClassList.push('is-dynamic')
  dynamicInput.value && tagClassList.push('is-dynamic-input')
  if (icon || useIconSlot) tagClassList.push('is-icon')
  tagClass.value = tagClassList.join(' ')
}

function handleClick(event: any) {
  emit('click', event)
}
function handleClose(event: any) {
  emit('close', event)
}
function handleAdd() {
  dynamicInput.value = true
  dynamicValue.value = ''
}
function handleBlur() {
  setDynamicInput()
}
function handleConfirm(event: any) {
  setDynamicInput()
  emit('confirm', {
    value: event.detail.value
  })
}
function setDynamicInput() {
  dynamicInput.value = false
}
</script>
<style>
.wd-tag {
  font-size: var(--wot-tag-small-fs, var(--wot-fs-aid, 10px));
  display: inline-block;
  color: var(--wot-tag-color, var(--wot-color-white, rgb(255, 255, 255)));
  padding: 0 3px;
  border-radius: 2px;
  transition: opacity 0.3s;
  vertical-align: middle;
  line-height: initial;
}

.wd-tag.is-default {
  background: var(--wot-tag-info-bg, linear-gradient(49deg, #808080 0%, #999999 100%));
}

.wd-tag.is-default.is-plain {
  background: transparent;
  color: var(--wot-tag-info-color, #585858);
  border: 1px solid var(--wot-tag-info-color, #585858);
  padding: 0 4px;
}

.wd-tag.is-default.is-round {
  line-height: 1.2;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  padding: 4px 11px;
  background: transparent;
  color: var(--wot-tag-round-color, rgb(102, 102, 102));
  border: 1px solid var(--wot-tag-round-border-color, rgb(225, 225, 225));
  border-radius: var(--wot-tag-round-radius, 12px);
}

.wd-tag.is-default.is-mark {
  padding: 1px 6px;
  border-radius: var(--wot-tag-mark-radius, 6px 2px 6px 2px);
}

.wd-tag.is-default.is-mark.is-plain {
  padding: 0 6px;
}

.wd-tag.is-default.is-active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-primary {
  background: var(--wot-tag-primary-bg, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-primary.is-plain {
  background: transparent;
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border: 1px solid var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  padding: 0 4px;
}

.wd-tag.is-primary.is-round {
  line-height: 1.2;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  padding: 4px 11px;
  background: transparent;
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border: 1px solid var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-radius: var(--wot-tag-round-radius, 12px);
}

.wd-tag.is-primary.is-mark {
  padding: 1px 6px;
  border-radius: var(--wot-tag-mark-radius, 6px 2px 6px 2px);
}

.wd-tag.is-primary.is-mark.is-plain {
  padding: 0 6px;
}

.wd-tag.is-primary.is-active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-danger {
  background: var(--wot-tag-danger-bg, var(--wot-color-danger, #fa4350));
}

.wd-tag.is-danger.is-plain {
  background: transparent;
  color: var(--wot-tag-danger-color, var(--wot-color-danger, #fa4350));
  border: 1px solid var(--wot-tag-danger-color, var(--wot-color-danger, #fa4350));
  padding: 0 4px;
}

.wd-tag.is-danger.is-round {
  line-height: 1.2;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  padding: 4px 11px;
  background: transparent;
  color: var(--wot-tag-danger-color, var(--wot-color-danger, #fa4350));
  border: 1px solid var(--wot-tag-danger-color, var(--wot-color-danger, #fa4350));
  border-radius: var(--wot-tag-round-radius, 12px);
}

.wd-tag.is-danger.is-mark {
  padding: 1px 6px;
  border-radius: var(--wot-tag-mark-radius, 6px 2px 6px 2px);
}

.wd-tag.is-danger.is-mark.is-plain {
  padding: 0 6px;
}

.wd-tag.is-danger.is-active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-warning {
  background: var(--wot-tag-warning-bg, var(--wot-color-warning, #f0883a));
}

.wd-tag.is-warning.is-plain {
  background: transparent;
  color: var(--wot-tag-warning-color, var(--wot-color-warning, #f0883a));
  border: 1px solid var(--wot-tag-warning-color, var(--wot-color-warning, #f0883a));
  padding: 0 4px;
}

.wd-tag.is-warning.is-round {
  line-height: 1.2;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  padding: 4px 11px;
  background: transparent;
  color: var(--wot-tag-warning-color, var(--wot-color-warning, #f0883a));
  border: 1px solid var(--wot-tag-warning-color, var(--wot-color-warning, #f0883a));
  border-radius: var(--wot-tag-round-radius, 12px);
}

.wd-tag.is-warning.is-mark {
  padding: 1px 6px;
  border-radius: var(--wot-tag-mark-radius, 6px 2px 6px 2px);
}

.wd-tag.is-warning.is-mark.is-plain {
  padding: 0 6px;
}

.wd-tag.is-warning.is-active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-success {
  background: var(--wot-tag-success-bg, var(--wot-color-success, #34d19d));
}

.wd-tag.is-success.is-plain {
  background: transparent;
  color: var(--wot-tag-success-color, var(--wot-color-success, #34d19d));
  border: 1px solid var(--wot-tag-success-color, var(--wot-color-success, #34d19d));
  padding: 0 4px;
}

.wd-tag.is-success.is-round {
  line-height: 1.2;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  padding: 4px 11px;
  background: transparent;
  color: var(--wot-tag-success-color, var(--wot-color-success, #34d19d));
  border: 1px solid var(--wot-tag-success-color, var(--wot-color-success, #34d19d));
  border-radius: var(--wot-tag-round-radius, 12px);
}

.wd-tag.is-success.is-mark {
  padding: 1px 6px;
  border-radius: var(--wot-tag-mark-radius, 6px 2px 6px 2px);
}

.wd-tag.is-success.is-mark.is-plain {
  padding: 0 6px;
}

.wd-tag.is-success.is-active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-icon {
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  line-height: 1.2;
  padding: 2px 5px;
}

.wd-tag.is-dynamic {
  box-sizing: border-box;
  width: 88px;
  transition: 0.3s;
}

.wd-tag.is-dynamic:active {
  color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag.is-dynamic-input {
  border-color: var(--wot-tag-primary-color, var(--wot-color-theme, #4d80f0));
}

.wd-tag__icon {
  display: inline-block;
  margin-right: 4px;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  line-height: 1.2;
  vertical-align: baseline;
}

.wd-tag__text {
  display: inline-block;
  vertical-align: text-top;
}

.wd-tag__add-text {
  width: 60px;
  height: 14px;
  min-height: 14px;
  display: inline-block;
  font-size: var(--wot-tag-fs, var(--wot-fs-secondary, 12px));
  vertical-align: middle;
  padding: 0;
}

.wd-tag__close {
  display: inline-block;
  margin-left: 24px;
  margin-right: -4px;
  font-size: var(--wot-tag-close-size, 14px);
  height: 14px;
  line-height: 1.1;
  vertical-align: text-bottom;
  color: var(--wot-tag-close-color, var(--wot-tag-info-color, #585858));
}

.wd-tag__close:active {
  color: var(--wot-tag-close-active-color, rgba(0, 0, 0, 0.45));
}

.wd-tag__add {
  vertical-align: bottom;
}
</style>
