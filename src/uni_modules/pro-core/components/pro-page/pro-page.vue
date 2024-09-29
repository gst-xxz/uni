<template>
  <view :class="['min-h-full', customClass, theme === 'dark' ? 'dark' : '']">
    <pro-toast />
    <slot />
    <pro-notify />
    <pro-message-box />
    <pro-action-sheet v-model="actionSheetData.modelValue" :actions="actionSheetData.actions"
      :panels="actionSheetData.panels" :cancelText="actionSheetData.cancelText" @close="actionSheetData.onClose"
      @select="actionSheetData.onSelect" />
  </view>
</template>

<script>
import { useToast } from '@/uni_modules/wot-design-uni'
import { useNotify } from '@/uni_modules/wot-design-uni'
import { useMessage } from '@/uni_modules/wot-design-uni'
import pro from '@/uni_modules/pro-core/lib/pro'

export default {
  name: 'pro-page',
  props: {
    customClass: {
      type: String,
      default: ''
    }
  },
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  data () {
    return {
      actionSheetData: pro.actionSheetDefaultData,
      theme: 'light'
    }
  },
  setup () {
    const toast = useToast()
    const message = useMessage()
    const notify = useNotify()
    return {
      toast,
      notify,
      message,
    }
  },
  mounted () {
    const that = this
    pro.bindActionSheet((newActionSheet) => {
      that.actionSheetData = {
        ...newActionSheet,
        onClose: () => {
          that.actionSheetData = pro.actionSheetDefaultData
          newActionSheet.onClose?.()
        }
      }
    })
  },
  unmounted () {
    pro.unbindToast()
    pro.unbindNotify()
    pro.unbindMessage()
    pro.unbindActionSheet()
  },
  watch: {
    toast: {
      handler (newVal) {
        pro.bindToast(newVal)
      },
      immediate: true,
      deep: true
    },
    notify: {
      handler (newVal) {
        pro.bindNotify(newVal)
      },
      immediate: true,
      deep: true
    },
    message: {
      handler (newVal) {
        pro.bindMessage(newVal)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
