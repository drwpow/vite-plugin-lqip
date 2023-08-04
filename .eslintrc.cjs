/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		project: './tsconfig.json',
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/strict', 'prettier', 'plugin:prettier/recommended'],
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'off', // handled by TS
	},
};
