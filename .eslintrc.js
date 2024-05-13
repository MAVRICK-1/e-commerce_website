// eslint-disable-next-line no-undef
module.exports = {
    settings: {
        react: {
            version: "detect",
        },
    },
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
        'no-console': 0, // Disable console error
        'no-undef': 0, // Disable no-undef error
        'react-hooks/exhaustive-deps': 0,
        'no-unused-vars': 0,
        'react/jsx-key':0,
        'no-useless-escape' :0,
        'react/prop-types':0,
        'react/no-unescaped-entities':0,
        'react/no-unknown-property':0,
    }
}
