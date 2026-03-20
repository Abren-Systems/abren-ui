import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      // ── TypeScript Strictness ─────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // ── Vue Best Practices ────────────────────────────
      'vue/multi-word-component-names': 'off',            // Allow single-word like App.vue
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits'],
      }],

      // ── Module Boundary Enforcement ───────────────────
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/modules/*/stores/*'],
            message: 'Do not import stores from other modules. Use the Event Bus for cross-module communication.',
          },
        ],
      }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.d.ts'],
  },
)
