// eslint-disable-next-line no-undef
module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        babelOptions: {
            presets: ["@babel/preset-react"]
         },
    },
    plugins: ['react'],
    env: {
        es6: true,
        browser: true,
    },
    rules: {
        'no-console': 2,
        'react-hooks/exhaustive-deps': 0,
    }
}
