<template>
  <view class="flex p-2 bg-slate-500 rounded-md" @click="handleClick">
    <view class="item-title">{{ item.name }}</view>
    <view class="item-desc">{{ item.id }}</view>
  </view>
</template>

<script>
import pro from '@/uni_modules/pro-core/lib/pro'

export default {
  name: 'XItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleClick () {
      console.log('click')
      // this.$toast.show('123')

      // this.$notify.showNotify({
      //   message: '自定义位置',
      //   position: 'bottom'
      // })
      // this.$message.alert('123')

      pro.actionSheet.show({
        actions: [
          {
            name: '选项1'
          },
          {
            name: '选项2'
          },
          {
            name: '选项3',
            subname: '描述信息'
          }
        ],
        onSelect (arg) {
          console.log(arg)
        }
      })
    }
  }
}
</script>