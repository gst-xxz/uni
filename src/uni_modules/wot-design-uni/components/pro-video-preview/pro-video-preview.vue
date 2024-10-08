<template>
  <view
    :class="cn('fixed top-0 left-0 right-0 bottom-0 z-[999] w-full h-full flex flex-col items-center justify-center bg-black/80', customClass)"
    :style="customStyle" v-if="showPopup" @click="close">
    <view class="w-full h-[242px] transition-[all_0.3s_ease]" @click.stop="">
      <video class="w-full h-[242px] transition-[all_0.3s_ease]" v-if="previdewVideo.url" :controls="true"
        :poster="previdewVideo.poster" :title="previdewVideo.title" play-btn-position="center" :enableNative="true"
        :src="previdewVideo.url" :enable-progress-gesture="false"></video>
    </view>
    <pro-icon name="close"
      custom-class="absolute top-0 right-0 p-3 text-center cursor-pointer text-[20px] text-white box-border"
      @click="close" />
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-video-preview',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { videoPreviewProps, type PreviewVideo, type VideoPreviewExpose } from './types'
import useLockScroll from '../composables/useLockScroll'
import { cn } from '@/uni_modules/pro-core/lib/utils';
defineProps(videoPreviewProps)

const showPopup = ref<boolean>(false)
const previdewVideo = reactive<PreviewVideo>({ url: '', poster: '', title: '' })

function open(video: PreviewVideo) {
  showPopup.value = true
  previdewVideo.url = video.url
  previdewVideo.poster = video.poster
  previdewVideo.title = video.title
}

function close() {
  showPopup.value = false
  nextTick(() => {
    handleClosed()
  })
}

function handleClosed() {
  previdewVideo.url = ''
  previdewVideo.poster = ''
  previdewVideo.title = ''
}

// #ifdef H5
useLockScroll(() => showPopup.value)
// #endif

defineExpose<VideoPreviewExpose>({
  open,
  close
})
</script>
