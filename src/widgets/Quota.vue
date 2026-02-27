<template>
    <template v-if="loaded">
        <slot name="withinQuota" v-if="quotaUsed <= maxQuotaRef" />
        <slot name="exceededQuota" v-else />
    </template>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { incrementQuotaUsed, getMaxQuota, saveMaxQuota } from '../quota.js'

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
const loaded = ref(false)

const initializeMaxQuota = async (maxQuotaName) => {
    const savedMaxQuota = await getMaxQuota(maxQuotaName)
    const resolvedMaxQuota = Number(savedMaxQuota ?? props.maxQuota)

    if (savedMaxQuota === null) {
        await saveMaxQuota(maxQuotaName, resolvedMaxQuota)
    }

    maxQuotaRef.value = resolvedMaxQuota
}

const initializeQuotaUsed = async (quotaName) => {
    quotaUsed.value = await incrementQuotaUsed(quotaName, maxQuotaRef.value)
}

watch(() => props.maxQuota, async (newValue) => {
    const normalized = Number(newValue)
    maxQuotaRef.value = normalized
    await saveMaxQuota(props.maxQuotaName, normalized)
})

watch(() => props.maxQuotaName, async (newName) => {
    await initializeMaxQuota(newName)
})

watch(() => props.quotaName, async (newName) => {
    await initializeQuotaUsed(newName)
})

onMounted(async () => {
    await initializeMaxQuota(props.maxQuotaName)
    await initializeQuotaUsed(props.quotaName)
    loaded.value = true
})

</script>
