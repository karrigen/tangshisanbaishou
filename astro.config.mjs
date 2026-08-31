import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // srcDir 不再需要覆盖，默认就是 './src'
});
