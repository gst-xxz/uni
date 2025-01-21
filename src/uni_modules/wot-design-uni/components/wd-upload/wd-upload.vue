<template>
  <div :class="cn('wd-upload relative flex flex-wrap', customClass)" :style="customStyle">
    <!-- 预览列表 -->
    <div
      :class="cn('wd-upload__preview relative w-20 h-20 mt-0 mr-3 mb-3 ml-0', customPreviewClass)"
      v-for="(file, index) in uploadFiles"
      :key="index"
    >
      <!-- 成功时展示图片 -->
      <div class="wd-upload__status-content">
        <img
          v-if="isImage(file)"
          :src="file.url"
          :mode="imageMode"
          class="wd-upload__picture relative block w-full h-full"
          @click="onPreviewImage(file)"
        />
        <template v-else-if="isVideo(file)">
          <div
            class="wd-upload__video relative w-full h-full flex flex-col items-center justify-center bg-black/5"
            v-if="file.thumb"
            @click="onPreviewVideo(file)"
          >
            <img :src="file.thumb" :mode="imageMode" class="wd-upload__picture relative block w-full h-full" />
            <wd-icon
              name="play-circle-filled"
              custom-class="wd-upload__video-paly absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white before:bg-black/50 before:rounded-full"
            ></wd-icon>
          </div>
          <div
            v-else
            class="wd-upload__video relative w-full h-full flex flex-col items-center justify-center bg-black/5"
            @click="onPreviewVideo(file)"
          >
            <!-- #ifdef APP-PLUS || MP-DINGTALK -->
            <wd-icon custom-class="wd-upload__video-icon text-[22px]" name="video"></wd-icon>
            <!-- #endif -->
            <!-- #ifndef APP-PLUS -->
            <!-- #ifndef MP-DINGTALK -->
            <video
              :src="file.url"
              :title="file.name || '视频' + index"
              object-fit="contain"
              :controls="false"
              :poster="file.thumb"
              :autoplay="false"
              :show-center-play-btn="false"
              :show-fullscreen-btn="false"
              :show-play-btn="false"
              :show-loading="false"
              :show-progress="false"
              :show-mute-btn="false"
              :enable-progress-gesture="false"
              :enableNative="true"
              class="wd-upload__video relative w-full h-full flex flex-col items-center justify-center bg-black/5"
            ></video>
            <wd-icon
              name="play-circle-filled"
              custom-class="wd-upload__video-paly absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white before:bg-black/50 before:rounded-full"
            ></wd-icon>
            <!-- #endif -->
            <!-- #endif -->
          </div>
        </template>

        <div v-else class="wd-upload__file relative w-full h-full flex flex-col items-center justify-center bg-black/5" @click="onPreviewFile(file)">
          <wd-icon name="file" custom-class="wd-upload__file-icon text-[22px]"></wd-icon>
          <div
            class="wd-upload__file-name w-full text-xs text-[#595959] box-border py-0 px-1 text-center mt-2 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ file.name || file.url }}
          </div>
        </div>
      </div>

      <div
        v-if="file[props.statusKey] !== 'success'"
        class="wd-upload__mask absolute top-0 left-0 bg-black/60 wd-upload__status-content flex flex-col justify-center items-center w-full h-full"
      >
        <!-- loading时展示loading图标和进度 -->
        <div v-if="file[props.statusKey] === 'loading'" class="wd-upload__status-content flex flex-col justify-center items-center w-full h-full">
          <wd-loading :type="loadingType" :size="loadingSize" :color="loadingColor" />
          <span class="wd-upload__progress-txt text-sm leading-[1] mt-[9px] text-white">{{ file.percent }}%</span>
        </div>
        <!-- 失败时展示失败图标以及失败信息 -->
        <div v-if="file[props.statusKey] === 'fail'" class="wd-upload__status-content flex flex-col justify-center items-center w-full h-full">
          <wd-icon name="close-outline" custom-class="wd-upload__icon text-2x text-white"></wd-icon>
          <span class="wd-upload__progress-txt text-sm leading-[1] mt-[9px] text-white">{{ file.error || '上传失败' }}</span>
        </div>
      </div>
      <!-- 上传状态为上传中时不展示移除按钮 -->
      <wd-icon
        v-if="file[props.statusKey] !== 'loading' && !disabled"
        name="error-fill"
        custom-class="wd-upload__close absolute -right-2 -top-2 text-base leading-[1] z-[1] text-black/65 w-4 h-4 after:absolute after:w-full after:h-full after:rounded-full after:bg-white after:left-0 after:z-[-1]"
        @click="removeFile(index)"
      ></wd-icon>
      <!-- 自定义预览样式 -->
      <slot name="preview-cover" v-if="$slots['preview-cover']" :file="file" :index="index"></slot>
    </div>

    <block v-if="showUpload">
      <div :class="cn(['wd-upload__evoke-slot', customEvokeClass])" v-if="$slots.default" @click="handleChoose">
        <slot></slot>
      </div>
      <!-- 唤起项 -->
      <div
        v-else
        @click="handleChoose"
        :class="
          cn([
            'wd-upload__evoke relative inline-flex flex-col justify-center items-center w-20 h-20 text-[32px] bg-black/5 text-black/25 mb-3',
            disabled ? 'is-disabled text-black/10' : '',
            customEvokeClass
          ])
        "
      >
        <!-- 唤起项图标 -->
        <wd-icon class="wd-upload__evoke-icon w-8 h-8" name="fill-camera"></wd-icon>
        <!-- 有限制个数时确认是否展示限制个数 -->
        <div v-if="limit && showLimitNum" class="wd-upload__evoke-num text-sm leading-[1] mt-2">（{{ uploadFiles.length }}/{{ limit }}）</div>
      </div>
    </block>
  </div>
  <wd-video-preview ref="videoPreview"></wd-video-preview>
</template>

<script lang="ts">
export default {
  name: 'wd-upload',
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared'
  }
}
</script>

<script lang="ts" setup>
import wdVideoPreview from '../wd-video-preview/wd-video-preview.vue'

import { computed, ref, watch } from 'vue'
import { context, isEqual, isImageUrl, isVideoUrl, isFunction, isDef, deepClone, cn } from '../common/util'
import { chooseFile } from './utils'
import {
  uploadProps,
  type UploadFileItem,
  type ChooseFile,
  type UploadExpose,
  type UploadErrorEvent,
  type UploadChangeEvent,
  type UploadSuccessEvent,
  type UploadProgressEvent,
  type UploadOversizeEvent,
  type UploadRemoveEvent,
  type UploadMethod
} from './types'
import type { VideoPreviewInstance } from '../wd-video-preview/types'

const props = defineProps(uploadProps)

const emit = defineEmits<{
  (e: 'fail', value: UploadErrorEvent): void
  (e: 'change', value: UploadChangeEvent): void
  (e: 'success', value: UploadSuccessEvent): void
  (e: 'progress', value: UploadProgressEvent): void
  (e: 'oversize', value: UploadOversizeEvent): void
  (e: 'chooseerror', value: any): void
  (e: 'remove', value: UploadRemoveEvent): void
  (e: 'update:fileList', value: UploadFileItem[]): void
}>()

defineExpose<UploadExpose>({
  submit: () => startUploadFiles()
})

const uploadFiles = ref<UploadFileItem[]>([])

const showUpload = computed(() => !props.limit || uploadFiles.value.length < props.limit)

const videoPreview = ref<VideoPreviewInstance>()

watch(
  () => props.fileList,
  (val) => {
    const { statusKey } = props
    if (isEqual(val, uploadFiles.value)) return
    const uploadFileList: UploadFileItem[] = val.map((item) => {
      item[statusKey] = item[statusKey] || 'success'
      item.response = item.response || ''
      return { ...item, uid: context.id++ }
    })
    uploadFiles.value = uploadFileList
  },
  {
    deep: true,
    immediate: true
  }
)

function emitFileList() {
  emit('update:fileList', uploadFiles.value)
}

/**
 * 组件内部上传方法
 * @param file 文件
 * @param formData
 * @param options
 */
const upload: UploadMethod = (file, formData, options) => {
  const uploadTask = uni.uploadFile({
    url: options.action,
    header: options.header,
    name: options.name,
    fileName: options.name,
    fileType: options.fileType as 'image' | 'video' | 'audio',
    formData,
    filePath: file.url,
    success(res) {
      if (res.statusCode === options.statusCode) {
        // 上传成功进行文件列表拼接
        options.onSuccess(res, file, formData)
      } else {
        // 上传失败处理
        options.onError({ ...res, errMsg: res.errMsg || '' }, file, formData)
      }
    },
    fail(err) {
      // 上传失败处理
      options.onError(err, file, formData)
    }
  })
  // 获取当前文件加载的百分比
  uploadTask.onProgressUpdate((res) => {
    options.onProgress(res, file)
  })
}

const startUpload: UploadMethod = (file, formData, options) => {
  const { statusKey, uploadMethod } = props
  // 设置上传中，防止重复发起上传
  file[statusKey] = 'loading'
  if (isFunction(uploadMethod)) {
    uploadMethod(file, formData, options)
  } else {
    upload(file, formData, options)
  }
}

/**
 * 获取图片信息
 * @param img
 */
function getImageInfo(img: string) {
  return new Promise<UniApp.GetImageInfoSuccessData>((resolve, reject) => {
    uni.getImageInfo({
      src: img,
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * @description 初始化文件数据
 * @param {Object} file 上传的文件
 */
function initFile(file: ChooseFile, currentIndex?: number) {
  const { statusKey } = props
  // 状态初始化
  const initState: UploadFileItem = {
    uid: context.id++,
    // 仅h5支持 name
    name: file.name || '',
    thumb: file.thumb || '',
    [statusKey]: 'pending',
    size: file.size || 0,
    url: file.path,
    percent: 0
  }
  if (typeof currentIndex === 'number') {
    uploadFiles.value.splice(currentIndex, 1, initState)
  } else {
    uploadFiles.value.push(initState)
  }
  if (props.autoUpload) {
    startUploadFiles()
  }
}

/**
 *  开始上传文件
 */
function startUploadFiles() {
  const { buildFormData, formData = {}, statusKey } = props
  const { action, name, header = {}, accept, successStatus } = props
  const statusCode = isDef(successStatus) ? successStatus : 200

  for (const uploadFile of uploadFiles.value) {
    // 仅开始未上传的文件
    if (uploadFile[statusKey] == 'pending') {
      if (buildFormData) {
        buildFormData({
          file: uploadFile,
          formData,
          resolve: (formData: Record<string, any>) => {
            formData &&
              startUpload(uploadFile, formData, {
                onSuccess: handleSuccess,
                onError: handleError,
                onProgress: handleProgress,
                action,
                header,
                name,
                fileName: name,
                fileType: accept as 'image' | 'video' | 'audio',
                statusCode
              })
          }
        })
      } else {
        startUpload(uploadFile, formData, {
          onSuccess: handleSuccess,
          onError: handleError,
          onProgress: handleProgress,
          action,
          header,
          name,
          fileName: name,
          fileType: accept as 'image' | 'video' | 'audio',
          statusCode
        })
      }
    }
  }
}

/**
 * @description 上传失败捕获
 * @param {Object} err 错误返回信息
 * @param {Object} file 上传的文件
 */
function handleError(err: Record<string, any>, file: UploadFileItem, formData: Record<string, any>) {
  const { statusKey } = props
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index][statusKey] = 'fail'
    uploadFiles.value[index].error = err.message
    uploadFiles.value[index].response = err
    emit('fail', { error: err, file, formData })
    emitFileList()
  }
}

/**
 * @description 上传成功捕获
 * @param {Object} res 接口返回信息
 * @param {Object} file 上传的文件
 */
function handleSuccess(res: Record<string, any>, file: UploadFileItem, formData: Record<string, any>) {
  const { statusKey } = props
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index][statusKey] = 'success'
    uploadFiles.value[index].response = res.data
    emit('change', { fileList: uploadFiles.value })
    emit('success', { file, fileList: uploadFiles.value, formData })
    emitFileList()
  }
}

/**
 * @description 上传中捕获
 * @param {Object} res 接口返回信息
 * @param {Object} file 上传的文件
 */
function handleProgress(res: UniApp.OnProgressUpdateResult, file: UploadFileItem) {
  const index = uploadFiles.value.findIndex((item) => item.uid === file.uid)
  if (index > -1) {
    uploadFiles.value[index].percent = res.progress
    emit('progress', { response: res, file })
  }
}

/**
 * @description 选择文件的实际操作，将chooseFile自己用promise包了一层
 */
function onChooseFile(currentIndex?: number) {
  const { multiple, maxSize, accept, sizeType, limit, sourceType, compressed, maxDuration, camera, beforeUpload } = props
  // 文件选择
  chooseFile({
    multiple,
    sizeType,
    sourceType,
    maxCount: limit ? limit - uploadFiles.value.length : 9,
    accept,
    compressed,
    maxDuration,
    camera
  })
    .then((res) => {
      // 成功选择初始化file
      let files = res
      // 单选只有一个
      if (!multiple) {
        files = files.slice(0, 1)
      }
      // 遍历列表逐个初始化上传参数
      const mapFiles = async (files: ChooseFile[]) => {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (file.type === 'image' && !file.size) {
            const imageInfo = await getImageInfo(file.path)
            file.size = imageInfo.width * imageInfo.height
          }
          Number(file.size) <= maxSize ? initFile(file, currentIndex) : emit('oversize', { file })
        }
      }

      // 上传前的钩子
      if (beforeUpload) {
        beforeUpload({
          files,
          fileList: uploadFiles.value,
          resolve: (isPass: boolean) => {
            isPass && mapFiles(files)
          }
        })
      } else {
        mapFiles(files)
      }
    })
    .catch((error) => {
      emit('chooseerror', { error })
    })
}

/**
 * @description 选择文件，内置拦截选择操作
 */
function handleChoose(index?: number) {
  if (props.disabled) return
  const { beforeChoose } = props

  // 选择图片前的钩子
  if (beforeChoose) {
    beforeChoose({
      fileList: uploadFiles.value,
      resolve: (isPass: boolean) => {
        isPass && onChooseFile(index)
      }
    })
  } else {
    onChooseFile(index)
  }
}

/**
 * @description 移除文件
 * @param {Object} file 上传的文件
 * @param {Number} index 删除
 */
function handleRemove(file: UploadFileItem) {
  uploadFiles.value.splice(
    uploadFiles.value.findIndex((item) => item.uid === file.uid),
    1
  )
  emit('change', {
    fileList: uploadFiles.value
  })
  emit('remove', { file })
  emitFileList()
}

function removeFile(index: number) {
  const { beforeRemove } = props
  const intIndex: number = index
  const file = uploadFiles.value[intIndex]
  if (beforeRemove) {
    beforeRemove({
      file,
      index: intIndex,
      fileList: uploadFiles.value,
      resolve: (isPass: boolean) => {
        isPass && handleRemove(file)
      }
    })
  } else {
    handleRemove(file)
  }
}

/**
 * 预览文件
 * @param file
 */
function handlePreviewFile(file: UploadFileItem) {
  uni.openDocument({
    filePath: file.url,
    showMenu: true
  })
}

/**
 * 预览图片
 * @param index
 * @param lists
 */
function handlePreviewImage(index: number, lists: string[]) {
  const { onPreviewFail } = props
  uni.previewImage({
    urls: lists,
    current: lists[index],
    fail() {
      if (onPreviewFail) {
        onPreviewFail({
          index,
          imgList: lists
        })
      } else {
        uni.showToast({ title: '预览图片失败', icon: 'none' })
      }
    }
  })
}

/**
 * 预览视频
 * @param index
 * @param lists
 */
function handlePreviewVieo(index: number, lists: UploadFileItem[]) {
  const { onPreviewFail } = props
  // #ifdef MP-WEIXIN
  uni.previewMedia({
    current: index,
    sources: lists.map((file) => {
      return {
        url: file.url,
        type: 'video',
        poster: file.thumb
      }
    }),
    fail() {
      if (onPreviewFail) {
        onPreviewFail({
          index,
          imgList: []
        })
      } else {
        uni.showToast({ title: '预览视频失败', icon: 'none' })
      }
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  videoPreview.value?.open({ url: lists[index].url, poster: lists[index].thumb, title: lists[index].name })
  // #endif
}

function onPreviewImage(file: UploadFileItem) {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)
  const imgList = fileList.filter((file) => isImage(file)).map((file) => file.url)
  const imgIndex: number = imgList.findIndex((item) => item === file.url)
  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        fileList: fileList,
        imgList: imgList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewImage(imgIndex, imgList)
        }
      })
    } else {
      handlePreviewImage(imgIndex, imgList)
    }
  }
}

function onPreviewVideo(file: UploadFileItem) {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)
  const videoList = fileList.filter((file) => isVideo(file))
  const videoIndex: number = videoList.findIndex((item) => item.url === file.url)
  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        imgList: [],
        fileList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewVieo(videoIndex, videoList)
        }
      })
    } else {
      handlePreviewVieo(videoIndex, videoList)
    }
  }
}

function onPreviewFile(file: UploadFileItem) {
  const { beforePreview, reupload } = props
  const fileList = deepClone(uploadFiles.value)
  const index: number = fileList.findIndex((item) => item.url === file.url)
  if (reupload) {
    handleChoose(index)
  } else {
    if (beforePreview) {
      beforePreview({
        file,
        index,
        imgList: [],
        fileList,
        resolve: (isPass: boolean) => {
          isPass && handlePreviewFile(file)
        }
      })
    } else {
      handlePreviewFile(file)
    }
  }
}

function isVideo(file: UploadFileItem) {
  return (file.name && isVideoUrl(file.name)) || isVideoUrl(file.url)
}

function isImage(file: UploadFileItem) {
  return (file.name && isImageUrl(file.name)) || isImageUrl(file.url)
}
</script>
