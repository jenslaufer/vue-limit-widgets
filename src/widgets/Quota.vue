<template>
    <slot name="withinQuota" v-if="quotaUsed <= maxQuotaRef" />
    <slot name="exceededQuota" v-else />
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { getQuotaUsed, saveQuotaUsed, getMaxQuota, saveMaxQuota } from '../quota.js'

const props = defineProps({
    quotaName: {
        type: String,
        default: 'quota'
    },
    maxQuotaName: {
        type: String,
        default: 'maxQuota'
    },
    maxQuota: {
        type: Number,
        required: true
    }
})

const quotaUsed = ref(0)
const maxQuotaRef = ref(0)

const initializeMaxQuota = async () => {
    const savedMaxQuota = await getMaxQuota(props.maxQuotaName)
    const maxQuota = savedMaxQuota ?? props.maxQuota

    if (savedMaxQuota === null) {
        await saveMaxQuota(props.maxQuotaName, props.maxQuota)
    }

    maxQuotaRef.value = maxQuota
}

const initializeQuotaUsed = async () => {
    const currentQuotaUsed = await getQuotaUsed(props.quotaName) ?? 0
    const newQuotaUsed = Number(currentQuotaUsed) <= maxQuotaRef.value
        ? Number(currentQuotaUsed) + 1
        : Number(currentQuotaUsed)

    await saveQuotaUsed(props.quotaName, newQuotaUsed)
    quotaUsed.value = newQuotaUsed
}

watch(() => props.maxQuota, async (newValue) => {
    maxQuotaRef.value = newValue
    await saveMaxQuota(props.maxQuotaName, newValue)
})

onMounted(async () => {
    await initializeMaxQuota()
    await initializeQuotaUsed()
})

</script>