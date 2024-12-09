import { ref } from 'vue'

const isDark = ref<boolean>(false)

function setDark(dark: boolean) {
  isDark.value = dark
  // #ifdef H5
  process.env.NODE_ENV === 'development' && uni.setStorageSync('isDark', dark)
  // #endif
  // #ifndef H5
  uni.setStorageSync('isDark', dark)
  // #endif
}

export function useDark() {
  setDark(Boolean(uni.getStorageSync('isDark')))
  return { isDark, setDark }
}
