<template>
  <button :id="buttonId" :hover-class="`${disabled || loading ? '' : 'wd-button--active'}`" :style="customStyle" :class="cn([
    'wd-button appearance-none user-select-none',
    'overflow-hidden inline-flex relative justify-center items-center outline-none box-border border-none font-normal',
    'min-h-auto w-auto',
    // 'is-' + type,
    type === 'primary' ? 'bg-primary text-white' : '',
    type === 'success' ? 'bg-success text-white' : '',
    type === 'warning' ? 'bg-warning text-white' : '',
    type === 'error' ? 'bg-danger text-white' : '',
    type === 'info' ? 'bg-info text-white' : '',
    'is-' + size,
    plain ? 'is-plain' : '',
    disabled ? 'is-disabled opacity-60' : '',
    round ? 'is-round overflow-hidden rounded-full' : '',
    hairline ? 'is-hairline' : '',
    block ? 'is-block flex' : '',
    loading ? 'is-loading' : '',
    customClass
  ])" :hover-start-time="hoverStartTime" :hover-stay-time="hoverStayTime"
    :open-type="disabled || loading ? '' : openType" :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath" :send-message-img="sendMessageImg" :app-parameter="appParameter"
    :show-message-card="showMessageCard" :session-from="sessionFrom" :lang="lang"
    :hover-stop-propagation="hoverStopPropagation" @click="handleClick" @getuserinfo="handleGetuserinfo"
    @contact="handleConcat" @getphonenumber="handleGetphonenumber" @error="handleError" @launchapp="handleLaunchapp"
    @opensetting="handleOpensetting" @chooseavatar="handleChooseavatar"
    @agreeprivacyauthorization="handleAgreePrivacyAuthorization">
    <view v-if="loading" class="wd-button__loading mr-0.5">
      <pro-loading :size="loadingSize" custom-class="wd-button__loading-icon block mr-1.5 align-top" />
    </view>
    <pro-icon v-else-if="icon" custom-class="wd-button__icon" :name="icon" :classPrefix="classPrefix"></pro-icon>
    <view class="wd-button__text min-w-0 py-1 px-0 user-select-none whitespace-nowrap">
      <slot />
    </view>
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
import { cn } from '@/uni_modules/pro-core/lib/utils'

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

const loadingSize = computed(() => {
  const map = { small: '14px', medium: '16px', large: '20px' }
  return map[props.size]
})
const hoverStartTime = ref<number>(20)
const hoverStayTime = ref<number>(70)

function handleClick(event: any) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
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

<style lang="scss" scoped>
@import './index.scss';
</style>
