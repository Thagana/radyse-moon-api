/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

const updatedConfig = defineConfig({
	test: {
		include: ['test/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
		exclude: [
			...configDefaults.exclude,
			'**/packages/**',
			'packages/**',
			'packages',
			'**/packages',
			'/packages',
		],
	},
});

export default updatedConfig;