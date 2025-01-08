<template>
  <div :class="cn(['wd-loadmore', customClass])" :style="customStyle" @click="reload">
    <wd-divider v-if="state === 'finished'">{{ finishedText || translate('finished') }}</wd-divider>
    <block v-if="state === 'error'">
      <span class="wd-loadmore__text">{{ errorText || translate('error') }}</span>
      <span class="wd-loadmore__text is-light">{{ translate('retry') }}</span>
      <wd-icon name="refresh" custom-class="wd-loadmore__refresh" />
    </block>
    <block v-if="state === 'loading'">
      <wd-loading v-bind="customLoadingProps" />
      <span class="wd-loadmore__text">{{ loadingText || translate('loading') }}</span>
    </block>
  </div>
</template>

<script lang="ts">
export default {
  name: 'wd-loadmore',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTranslate } from '../composables/useTranslate'
import { loadmoreProps, type LoadMoreState } from './types'
import type { LoadingProps } from '../wd-loading/types'
import { cn, isDef, isUndefined, omitBy } from '../common/util'

const customLoadingProps = computed(() => {
  const loadingProps: Partial<LoadingProps> = isDef(props.loadingProps) ? omitBy(props.loadingProps, isUndefined) : {}
  loadingProps.customClass = `wd-loadmore__loading ${loadingProps.customClass || ''}`
  return loadingProps
})

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

<style>
.wot-theme-dark .wd-loadmore {
  color: #fff;
}

.wd-loadmore {
  width: 100%;
  height: var(--wot-loadmore-height, 48px);
  line-height: var(--wot-loadmore-height, 48px);
  text-align: center;
  color: var(--wot-loadmore-color, rgba(0, 0, 0, 0.45));
}

.wd-loadmore__loading {
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
  width: var(--wot-loadmore-loading-size, var(--wot-fs-title, 16px));
  height: var(--wot-loadmore-loading-size, var(--wot-fs-title, 16px));
}

.wd-loadmore__text {
  display: inline-block;
  font-size: var(--wot-loadmore-fs, 14px);
  vertical-align: middle;
}

.wd-loadmore__text.is-light {
  margin: 0 6px;
  color: var(--wot-loadmore-error-color, var(--wot-color-theme, #4d80f0));
}

.wd-loadmore__refresh {
  display: inline-block;
  color: var(--wot-loadmore-error-color, var(--wot-color-theme, #4d80f0));
  vertical-align: middle;
  font-size: var(--wot-loadmore-refresh-fs, var(--wot-fs-title, 16px));
}
</style>
