import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // 指定页面文件直接存放在根目录
  srcDir: '.',
});
