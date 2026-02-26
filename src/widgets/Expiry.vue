<template>
    <slot name="withinExpiry" v-if="now <= expiryRef" />
    <slot name="exceededExpiry" v-else />
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { getExpiry, saveExpiry } from '../expiry.js'

const props = defineProps({
    expiry: {
        type: String
    },
    expiryName: {
        type: String,
        default: 'expiry'
    }
})

const expiryRef = ref(new Date())
const now = ref(new Date());

watch(() => props.expiry, async (newValue) => {
    expiryRef.value = new Date(newValue)
    await saveExpiry(props.expiryName, newValue)
})

onMounted(async () => {
    console.log("Expiry", props.expiry);
    const savedExpiry = await getExpiry(props.expiryName);
    if (savedExpiry) {
        console.log("Using saved expiry:", savedExpiry);
        expiryRef.value = new Date(savedExpiry);
    } else {
        console.log("Using initial expiry:", props.expiry);
        expiryRef.value = new Date(props.expiry);
        await saveExpiry(props.expiryName, props.expiry);
    }
})
</script>