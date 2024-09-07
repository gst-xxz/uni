export class Storage {
  constructor(key) {
    this.key = key;
  }

  set(data) {
    uni.setStorageSync(this.key, JSON.stringify({ data }));
  }

  get() {
    try {
      const res = uni.getStorageSync(this.key);
      return JSON.parse(res).data;
    } catch (e) {
      return undefined;
    }
  }
}

// uni.showToast()

const request = () => {};

export const goBack = (url) => {
  const pages = getCurrentPages();

  for (let i = pages.length - 1; i > 0; i -= 1) {
    const page = pages[i];
    if (page.route === url) {
      uni.navigateBack({ delta: pages.length - 1 - i });
      return;
    }
  }

  uni.redirectTo({ url });
};
