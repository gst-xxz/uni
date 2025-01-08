<template>
  <div
    v-if="currentStatus"
    :class="`wd-step ${customClass} ${currentStatus ? 'is-' + currentStatus : ''} ${canAlignCenter ? 'is-center' : ''}  ${
      vertical ? 'is-vertical' : ''
    }`"
    :style="rootStyle"
  >
    <div :class="`wd-step__header  ${dot ? 'is-dot' : ''}`">
      <div :class="`wd-step__icon  ${dot ? 'is-dot' : !!icon || $slots.icon ? 'is-icon' : 'is-text'}`">
        <div v-if="dot" class="wd-step__dot"></div>
        <slot v-else-if="$slots.icon" name="icon" />
        <wd-icon v-else-if="icon" custom-class="wd-step__icon-inner" :name="icon" />
        <div v-else class="wd-step__icon-outer">
          <wd-icon v-if="currentStatus === 'finished'" name="check-bold" />
          <wd-icon v-else-if="currentStatus === 'error'" name="close-bold" />
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>
      <div v-if="index < childrenLength - 1" class="wd-step__line"></div>
    </div>
    <div class="wd-step__content">
      <div :class="`wd-step__title ${$slots.description || description ? 'is-description' : ''}`">
        <slot v-if="$slots.title" name="title" />
        <span v-else>{{ currentTitle }}</span>
      </div>
      <div v-if="$slots.description || description" class="wd-step__description">
        <slot v-if="$slots.description" name="description" />
        <span v-else>{{ description }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-step',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>
<script lang="ts" setup>
import { computed } from 'vue'
import { useParent } from '../composables/useParent'
import { STEPS_KEY } from '../wd-steps/types'
import { isDef, objToStyle } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import { stepProps } from './types'
import type { CSSProperties } from 'vue'

const props = defineProps(stepProps)

const { parent: steps, index } = useParent(STEPS_KEY)

const { translate } = useTranslate('steps')

const currentStatus = computed(() => {
  return getCurrentStatus(index.value)
})

const currentTitle = computed(() => {
  return getCurrentTitle(currentStatus.value)
})
const rootStyle = computed(() => {
  const style: CSSProperties = {}
  if (steps) {
    const { vertical, space } = steps.props
    if (vertical) {
      if (isDef(space)) {
        style['height'] = space
      }
    } else {
      style['width'] = space || 100 / steps.children.length + '%'
    }
  }
  return `${objToStyle(style)};${props.customStyle}`
})

const canAlignCenter = computed(() => {
  if (isDef(steps)) {
    const { vertical, alignCenter } = steps.props
    return Boolean(!vertical && alignCenter)
  } else {
    return false
  }
})

const vertical = computed(() => {
  if (isDef(steps)) {
    return Boolean(steps.props.vertical)
  } else {
    return false
  }
})
const dot = computed(() => {
  if (isDef(steps)) {
    return Boolean(steps.props.dot)
  } else {
    return false
  }
})

const childrenLength = computed(() => {
  if (isDef(steps)) {
    return Number(steps.children.length)
  } else {
    return 0
  }
})

function getCurrentStatus(index: number) {
  if (props.status) {
    return props.status
  }

  if (steps) {
    const { active } = steps.props
    if (Number(active) > index) {
      return 'finished'
    } else if (Number(active) === index) {
      return 'process'
    } else {
      return 'wait'
    }
  } else {
    return 'wait'
  }
}
function getCurrentTitle(currentStatus: string) {
  if (props.title) return props.title

  switch (currentStatus) {
    case 'finished':
      return translate('finished')
    case 'error':
      return translate('failed')
    case 'process':
      return translate('process')
    case 'wait':
    default:
      return translate('wait')
  }
}
</script>
<style>
.wot-theme-dark .wd-step__icon {
  background: #1b1b1b;
}

.wot-theme-dark .wd-step__content {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-step__line,
.wot-theme-dark .wd-step__dot {
  background: #595959;
}

.wot-theme-dark .wd-step__description {
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-step.is-wait .wd-step__description {
  color: #595959;
}

.wot-theme-dark .wd-step .wd-step__icon-outer,
.wot-theme-dark .wd-step .wd-step__icon-inner {
  color: rgba(232, 230, 227, 0.8);
  border-color: #595959;
}

.wd-step {
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.wd-step__header {
  position: relative;
  font-size: 0;
}

.wd-step__header.is-dot .wd-step__line {
  margin-top: -1px;
}

.wd-step__icon {
  display: inline-block;
  position: relative;
  width: var(--wot-steps-icon-size, 22px);
  height: var(--wot-steps-icon-size, 22px);
  background: #fff;
  z-index: 1;
}

.wd-step__icon.is-icon {
  width: var(--wot-steps-is-icon-width, 30px);
  text-align: center;
}

.wd-step__icon.is-dot {
  width: var(--wot-steps-dot-size, 7px);
  height: var(--wot-steps-dot-size, 7px);
  border: 1px solid transparent;
  margin-left: -1px;
  border-radius: 50%;
  background: transparent;
}

.wd-step__icon-inner {
  font-size: var(--wot-steps-icon-size, 22px);
  color: var(--wot-steps-inactive-color, rgba(0, 0, 0, 0.25));
}

.wd-step__icon-outer {
  width: calc(var(--wot-steps-icon-size, 22px) - 2px);
  height: calc(var(--wot-steps-icon-size, 22px) - 2px);
  border: 1px solid var(--wot-steps-inactive-color, rgba(0, 0, 0, 0.25));
  color: var(--wot-steps-inactive-color, rgba(0, 0, 0, 0.25));
  text-align: center;
  line-height: calc(var(--wot-steps-icon-size, 22px) - 2px);
  border-radius: 50%;
  font-size: var(--wot-steps-icon-text-fs, var(--wot-fs-content, 14px));
}

.wd-step__line {
  position: absolute;
  width: 100%;
  height: 1px;
  background: var(--wot-steps-line-color, rgba(0, 0, 0, 0.15));
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  top: 50%;
  left: 0;
}

.wd-step__dot {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--wot-steps-line-color, rgba(0, 0, 0, 0.15));
}

.wd-step__content {
  margin-top: 7px;
  color: var(--wot-steps-inactive-color, rgba(0, 0, 0, 0.25));
  font-size: var(--wot-steps-label-fs, var(--wot-fs-secondary, 12px));
}

.wd-step__title {
  font-weight: var(--wot-steps-title-fw, var(--wot-fw-medium, 500));
  line-height: 1.43;
}

.wd-step__title.is-description {
  font-size: var(--wot-steps-title-fs, var(--wot-fs-content, 14px));
}

.wd-step__description {
  margin-top: 5px;
  padding: 0 2px;
  color: var(--wot-steps-description-color, rgba(0, 0, 0, 0.45));
}

.wd-step.is-wait .wd-step__description {
  color: var(--wot-steps-inactive-color, rgba(0, 0, 0, 0.25));
}

.wd-step.is-finished .wd-step__icon-inner {
  color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-finished .wd-step__icon-outer {
  color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-finished .wd-step__title {
  color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-finished .wd-step__dot {
  background: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-process .wd-step__icon.is-icon .wd-step__icon-inner {
  color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-process .wd-step__icon-outer {
  color: #fff;
  background: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
  border-color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-process .wd-step__title {
  color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-process .wd-step__icon {
  border-color: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-process .wd-step__icon.is-dot:after {
  position: absolute;
  content: '';
  width: var(--wot-steps-dot-size, 7px) 10px;
  height: var(--wot-steps-dot-size, 7px) 10px;
  left: -5px;
  top: -5px;
  border-radius: 50%;
  background: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
  opacity: 0.2;
}

.wd-step.is-process .wd-step__dot {
  background: var(--wot-steps-finished-color, var(--wot-color-theme, #4d80f0));
}

.wd-step.is-error .wd-step__icon-inner,
.wd-step.is-error .wd-step__title {
  color: var(--wot-steps-error-color, var(--wot-color-danger, #fa4350));
}

.wd-step.is-error .wd-step__icon-outer {
  color: var(--wot-steps-error-color, var(--wot-color-danger, #fa4350));
  border-color: var(--wot-steps-error-color, var(--wot-color-danger, #fa4350));
}

.wd-step.is-error .wd-step__dot {
  background: var(--wot-steps-error-color, var(--wot-color-danger, #fa4350));
}

.wd-step.is-center {
  text-align: center;
}

.wd-step.is-center .wd-step__line {
  left: 50%;
  right: -50%;
}

.wd-step.is-vertical {
  display: block;
}

.wd-step.is-vertical .wd-step__header {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.wd-step.is-vertical .wd-step__header.is-dot {
  top: 6px;
}

.wd-step.is-vertical .wd-step__header.is-dot .wd-step__line {
  margin-left: -1px;
  margin-top: 0;
}

.wd-step.is-vertical .wd-step__content {
  margin-left: 30px;
  margin-top: 0;
  padding-bottom: 20px;
}

.wd-step.is-vertical .wd-step__line {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}

.wd-step.is-vertical .wd-step__icon.is-dot {
  margin-left: 0;
  margin-top: -1px;
}
</style>
