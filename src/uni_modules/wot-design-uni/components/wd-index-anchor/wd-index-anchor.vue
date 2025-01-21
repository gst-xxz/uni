<template>
  <div
    :class="cn(`wd-index-anchor p-2.5 text-sm text-black bg-gray-2`, isSticky ? 'is-sticky sticky top-0 left-0 z-[1]' : '', customClass)"
    :style="customStyle"
    :id="indexAnchorId"
  >
    <slot>
      {{ index }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { indexAnchorProps } from './type'
import { onMounted, getCurrentInstance, ref, computed } from 'vue'
import { indexBarInjectionKey } from '../wd-index-bar/type'
import { cn, getRect, isDef, uuid } from '../common/util'
import { useParent } from '../composables/useParent'

const props = defineProps(indexAnchorProps)

const { parent: indexBar } = useParent(indexBarInjectionKey)

const indexAnchorId = ref<string>(`indexBar${uuid()}`)

const { proxy } = getCurrentInstance()!

const top = ref<number>(0)

const isSticky = computed(() => {
  return indexBar && indexBar.props.sticky && indexBar.anchorState.activeIndex === props.index
})

function getInfo() {
  getRect(`#${indexAnchorId.value}`, false, proxy).then((res) => {
    if (isDef(indexBar)) {
      top.value = Math.floor(res.top!)
    }
  })
}

onMounted(() => {
  getInfo()
})

defineExpose({
  top
})
</script>
