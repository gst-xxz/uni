<template>
  <view class="flex flex-col gap-y-2 p-3" :class="customClass">
    <slot name="item" :item="item" v-for="item in data" :key="item[keyField as 'id']" />
    <wd-loadmore :state="loadMoreState" v-if="showLoadMore" :finished-text="textMap.finished"
      :loading-text="textMap.loading" custom-class="mt-4" />
    <wd-status-tip image="content" :tip="textMap.empty || '暂无数据'" v-if="status === 'noMore' && data.length === 0" />
  </view>
</template>

<script lang="ts">
import type { LoadMoreState } from '@/uni_modules/wot-design-uni/components/wd-loadmore/types';

export default {
  name: 'pro-list',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared'
  },
  props: {
    paramsMap: {
      type: Object, default: () => ({
        page: 'page',
        pageSize: 'pageSize'
      })
    },
    // 列表项的唯一标识字段
    keyField: { type: String, default: 'id' },
    // 额外的参数
    extraParms: { type: Object, default: () => ({}) },
    // 列表的类名
    customClass: { type: String, default: '' },
    // 请求方法
    api: { type: Function },
    // 一页页数
    pageSize: { type: Number, default: 10 },
    // 是否分页
    isPage: { type: Boolean, default: true },
    // 加载更多文字
    textMap: { type: Object, default: () => ({ loading: '加载中...', finished: '没有更多了', empty: '暂无数据' }) }
  },
  data() {
    return {
      // 页码
      page: 1,

      // 数据
      data: [] as any[],

      /**
       * 状态
       * default: 默认状态
       * loading: 加载中
       * noMore: 没有更多
       */
      status: 'default',

      // 是否初始化
      isInit: false
    }
  },
  methods: {
    async fetch() {
      if (!this.api) {
        this.status = 'noMore'
        return
      }
      if (this.status !== 'default') {
        return
      }

      this.status = 'loading'
      try {
        const { paramsMap } = this

        const params = {
          ...this.extraParms,
        }

        if (this.isPage) {
          params[paramsMap.page ?? 'page'] = this.page
          params[paramsMap.pageSize ?? 'pageSize'] = this.pageSize
        }

        const res = await this.api(params)

        this.data = [...this.data, ...res.data]

        if (!this.isPage) {
          this.status = 'noMore'
        } else if (!res.data || res.data.length < this.pageSize) {
          this.status = 'noMore'
        } else {
          this.status = 'default'
        }
      } catch (e) {
        this.status = 'noMore'
      }
    },
    loadMore() {
      if (this.status !== 'default') {
        return
      }
      this.page += 1
      this.fetch()
    },
    refresh() {
      if (!this.isInit) {
        return
      }

      this.page = 1
      this.status = 'default'
      this.data = []
      this.fetch()
    },
  },
  computed: {
    loadMoreState(): LoadMoreState {
      if (this.status === 'loading') {
        return 'loading'
      }
      if (this.status === 'noMore') {
        return 'finished'
      }
      return 'error'
    },
    showLoadMore() {
      if (this.status === 'loading') {
        return true
      }

      if (this.status === 'noMore' && this.data.length > 0) {
        return true
      }

      return false
    }
  },
  watch: {
    extraParms: {
      handler() {
        this.isInit = true

        this.refresh()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
