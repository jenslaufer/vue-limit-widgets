# @solytics/vue-limit-widgets

Vue 3 components for client-side usage limits. Works in browsers and browser extensions (Chrome/Firefox). State persists encrypted in `localStorage` or `chrome.storage.local`.

## Install

```bash
npm install @solytics/vue-limit-widgets
```

## Components

### `<Quota>`

Counts mounts. Renders `withinQuota` until the limit is reached, then switches to `exceededQuota`.

```vue
<script setup>
import { Quota } from '@solytics/vue-limit-widgets'
</script>

<template>
  <Quota :maxQuota="5">
    <template #withinQuota>
      <p>Free uses left.</p>
    </template>
    <template #exceededQuota>
      <p>Limit reached. Please upgrade.</p>
    </template>
  </Quota>
</template>
```

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `maxQuota` | `Number` | yes | — | Maximum number of uses |
| `quotaName` | `String` | no | `'quota'` | Storage key for the counter |
| `maxQuotaName` | `String` | no | `'maxQuota'` | Storage key for the limit |

---

### `<Expiry>`

Renders `withinExpiry` until the date passes, then switches to `exceededExpiry`. The expiry date is locked on first mount — passing a new value later has no effect.

```vue
<script setup>
import { Expiry } from '@solytics/vue-limit-widgets'
</script>

<template>
  <Expiry expiry="2025-12-31" expiryName="trialExpiry">
    <template #withinExpiry>
      <p>Trial active.</p>
    </template>
    <template #exceededExpiry>
      <p>Trial expired.</p>
    </template>
  </Expiry>
</template>
```

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `expiry` | `String` | yes | — | ISO date string (`YYYY-MM-DD`) |
| `expiryName` | `String` | no | `'expiry'` | Storage key for the date |

## Notes

- Storage values are encrypted to deter casual tampering. This is not a security boundary.
- Use unique `quotaName` / `expiryName` values when placing multiple instances on the same page.
