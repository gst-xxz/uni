<template>
  <button
    :id="buttonId"
    :hover-class="`${disabled || loading ? '' : 'wd-button--active'}`"
    :style="customStyle"
    :class="
      cn([
        'wd-button',
        'is-' + type,
        'is-' + size,
        round ? 'is-round' : '',
        hairline ? 'is-hairline' : '',
        plain ? 'is-plain' : '',
        disabled ? 'is-disabled' : '',
        block ? 'is-block' : '',
        loading ? 'is-loading' : '',
        customClass
      ])
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
      <wd-icon v-else-if="icon" custom-class="wd-button__icon" :name="icon" :classPrefix="classPrefix"></wd-icon>
      <div class="wd-button__text">
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
.wot-theme-dark .wd-button.is-info {
  background: #323233;
  color: rgba(232, 230, 227, 0.8);
}

.wot-theme-dark .wd-button.is-plain {
  background: transparent;
}

.wot-theme-dark .wd-button.is-plain.is-info {
  color: #fff;
}

.wot-theme-dark .wd-button.is-plain.is-info:after {
  border-color: #646566;
}

.wot-theme-dark .wd-button.is-text.is-disabled {
  color: #595959;
  background: transparent;
}

.wot-theme-dark .wd-button.is-icon {
  color: #fff;
}

.wot-theme-dark .wd-button.is-icon.is-disabled {
  color: #595959;
  background: transparent;
}

.wd-button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  -webkit-appearance: none;
  outline: none;
  background: transparent;
  box-sizing: border-box;
  border: none;
  border-radius: 0;
  color: var(--wot-button-normal-color, var(--wot-color-title, var(--wot-color-black, rgb(0, 0, 0))));
  transition: opacity 0.2s;
  -webkit-user-select: none;
  user-select: none;
  font-weight: 400;
}

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

.wd-button:after {
  border: none;
  border-radius: 0;
}

.wd-button--active:active:before {
  opacity: 0.15;
}

.wd-button.is-disabled {
  opacity: var(--wot-button-disabled-opacity, 0.6);
}

.wd-button__loading {
  margin-right: 5px;
  /* -webkit-animation: wd-rotate-5cd5873a 0.8s linear infinite;
  animation: wd-rotate-5cd5873a 0.8s linear infinite;
  -webkit-animation-duration: 2s;
  animation-duration: 2s; */
}

.wd-button.is-primary {
  background: var(--wot-button-primary-bg-color, var(--wot-color-theme, #4d80f0));
  color: var(--wot-button-primary-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-button.is-success {
  background: var(--wot-button-success-bg-color, var(--wot-color-success, #34d19d));
  color: var(--wot-button-success-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-button.is-info {
  background: var(--wot-button-info-bg-color, #f0f0f0);
  color: var(--wot-button-info-color, var(--wot-color-title, var(--wot-color-black, rgb(0, 0, 0))));
}

.wd-button.is-warning {
  background: var(--wot-button-warning-bg-color, var(--wot-color-warning, #f0883a));
  color: var(--wot-button-warning-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-button.is-error {
  background: var(--wot-button-error-bg-color, var(--wot-color-danger, #fa4350));
  color: var(--wot-button-error-color, var(--wot-color-white, rgb(255, 255, 255)));
}

.wd-button.is-small {
  height: var(--wot-button-small-height, 28px);
  padding: var(--wot-button-small-padding, 0 12px);
  border-radius: var(--wot-button-small-radius, 2px);
  font-size: var(--wot-button-small-fs, var(--wot-fs-secondary, 12px));
  font-weight: 400;
}

.wd-button.is-medium {
  height: var(--wot-button-medium-height, 36px);
  padding: var(--wot-button-medium-padding, 0 16px);
  border-radius: var(--wot-button-medium-radius, 4px);
  font-size: var(--wot-button-medium-fs, var(--wot-fs-content, 14px));
}

.wd-button.is-medium.is-round {
  min-width: 120px;
}

.wd-button.is-medium.is-round.is-icon {
  min-width: 0;
  border-radius: 50%;
}

.wd-button.is-medium.is-round.is-text {
  border-radius: 0;
  min-width: 0;
}

.wd-button.is-large {
  height: var(--wot-button-large-height, 44px);
  padding: var(--wot-button-large-padding, 0 36px);
  border-radius: var(--wot-button-large-radius, 8px);
  font-size: var(--wot-button-large-fs, var(--wot-fs-title, 16px));
}

.wd-button.is-large:after {
  border-radius: var(--wot-button-large-radius, 8px);
}

.wd-button.is-round {
  border-radius: 999px;
}

.wd-button.is-text {
  color: var(--wot-button-primary-bg-color, var(--wot-color-theme, #4d80f0));
  min-width: 0;
  padding: 4px 0;
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

.wd-button.is-block {
  display: flex;
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

.wd-button__icon {
  display: block;
  margin-right: 6px;
  font-size: var(--wot-button-icon-fs, 1.18em);
  vertical-align: middle;
}

.wd-button__text {
  -webkit-user-select: none;
  user-select: none;
  white-space: nowrap;
}

@-webkit-keyframes wd-rotate-5cd5873a {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes wd-rotate-5cd5873a {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
