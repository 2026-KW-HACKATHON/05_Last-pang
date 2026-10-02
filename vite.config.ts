/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// tailwind는 chore/setup-tailwind, VitePWA는 feat/pwa-manifest에서 추가한다(설치 전에 import하면 빌드가 깨진다).
export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig.app.json의 paths와 같은 값. 한쪽만 바꾸면 에디터와 빌드 결과가 달라진다
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { environment: 'node' },
});
