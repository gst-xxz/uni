<template>
  <view :class="['pro-loadmore w-full text-center h-12 leading-[48px] text-black/45', customClass]" :style="customStyle"
    @click="reload">
    <pro-divider v-if="state === 'finished'">{{ finishedText || translate('finished') }}</pro-divider>
    <block v-if="state === 'error'">
      <block v-if="errorText">
        {{ errorText }}
      </block>
      <block v-else>
        <text class="inline-block align-middle text-sm">{{ translate('error') }}</text>
        <text class="inline-block align-middle text-sm text-primary mx-0 mt-1.5">{{
          translate('retry')
          }}</text>
        <pro-icon name="refresh" custom-class="inline-block align-middle text-primary text-base" />
      </block>
    </block>
    <block v-if="state === 'loading'">
      <pro-loading custom-class="inline-block align-middle mr-2 h-4 w-4" />
      <text class="inline-block align-middle text-sm">{{ loadingText || translate('loading') }}</text>
    </block>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-loadmore',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { ref } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { loadmoreProps, type LoadMoreState } from './types'

const props = defineProps(loadmoreProps)
const emit = defineEmits(['reload'])

const { translate } = useTranslate('loadmore')

const currentState = ref<LoadMoreState | null>(null)

function reload() {
  if (props.state !== 'error') return
  currentState.value = 'loading'
  emit('reload')
}
</script>