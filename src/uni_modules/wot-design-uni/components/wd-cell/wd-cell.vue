<template>
  <div
    :class="cn(['wd-cell', isBorder ? 'is-border' : '', size ? 'is-' + size : '', center ? 'is-center' : '', customClass])"
    :style="customStyle"
    :hover-class="isLink || clickable ? 'is-hover' : 'none'"
    :hover-stay-time="70"
    @click="onClick"
  >
    <div :class="cn(['wd-cell__wrapper', vertical ? 'is-vertical' : ''])">
      <div
        :class="cn(['wd-cell__left', isRequired ? 'is-required' : ''])"
        :style="titleWidth ? 'min-width:' + titleWidth + ';max-width:' + titleWidth + ';' : ''"
      >
        <!--左侧icon部位-->
        <wd-icon v-if="icon" :name="icon" :custom-class="cn(`wd-cell__icon`, customIconClass)"></wd-icon>
        <slot v-else name="icon" />

        <div class="wd-cell__title">
          <!--title BEGIN-->
          <div v-if="title" :class="customTitleClass">{{ title }}</div>
          <slot v-else name="title"></slot>
          <!--title END-->

          <!--label BEGIN-->
          <div v-if="label" :class="cn(`wd-cell__label`, customLabelClass)">{{ label }}</div>
          <slot v-else name="label" />
          <!--label END-->
        </div>
      </div>
      <!--right content BEGIN-->
      <div class="wd-cell__right">
        <div class="wd-cell__body">
          <!--文案内容-->
          <div :class="cn(`wd-cell__value`, customValueClass)">
            <slot>{{ value }}</slot>
          </div>
          <!--箭头-->
          <wd-icon v-if="isLink" custom-class="wd-cell__arrow-right" name="arrow" />
          <slot v-else name="right-icon" />
        </div>
        <div v-if="errorMessage" class="wd-cell__error-message">{{ errorMessage }}</div>
      </div>
      <!--right content END-->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-cell',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCell } from '../composables/useCell'
import { useParent } from '../composables/useParent'
import { FORM_KEY } from '../wd-form/types'
import { cellProps } from './types'
import { cn, isDef } from '../common/util'

const props = defineProps(cellProps)
const emit = defineEmits(['click'])

const cell = useCell()

const isBorder = computed(() => {
  return Boolean(isDef(props.border) ? props.border : cell.border.value)
})

const { parent: form } = useParent(FORM_KEY)

const errorMessage = computed(() => {
  if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
    return form.errorMessages[props.prop]
  } else {
    return ''
  }
})

// 是否展示必填
const isRequired = computed(() => {
  let formRequired = false
  if (form && form.props.rules) {
    const rules = form.props.rules
    for (const key in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
        formRequired = rules[key].some((rule) => rule.required)
      }
    }
  }
  return props.required || props.rules.some((rule) => rule.required) || formRequired
})

/**
 * @description 点击cell的handle
 */
function onClick() {
  const url = props.to

  if (props.clickable || props.isLink) {
    emit('click')
  }
  if (url && props.isLink) {
    if (props.replace) {
      uni.redirectTo({ url })
    } else {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss">
.wot-theme-dark .wd-cell {
  background-color: #1b1b1b;
  color: #fff;
}

.wot-theme-dark .wd-cell__value,
.wot-theme-dark .wd-cell__label {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-cell.is-hover {
  background-color: #323233;
}

.wot-theme-dark .wd-cell.is-border .wd-cell__wrapper {
  position: relative;
}

.wot-theme-dark .wd-cell.is-border .wd-cell__wrapper:after {
  position: absolute;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: var(--wot-dark-border-color, #3a3a3c);
}

.wot-theme-dark .wd-cell .wd-cell__arrow-right {
  color: #fff;
}

.wd-cell {
  position: relative;
  padding-left: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
  background-color: var(--wot-color-white, rgb(255, 255, 255));
  text-decoration: none;
  color: var(--wot-cell-title-color, rgba(0, 0, 0, 0.85));
  line-height: var(--wot-cell-line-height, 24px);
  -webkit-tap-highlight-color: transparent;
}

.wd-cell.is-border .wd-cell__wrapper {
  position: relative;
}

.wd-cell.is-border .wd-cell__wrapper:after {
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

.wd-cell__wrapper {
  position: relative;
  display: flex;
  padding: var(--wot-cell-wrapper-padding, 10px) var(--wot-cell-padding, var(--wot-size-side-padding, 15px)) var(--wot-cell-wrapper-padding, 10px) 0;
  justify-content: space-between;
  align-items: flex-start;
}

.wd-cell__wrapper.is-vertical {
  display: block;
}

.wd-cell__wrapper.is-vertical .wd-cell__right {
  margin-top: var(--wot-cell-vertical-top, 16px);
}

.wd-cell__wrapper.is-vertical .wd-cell__value {
  text-align: left;
}

.wd-cell__wrapper.is-vertical .wd-cell__left {
  margin-right: 0;
}

.wd-cell__wrapper.is-label {
  padding: var(--wot-cell-wrapper-padding-with-label, 16px) var(--wot-cell-padding, var(--wot-size-side-padding, 15px))
    var(--wot-cell-wrapper-padding-with-label, 16px) 0;
}

.wd-cell__left {
  position: relative;
  flex: 1;
  display: flex;
  text-align: left;
  font-size: var(--wot-cell-title-fs, 14px);
  box-sizing: border-box;
  margin-right: var(--wot-cell-padding, var(--wot-size-side-padding, 15px));
}

.wd-cell__left.is-required {
  padding-left: 12px;
}

.wd-cell__left.is-required:after {
  position: absolute;
  content: '*';
  top: 0;
  left: 0;
  font-size: var(--wot-cell-required-size, 18px);
  color: var(--wot-cell-required-color, var(--wot-color-danger, #fa4350));
}

.wd-cell__right {
  position: relative;
  flex: 1;
}

.wd-cell__title {
  flex: 1;
  width: 100%;
  font-size: var(--wot-cell-title-fs, 14px);
}

.wd-cell__label {
  margin-top: 2px;
  font-size: var(--wot-cell-label-fs, 12px);
  color: var(--wot-cell-label-color, rgba(0, 0, 0, 0.45));
}

.wd-cell__icon {
  display: block;
  position: relative;
  margin-right: var(--wot-cell-icon-right, 4px);
  font-size: var(--wot-cell-icon-size, 16px);
  height: var(--wot-cell-line-height, 24px);
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-cell__body {
  display: flex;
}

.wd-cell__value {
  position: relative;
  flex: 1;
  font-size: var(--wot-cell-value-fs, 14px);
  color: var(--wot-cell-value-color, rgba(0, 0, 0, 0.85));
  text-align: right;
  vertical-align: middle;
}

.wd-cell__arrow-right {
  display: block;
  margin-left: 8px;
  width: var(--wot-cell-arrow-size, 18px);
  font-size: var(--wot-cell-arrow-size, 18px);
  color: var(--wot-cell-arrow-color, rgba(0, 0, 0, 0.25));
  height: var(--wot-cell-line-height, 24px);
  line-height: var(--wot-cell-line-height, 24px);
}

.wd-cell__error-message {
  color: var(--wot-form-item-error-message-color, var(--wot-color-danger, #fa4350));
  font-size: var(--wot-form-item-error-message-font-size, var(--wot-fs-secondary, 12px));
  line-height: var(--wot-form-item-error-message-line-height, 24px);
  text-align: left;
  vertical-align: middle;
}

.wd-cell.is-link {
  -webkit-tap-highlight-color: var(--wot-cell-tap-bg, rgba(0, 0, 0, 0.06));
}

.wd-cell.is-hover {
  background-color: var(--wot-cell-tap-bg, rgba(0, 0, 0, 0.06));
}

.wd-cell.is-large .wd-cell__title {
  font-size: var(--wot-cell-title-fs-large, 16px);
}

.wd-cell.is-large .wd-cell__wrapper {
  padding-top: var(--wot-cell-wrapper-padding-large, 12px);
  padding-bottom: var(--wot-cell-wrapper-padding-large, 12px);
}

.wd-cell.is-large .wd-cell__label {
  font-size: var(--wot-cell-label-fs-large, 14px);
}

.wd-cell.is-large .wd-cell__icon {
  font-size: var(--wot-cell-icon-size-large, 18px);
}

.wd-cell.is-center .wd-cell__wrapper {
  align-items: center;
}
</style>
