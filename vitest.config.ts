/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

const updatedConfig = defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: [
			...configDefaults.exclude,
			'**/node_modules/**',
			'node_modules/**',
			'node_modules',
			'**/node_modules',
			'/node_modules',
			'**/build/**',
			'build/**',
			'build',
			'**/build',
			'/build',
		],
	},
});

export default updatedConfig;