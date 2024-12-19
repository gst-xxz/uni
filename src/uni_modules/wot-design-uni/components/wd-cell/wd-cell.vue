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
@import './index.scss';
</style>
