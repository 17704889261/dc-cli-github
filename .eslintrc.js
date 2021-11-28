module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-use-before-define': 0,
        'no-console': 0,
        'no-throw-literal': 0,
    },
};
