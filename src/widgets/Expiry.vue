<template>
    <template v-if="loaded">
        <slot name="withinExpiry" v-if="now <= expiryRef" />
        <slot name="exceededExpiry" v-else />
    </template>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { getExpiry, saveExpiry } from '../expiry.js'

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

watch(() => props.expiry, async (newValue) => {
    expiryRef.value = new Date(newValue)
    await saveExpiry(props.expiryName, newValue)
})

onMounted(async () => {
    const savedExpiry = await getExpiry(props.expiryName);
    if (savedExpiry) {
        expiryRef.value = new Date(savedExpiry);
    } else {
        expiryRef.value = new Date(props.expiry);
        await saveExpiry(props.expiryName, props.expiry);
    }
    now.value = new Date()
    loaded.value = true
    timer = setInterval(() => { now.value = new Date() }, 3_600_000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>