import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl()],
  resolve: {
    alias: {
      'cesium': fileURLToPath(new URL('./public/gs3d/lib/CesiumChanged/index.js', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "@assets": "./src/assets",
      "@router": "/src/router",
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // '@import "assets/scss/globalVar.scss";@import "assets/scss/globalMixin.scss";'
        additionalData:
          '@import "@/assets/scss/globalVar.scss";@import "@/assets/scss/globalMixin.scss";',
      },
    },
  },
  define: {
    // 模块化使用cesium时，需配置全局变量CESIUM_BASE_URL指向cesium包的四大资源文件夹
    CESIUM_BASE_URL: "'./gs3d/lib/CesiumChanged'",
  },
  server:{
    proxy:{
      "/people-locate":{
        target:'http://10.253.11.103:9999/',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/people-locate/,'')
      }
    }
  }
})
