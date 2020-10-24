module.exports = {
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true,
    "browser": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "globals": {
    "google": "readonly"
  },
  "rules": {
    "semi": ["error", "never"],
    "indent": ["error", 2]
  }
}
