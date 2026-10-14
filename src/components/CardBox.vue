<script setup>
import { computed, useSlots, provide, inject } from 'vue'
import CardBoxComponentBody from '@/components/CardBoxComponentBody.vue'
import CardBoxComponentFooter from '@/components/CardBoxComponentFooter.vue'

const props = defineProps({
  rounded: {
    type: String,
    default: 'rounded',
  },
  flex: {
    type: String,
    default: 'flex-col',
  },
  hasComponentLayout: Boolean,
  hasTable: Boolean,
  isForm: Boolean,
  isHoverable: Boolean,
  isModal: Boolean,
})

const emit = defineEmits(['submit'])

const slots = useSlots()

const nestingDepth = inject('cardBoxDepth', 0)

provide('cardBoxDepth', nestingDepth + 1)

const backgroundClass = computed(() => {
  if (nestingDepth >= 3) return 'bg-slate-50/90'
  if (nestingDepth === 2) return 'bg-slate-100/90'
  if (nestingDepth === 1) return 'bg-slate-200/90'
  return 'bg-slate-300'
})

const hasFooterSlot = computed(() => slots.footer && !!slots.footer())

const componentClass = computed(() => {
  const base = [
    props.rounded,
    props.flex,
    props.isModal ? ' dark:bg-slate-900' : 'dark:bg-slate-900/70',
  ]

  if (props.isHoverable) {
    base.push('hover:shadow-lg transition-shadow duration-500')
  }

  return base
})

const submit = (event) => {
  emit('submit', event)
}
</script>

<template>
  <component
    :is="isForm ? 'form' : 'div'"
    :class="[componentClass, backgroundClass]"
    class="flex shadow-md shadow-black"
    @submit="submit"
  >
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody :no-padding="hasTable">
        <slot />
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>
