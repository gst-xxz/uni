<template>
  <view class="min-h-full" :class="customClass">
    <wd-toast />
    <slot />
    <wd-notify />
    <wd-message-box />
    <wd-action-sheet v-model="actionSheetData.modelValue" :actions="actionSheetData.actions"
      :panels="actionSheetData.panels" :cancelText="actionSheetData.cancelText" @close="actionSheetData.onClose"
      @select="actionSheetData.onSelect" />
  </view>
</template>

<script>
import { useToast } from '@/uni_modules/wot-design-uni'
import { useNotify } from '@/uni_modules/wot-design-uni'
import { useMessage } from '@/uni_modules/wot-design-uni'

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
      actionSheetData: this.$actionSheet.defaultData
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
    this.$actionSheet.bind((newActionSheet) => {
      that.actionSheetData = {
        ...newActionSheet,
        onClose: () => {
          that.actionSheetData = this.$actionSheet.defaultData
          newActionSheet.onClose?.()
        }
      }
    })
  },
  unmounted () {
    this.$toast.unbind()
    this.$notify.unbind()
    this.$message.unbind()
    this.$actionSheet.unbind()
  },
  watch: {
    toast: {
      handler (newVal) {
        this.$toast.bind(newVal)
      },
      immediate: true,
      deep: true
    },
    notify: {
      handler (newVal) {
        this.$notify.bind(newVal)
      },
      immediate: true,
      deep: true
    },
    message: {
      handler (newVal) {
        this.$message.bind(newVal)
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
