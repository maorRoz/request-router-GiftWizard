module.exports = {
    "parser": "babel-eslint",
    "plugins": [
      "babel",
      "react",
      "promise"
    ],
    "extends": [
        "standard",
        "airbnb-base",
        "standard-react"
      ],
      "rules": {
        "semi"                 : [1, "always"],
        "key-spacing"          : 0,
        "keyword-spacing"      : [0, { "before": false }],
        "space-before-blocks"  : [0, "never"],
        "spaced-comment"       : 0,
        "jsx-quotes"           : [1, "prefer-single"],
        "max-len"              : [1, 120, 2],
        "object-curly-spacing" : [1, "always"],
        "no-unmodified-loop-condition": ["off"],
        "import/no-extraneous-dependencies": 0,
        "import/no-named-as-default" : 0,
        "import/no-named-as-default-member" : 0,
        "consistent-return":"off",
        "linebreak-style": 0,
        "no-underscore-dangle":"off",
        "no-param-reassign":"off",
        "no-mixed-operators":"warn",
        "no-restricted-syntax":"warn",
        "no-restricted-properties":"warn",
        "guard-for-in":"warn",
        "comma-dangle": ["error", "never"],
        "no-confusing-arrow":"off",
        "import/no-unresolved": [2, { "commonjs": true, "amd": true, "caseSensitive":false }],
        "one-var": "off",
        "no-undef": "off",    
        "no-console": "error",
        "react/prop-types": "off",
        "react/jsx-tag-spacing": [0,"never"],
        "react/jsx-indent-props": [0,"never"],
        "react/jsx-space-before-closing": [0,"never"]
        
      }
}