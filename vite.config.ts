/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // sw.ts를 직접 작성한다 (6-1에서 푸시 수신·알림 클릭 처리를 더하기 때문)
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      manifest: {
        name: '동네냠냠',
        short_name: '동네냠냠',
        description: '가게의 빈 시간과 동네 주민의 여유 시간을 잇는 월계1동 실시간 딜',
        lang: 'ko',
        start_url: '/',
        display: 'standalone',
        // manifest는 CSS 토큰을 쓸 수 없어 index.css의 --color-cream·--color-accent 값을 그대로 적는다
        background_color: '#FBF7F2',
        theme_color: '#C61747',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    // tsconfig.app.json의 paths와 같은 값. 한쪽만 바꾸면 에디터와 빌드 결과가 달라진다
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { environment: 'node' },
});
