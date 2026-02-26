import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'VueLimitWidgets',
            fileName: (format) => `vue-limit-widgets.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            }
        },
    },
})
