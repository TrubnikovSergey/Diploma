module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["plugin:react/recommended", "standard"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 13,
        sourceType: "module"
    },
    plugins: ["react"],
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        "space-before-function-paren": [
            "error",
            { anonymous: "always", named: "never" }
        ],
        "no-unused-vars": "off",
        quotes: 0,
        "multiline-ternary": ["off"],
        semi: 0
    }
}
