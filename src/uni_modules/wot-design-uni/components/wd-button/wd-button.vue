<template>
  <button
    :id="buttonId"
    :hover-class="`${disabled || loading ? '' : 'wd-button--active active:before:opacity-15'}`"
    :style="customStyle"
    :class="
      cn(
        'wd-button relative inline-flex justify-center items-center appearance-none outline-none bg-transparent box-border border-none rounded-none text-black select-none font-normal transition-opacity duration-[0.2s]',
        'after:border-none after:rounded-none',
        type === 'primary' ? 'bg-primary text-white' : '',
        type === 'success' ? 'bg-success text-white' : '',
        type === 'info' ? 'bg-info text-black' : '',
        type === 'warning' ? 'bg-warning text-white' : '',
        type === 'error' ? 'bg-danger text-white' : '',
        type === 'text' ? 'text-primary min-w-0 py-1 px-0' : '',
        type === 'icon' ? '' : '',
        // 'is-' + type,
        size === 'small' ? 'h-7 py-0 px-3 rounded-sm text-xs font-medium' : '',
        size === 'medium' ? 'h-9 py-0 px-4 rounded text-sm' : '',
        size === 'medium' && round ? 'min-w-[120px]' : '',
        size === 'medium' && round && type === 'icon' ? 'min-w-0 rounded-full' : '',
        size === 'medium' && round && type === 'text' ? 'min-w-0 rounded-none' : '',
        size === 'large' ? 'h-11 py-0 px-9 rounded-lg text-base after:rounded-lg' : '',
        // 'is-' + size,
        round ? 'is-round rounded-full' : '',
        hairline ? 'is-hairline' : '',
        plain ? 'is-plain' : '',
        disabled ? 'is-disabled opacity-60' : '',
        block ? 'is-block flex' : '',
        loading ? 'is-loading' : '',
        customClass
      )
    "
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :open-type="disabled || loading ? undefined : openType"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :app-parameter="appParameter"
    :show-message-card="showMessageCard"
    :session-from="sessionFrom"
    :lang="lang"
    :hover-stop-propagation="hoverStopPropagation"
    :scope="scope"
    @click="handleClick"
    @getAuthorize="handleGetAuthorize"
    @getuserinfo="handleGetuserinfo"
    @contact="handleConcat"
    @getphonenumber="handleGetphonenumber"
    @error="handleError"
    @launchapp="handleLaunchapp"
    @opensetting="handleOpensetting"
    @chooseavatar="handleChooseavatar"
    @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
  >
    <div class="wd-button__content inline-flex items-center">
      <div v-if="loading" class="wd-button__loading inline-block">
        <wd-loading :size="loadingSize" customClass="!inline-block align-middle" />
      </div>
      <wd-icon v-else-if="icon" custom-class="wd-button__icon block mr-1.5 text-[1.18em]" :name="icon" :classPrefix="classPrefix"></wd-icon>
      <div class="wd-button__text select-none whitespace-nowrap">
        <slot />
      </div>
    </div>
  </button>
</template>

<script lang="ts">
export default {
  name: 'wd-button',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { buttonProps } from './types'
import { cn } from '../common/util'

const props = defineProps(buttonProps)
const emit = defineEmits([
  'click',
  'getuserinfo',
  'contact',
  'getphonenumber',
  'error',
  'launchapp',
  'opensetting',
  'chooseavatar',
  'agreeprivacyauthorization'
])

const hoverStartTime = ref<number>(20)
const hoverStayTime = ref<number>(70)

const loadingSize = computed(() => {
  if (props.size === 'large') {
    return '24px'
  }
  if (props.size === 'medium') {
    return '18px'
  }
  return '14px'
})

function handleClick(event: any) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

/**
 * 支付宝小程序授权
 * @param event
 */
function handleGetAuthorize(event: any) {
  if (props.scope === 'phoneNumber') {
    handleGetphonenumber(event)
  } else if (props.scope === 'userInfo') {
    handleGetuserinfo(event)
  }
}

function handleGetuserinfo(event: any) {
  emit('getuserinfo', event.detail)
}

function handleConcat(event: any) {
  emit('contact', event.detail)
}

function handleGetphonenumber(event: any) {
  emit('getphonenumber', event.detail)
}

function handleError(event: any) {
  emit('error', event.detail)
}

function handleLaunchapp(event: any) {
  emit('launchapp', event.detail)
}

function handleOpensetting(event: any) {
  emit('opensetting', event.detail)
}

function handleChooseavatar(event: any) {
  emit('chooseavatar', event.detail)
}

function handleAgreePrivacyAuthorization(event: any) {
  emit('agreeprivacyauthorization', event.detail)
}
</script>

<style>
.wd-button:before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: var(--wot-color-black, rgb(0, 0, 0));
  border: inherit;
  border-color: var(--wot-color-black, rgb(0, 0, 0));
  border-radius: inherit;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  content: ' ';
}

.wd-button__loading {
  margin-right: 5px;
  /* -webkit-animation: wd-rotate-5cd5873a 0.8s linear infinite;
  animation: wd-rotate-5cd5873a 0.8s linear infinite;
  -webkit-animation-duration: 2s;
  animation-duration: 2s; */
}

.wd-button.is-text:after {
  display: none;
}

.wd-button.is-text.wd-button--active {
  opacity: var(--wot-button-text-hover-opacity, 0.7);
}

.wd-button.is-text.wd-button--active:active:before {
  display: none;
}

.wd-button.is-text.is-disabled {
  color: var(--wot-button-normal-disabled-color, rgba(0, 0, 0, 0.25));
  background: transparent;
}

.wd-button.is-plain {
  background: var(--wot-button-plain-bg-color, var(--wot-color-white, rgb(255, 255, 255)));
  border: 1px solid currentColor;
}

.wd-button.is-plain.is-primary {
  color: var(--wot-button-primary-bg-color, var(--wot-color-theme, #4d80f0));
}

.wd-button.is-plain.is-success {
  color: var(--wot-button-success-bg-color, var(--wot-color-success, #34d19d));
}

.wd-button.is-plain.is-info {
  color: var(--wot-button-info-plain-normal-color, rgba(0, 0, 0, 0.85));
  border-color: var(--wot-button-info-plain-border-color, rgba(0, 0, 0, 0.45));
}

.wd-button.is-plain.is-warning {
  color: var(--wot-button-warning-bg-color, var(--wot-color-warning, #f0883a));
}

.wd-button.is-plain.is-error {
  color: var(--wot-button-error-bg-color, var(--wot-color-danger, #fa4350));
}

.wd-button.is-hairline {
  border-width: 0;
}

.wd-button.is-hairline.is-plain {
  position: relative;
}

.wd-button.is-hairline.is-plain:after {
  position: absolute;
  display: block;
  content: ' ';
  pointer-events: none;
  width: 200%;
  height: 200%;
  left: 0;
  top: 0;
  border: 1px solid var(--wot-color-border-light, #e8e8e8);
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  box-sizing: border-box;
  -webkit-transform-origin: left top;
  transform-origin: left top;
}

.wd-button.is-hairline.is-plain:before {
  border-radius: inherit;
}

.wd-button.is-hairline.is-plain:after {
  border-color: inherit;
}

.wd-button.is-hairline.is-plain.is-round:after {
  border-radius: inherit !important;
}

.wd-button.is-hairline.is-plain.is-large:after {
  border-radius: calc(2 * var(--wot-button-large-radius, 8px));
}

.wd-button.is-hairline.is-plain.is-medium:after {
  border-radius: calc(2 * var(--wot-button-medium-radius, 4px));
}

.wd-button.is-hairline.is-plain.is-small:after {
  border-radius: calc(2 * var(--wot-button-small-radius, 2px));
}

.wd-button.is-icon {
  width: var(--wot-button-icon-size, 40px);
  height: var(--wot-button-icon-size, 40px);
  padding: 0;
  border-radius: 50%;
  color: var(--wot-button-icon-color, rgba(0, 0, 0, 0.65));
}

.wd-button.is-icon:after {
  display: none;
}

.wd-button.is-icon .wd-button__icon {
  margin-right: 0;
}

.wd-button.is-icon.is-disabled {
  color: var(--wot-button-icon-disabled-color, var(--wot-color-icon-disabled, #a7a7a7));
  background: transparent;
}
</style>
