<template>
  <view :class="cn('w-full flex items-center pt-[9px] pb-2 px-0 h-[3px] ', customClass)" :style="customStyle">
    <!--进度条-->
    <view class="block relative flex-1 h-[3px] rounded-[1.5px] bg-[rgba(229,229,229,1)]">
      <view :class="cn('block h-full rounded-[1.5px] absolute top-0 left-0 text-lg bg-[linear-gradient(315deg,#517cf0_0%,#769ef5_100%)] transition-[width] ease-linear', {
        'bg-danger': status === 'danger',
        'bg-success': status === 'success'
      })" :style="rootStyle"></view>
    </view>
    <!--文案、图标-->
    <view v-if="!hideText" class="w-[30px] ml-[9px] text-sm text-[#333]">
      {{ percentage }}%
    </view>
    <pro-icon v-else-if="status"
      :custom-class="cn(`w-[30px] ml-[9px] text-lg text-[#333] ${status === 'danger' ? 'text-danger' : ''} ${status === 'success' ? 'text-success' : ''}`)"
      :name="status == 'danger' ? 'close-outline' : 'check-outline'"
      :color="typeof color === 'string' ? color : ''"></pro-icon>
  </view>
</template>

<script lang="ts">
export default {
  name: 'pro-progress',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>

import { computed, ref, watch } from 'vue'
import { checkNumRange, isArray, objToStyle } from '../common/util'
import { progressProps } from './types'
import { cn } from '@/uni_modules/pro-core/lib/utils';

const props = defineProps(progressProps)
// 进度条展示的颜色
const showColor = ref<string>('')
// 进度条展示的进度
const showPercent = ref<number>(0)
// newPercent - oldPercent 的绝对值
const changeCount = ref<number>(0)

let timer: NodeJS.Timeout | null = null // 定时器

const rootStyle = computed(() => {
  const style: Record<string, string | number> = {
    background: showColor.value,
    width: showPercent.value + '%',
    'transition-duration': changeCount.value * props.duration * 0.001 + 's'
  }
  return objToStyle(style)
})

watch(
  () => props.percentage,
  (newValue) => {
    // 校验类型
    if (Number.isNaN(newValue) || newValue < 0 || newValue > 100) {
      console.error('The value of percentage must be between 0 and 100')
    }
    controlProgress()
  }
)

watch(
  () => props.color,
  () => {
    controlProgress()
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.duration,
  (newValue) => {
    checkNumRange(newValue)
  },
  {
    deep: true,
    immediate: true
  }
)


/**
 * @description
 * @param {Number} targetPercent 目标值
 * @param {String} color 目标颜色
 */
function update(targetPercent: number, color: string) {
  // 需要等上一个定时器跑完
  if (timer) return
  const { duration } = props
  // transition-duration的优先更高
  changeCount.value = Math.abs(targetPercent - showPercent.value)
  setTimeout(() => {
    showPercent.value = targetPercent
    showColor.value = color
    timer = setTimeout(() => {
      clearTimeout(timer as any)
      timer = null
      controlProgress()
    }, changeCount.value * duration)
  }, 50)
}

/**
 * @description 控制进度条的进度和每段的颜色
 */
function controlProgress() {
  const {
    // 目标百分比
    percentage,
    // 传入的color数组
    color
  } = props
  // 锁
  if (showPercent.value === percentage || !percentage) return
  /**
   * 数组边界安全判断
   */
  let colorArray: string[] | Record<string, any>[] = (isArray(color) ? color : [color]) as string[] | Record<string, any>[]
  if (colorArray.length === 0) throw Error('The colorArray is empty')
  const isStrArray = (colorArray as any).every((item: any) => typeof item === 'string')
  // eslint-disable-next-line no-prototype-builtins
  const isObjArray = (colorArray as any).every((color: any) => color.hasOwnProperty('color') && color.hasOwnProperty('percentage'))
  if (!isStrArray && !isObjArray) {
    throw Error('Color must be String or Object with color and percentage')
  }
  if (isObjArray && (colorArray as any).some(({ percentage }: any) => Number.isNaN(parseInt(percentage)))) {
    throw Error('All the percentage must can be formatted to Number')
  }
  /**
   * 根据colorArray平均分布每段color值，或使用用户自定义的值
   */
  const partNum = parseInt(`${100 / colorArray.length}`)
  const partList = isObjArray
    ? colorArray.sort((a: any, b: any) => a.percentage - b.percentage)
    : colorArray.map((item, index) => {
      return {
        color: item,
        percentage: (index + 1) * partNum
      }
    })
  /**
   * 找到当前目标
   */
  showPercent.value > percentage
    ? // 减小不加动画，找到第一个比target大的锚点，取锚点颜色并设置target值
    partList.some((part: any) => {
      if (percentage <= part.percentage) {
        update(percentage, part.color)
        return true
      }
    })
    : // 增加使用分段动画
    partList.some((part: any, index: number) => {
      if (showPercent.value < part.percentage && part.percentage <= percentage) {
        // 找到第一个比now大的点，如果这个点比target小或等，就把这个点设置为下一个即将展示的点
        update(part.percentage, part.color)
        return true
      } else if (index === partList.length - 1) {
        update(percentage, part.color)
      }
    })
}
</script>