import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// https://vitejs.dev/config/

// Cesium导入
import cesium from 'vite-plugin-cesium';

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'@': pathResolve('./src'),
};

export default defineConfig({
  plugins: [
	vue(),
	cesium(),
],
  resolve: {
	// 配置路径别名
	alias,
},
})
