<template>
    <template v-if="loaded">
        <slot name="withinExpiry" v-if="now <= expiryRef" />
        <slot name="exceededExpiry" v-else />
    </template>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { saveExpiry } from '../expiry.js'

const props = defineProps({
    expiry: {
        type: String,
        required: true
    },
    expiryName: {
        type: String,
        default: 'expiry'
    }
})

const expiryRef = ref(new Date())
const now = ref(new Date())
const loaded = ref(false)

let timer = null

watch(() => [props.expiry, props.expiryName], async ([newExpiry, newName]) => {
    expiryRef.value = new Date(newExpiry)
    await saveExpiry(newName, newExpiry)
}, { immediate: true })

onMounted(() => {
    now.value = new Date()
    loaded.value = true
    timer = setInterval(() => { now.value = new Date() }, 60_000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>
