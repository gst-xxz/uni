class CreateStorage {
  constructor(private prefix: string) {
    this.prefix = prefix
  }
  get() {
    return uni.getStorageSync(this.prefix)
  }

  set(value: any) {
    uni.setStorageSync(this.prefix, value)
  }

  remove() {
    uni.removeStorageSync(this.prefix)
  }
}

export default CreateStorage
