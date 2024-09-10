<template>
  <view class="h-screen overflow-hidden">
    <uni-segmented-control v-if="categories.length > 0" class="fixed top-0 left-0 right-0 w-full z-1 bg-white"
      :current="category" :values="cates" @clickItem="onClickItem" styleType="text" activeColor="#4cd964" />
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="h-screen overflow-auto border-box">
      <div class="h-10" v-if="categories.length > 0"></div>
      <Empty v-if="isEmpty" />
      <Loading v-else-if="status === 'loading' && list.length === 0" />
      <template v-else>
        <div v-for="item in list" :key="item.id" class="px-4 py-2">
          <Record :item="item" v-if="component === 'record'" />
        </div>
        <uni-load-more :status="status" />
      </template>
    </scroll-view>
  </view>
</template>

<script>
import Record from "./record.vue";
import Empty from "./empty.vue";
import Loading from "./loading.vue";

export default {
  components: { Record, Empty, Loading },
  props: {
    component: { type: String, default: "record" },
    pageSize: { type: Number, default: 20 },
    fetchFn: { type: Function },
    categories: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    cates() {
      return this.categories.map((item) => item.label);
    },
    choiceCategory() {
      return this.categories[this.choiceCategory]?.value;
    },
    isEmpty() {
      return this.status === "noMore" && this.list.length === 0;
    },
  },
  data() {
    return {
      page: 1,

      list: [],

      // more: loading前
      // loading: 加载中
      // noMore 没有更多了
      status: "more",

      category: 0,
    };
  },
  onLoad() {
    uni.startPullDownRefresh();
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (this.status === "noMore") {
        return;
      }
      try {
        this.status = "loading";
        const res = await this.fetchFn({
          page: this.page,
          size: this.pageSize,
          ...(this.choiceCategory ? { category: this.choiceCategory } : {}),
        });
        if (res.data.length < this.pageSize) {
          this.status = "noMore";
        } else {
          this.status = "more";
        }
        this.list = [...this.list, ...res.data];
      } catch (e) {
        this.status = "noMore";
      }
    },
    onClickItem(e) {
      if (this.category != e.currentIndex) {
        this.category = e.currentIndex;
        this.refetch();
      }
    },
    refetch() {
      this.list = [];
      this.page = 1;
      this.status = "loading";
      this.fetch();
    },
    loadMore() {
      if (this.status === "noMore") {
        return;
      }
      this.page += 1;
      this.fetch();
    },
  },
};
</script>

<style></style>
