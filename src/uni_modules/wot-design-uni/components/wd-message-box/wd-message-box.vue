<template>
  <div>
    <wd-popup
      transition="zoom-in"
      v-model="messageState.show"
      :close-on-click-modal="messageState.closeOnClickModal"
      :lazy-render="messageState.lazyRender"
      custom-class="wd-message-box"
      @click-modal="toggleModal('modal')"
      :z-index="messageState.zIndex"
      :duration="200"
    >
      <div :class="cn(`wd-message-box__container ${props.customClass}`)">
        <div :class="cn(`wd-message-box__body ${!messageState.title ? 'is-no-title' : ''} ${messageState.type === 'prompt' ? 'is-prompt' : ''}`)">
          <div v-if="messageState.title" class="wd-message-box__title">
            {{ messageState.title }}
          </div>
          <div class="wd-message-box__content">
            <block v-if="messageState.type === 'prompt'">
              <wd-input
                v-model="messageState.inputValue"
                :type="messageState.inputType"
                :size="messageState.inputSize"
                :placeholder="messageState.inputPlaceholder"
                @input="inputValChange"
              />
              <div v-if="messageState.showErr" class="wd-message-box__input-error">
                {{ messageState.inputError || translate('inputNoValidate') }}
              </div>
            </block>
            <slot>{{ messageState.msg }}</slot>
          </div>
        </div>
        <div :class="cn(`wd-message-box__actions ${messageState.showCancelButton ? 'wd-message-box__flex' : 'wd-message-box__block'}`)">
          <wd-button v-bind="customCancelProps" v-if="messageState.showCancelButton" @click="toggleModal('cancel')">
            {{ messageState.cancelButtonText || translate('cancel') }}
          </wd-button>
          <wd-button v-bind="customConfirmProps" @click="toggleModal('confirm')">
            {{ messageState.confirmButtonText || translate('confirm') }}
          </wd-button>
        </div>
      </div>
    </wd-popup>
  </div>
</template>
<script lang="ts">
export default {
  name: 'wd-message-box',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import { computed, inject, reactive, ref, watch } from 'vue'
import { messageBoxProps, type MessageOptionsWithCallBack, type MessageResult } from './types'
import { defaultOptions, getMessageDefaultOptionKey } from '.'
import { cn, deepAssign, isDef, isFunction, isUndefined, omitBy } from '../common/util'
import { useTranslate } from '../composables/useTranslate'
import type { ButtonProps } from '../wd-button/types'

const props = defineProps(messageBoxProps)

const { translate } = useTranslate('message-box')

const messageOptionKey = getMessageDefaultOptionKey(props.selector)
const messageOption = inject(messageOptionKey, ref<MessageOptionsWithCallBack>(defaultOptions)) // message选项

const messageState = reactive<MessageOptionsWithCallBack>({
  msg: '', // 消息内容
  show: false, // 是否显示弹框
  title: '', // 标题
  showCancelButton: false, // 是否展示取消按钮
  closeOnClickModal: true, // 是否支持点击蒙层关闭
  confirmButtonText: '', // 确定按钮文案
  cancelButtonText: '', // 取消按钮文案
  type: 'alert', // 弹框类型
  inputType: 'text', // 输入框类型
  inputValue: '', // 输入框初始值
  inputPlaceholder: '', // 输入框placeholder
  inputError: '', // 输入框错误提示文案
  showErr: false, // 是否显示错误提示
  zIndex: 99, // 弹窗层级
  lazyRender: true // 弹层内容懒渲染
})

/**
 * 确认按钮属性
 */
const customConfirmProps = computed(() => {
  const buttonProps: Partial<ButtonProps> = deepAssign(
    {
      block: true
    },
    isDef(messageState.confirmButtonProps) ? omitBy(messageState.confirmButtonProps, isUndefined) : {}
  )
  buttonProps.customClass = `${buttonProps.customClass || ''} wd-message-box__actions-btn`
  return buttonProps
})

/**
 * 取消按钮属性
 */
const customCancelProps = computed(() => {
  const buttonProps: Partial<ButtonProps> = deepAssign(
    {
      block: true,
      type: 'info'
    },
    isDef(messageState.cancelButtonProps) ? omitBy(messageState.cancelButtonProps, isUndefined) : {}
  )
  buttonProps.customClass = `${buttonProps.customClass || ''} wd-message-box__actions-btn`
  return buttonProps
})

// 监听options变化展示
watch(
  () => messageOption.value,
  (newVal: MessageOptionsWithCallBack) => {
    reset(newVal)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => messageState.show,
  (newValue) => {
    resetErr(!!newValue)
  },
  {
    deep: true,
    immediate: true
  }
)

/**
 * 点击操作
 * @param action
 */
function toggleModal(action: 'confirm' | 'cancel' | 'modal') {
  if (action === 'modal' && !messageState.closeOnClickModal) {
    return
  }
  if (messageState.type === 'prompt' && action === 'confirm' && !validate()) {
    return
  }
  switch (action) {
    case 'confirm':
      if (messageState.beforeConfirm) {
        messageState.beforeConfirm({
          resolve: (isPass) => {
            if (isPass) {
              handleConfirm({
                action: action,
                value: messageState.inputValue
              })
            }
          }
        })
      } else {
        handleConfirm({
          action: action,
          value: messageState.inputValue
        })
      }
      break
    case 'cancel':
      handleCancel({
        action: action
      })
      break
    default:
      handleCancel({
        action: 'modal'
      })
      break
  }
}

/**
 * 确认回调
 * @param result
 */
function handleConfirm(result: MessageResult) {
  messageState.show = false
  if (isFunction(messageState.success)) {
    messageState.success(result)
  }
}

/**
 * 取消回调
 * @param result
 */
function handleCancel(result: MessageResult) {
  messageState.show = false
  if (isFunction(messageState.fail)) {
    messageState.fail(result)
  }
}

/**
 * 如果存在校验规则行为，则进行判断校验是否通过规则。默认不存在校验直接铜鼓。
 */
function validate() {
  if (messageState.inputPattern && !messageState.inputPattern.test(String(messageState.inputValue))) {
    messageState.showErr = true
    return false
  }
  if (typeof messageState.inputValidate === 'function') {
    const validateResult = messageState.inputValidate(messageState.inputValue!)
    if (!validateResult) {
      messageState.showErr = true
      return false
    }
  }
  messageState.showErr = false
  return true
}

/**
 * @description show关闭时，销毁错误提示
 * @param val
 */
function resetErr(val: boolean) {
  if (val === false) {
    messageState.showErr = false
  }
}
function inputValChange({ value }: { value: string | number }) {
  if (value === '') {
    messageState.showErr = false
    return
  }
  messageState.inputValue = value
}

/**
 * 重置message选项值
 * @param option message选项值
 */
function reset(option: MessageOptionsWithCallBack) {
  if (option) {
    messageState.title = isDef(option.title) ? option.title : ''
    messageState.showCancelButton = isDef(option.showCancelButton) ? option.showCancelButton : false
    messageState.show = option.show
    messageState.closeOnClickModal = option.closeOnClickModal
    messageState.confirmButtonText = option.confirmButtonText
    messageState.cancelButtonText = option.cancelButtonText
    messageState.msg = option.msg
    messageState.type = option.type
    messageState.inputType = option.inputType
    messageState.inputSize = option.inputSize
    messageState.inputValue = option.inputValue
    messageState.inputPlaceholder = option.inputPlaceholder
    messageState.inputPattern = option.inputPattern!
    messageState.inputValidate = option.inputValidate
    messageState.success = option.success
    messageState.fail = option.fail
    messageState.beforeConfirm = option.beforeConfirm
    messageState.inputError = option.inputError
    messageState.showErr = option.showErr
    messageState.zIndex = option.zIndex
    messageState.lazyRender = option.lazyRender
    messageState.confirmButtonProps = option.confirmButtonProps
    messageState.cancelButtonProps = option.cancelButtonProps
  }
}
</script>

<style>
.wd-message-box,
.wd-message-box {
  border-radius: var(--wot-message-box-radius, 16px);
  overflow: hidden;
}

.wd-message-box__container {
  width: var(--wot-message-box-width, 300px);
  box-sizing: border-box;
}

.wd-message-box__body {
  background-color: var(--wot-message-box-bg, var(--wot-color-white, rgb(255, 255, 255)));
  padding: var(--wot-message-box-padding, 25px 24px 0);
}

.wd-message-box__body.is-no-title {
  padding: 25px 24px 0;
}

.wd-message-box__title {
  text-align: center;
  font-size: var(--wot-message-box-title-fs, 16px);
  color: var(--wot-message-box-title-color, rgba(0, 0, 0, 0.85));
  line-height: 20px;
  font-weight: 500;
  padding-top: 5px;
  padding-bottom: 10px;
}

.wd-message-box__content {
  max-height: var(--wot-message-box-content-max-height, 264px);
  color: var(--wot-message-box-content-color, #666666);
  font-size: var(--wot-message-box-content-fs, 14px);
  text-align: center;
  overflow: auto;
  line-height: 20px;
}

.wd-message-box__content::-webkit-scrollbar {
  width: var(--wot-message-box-content-scrollbar-width, 4px);
}

.wd-message-box__content::-webkit-scrollbar-thumb {
  width: var(--wot-message-box-content-scrollbar-width, 4px);
  background: var(--wot-message-box-content-scrollbar-color, rgba(0, 0, 0, 0.1));
  border-radius: calc(var(--wot-message-box-content-scrollbar-width, 4px) / 2);
}

.wd-message-box__input-error {
  min-height: 18px;
  margin-top: 2px;
  color: var(--wot-message-box-input-error-color, var(--wot-input-error-color, var(--wot-color-danger, #fa4350)));
  text-align: left;
}

.wd-message-box__input-error.is-hidden {
  visibility: hidden;
}

.wd-message-box__actions {
  padding: 24px;
}

.wd-message-box__actions-btn:not(:last-child) {
  margin-right: 16px;
}

.wd-message-box__flex {
  display: flex;
}

.wd-message-box__block {
  display: block;
}

.wd-message-box__cancel {
  margin-right: 16px;
}
</style>
