module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    "semi": ["off"],//语句强制分号结尾
    'generator-star-spacing': 0,
    'eqeqeq': 0, // 剔除必须使用全等
    "handle-callback-err": [2, "^(err|error|anySpecificError)$" ],
    'space-before-function-paren': [0, 'always'], // 函数定义时括号前面要不要有空格
    "indent": [0, 2, { "SwitchCase": 2 }],
    //"SwitchCase" (默认：0) 强制 switch 语句中的 case 子句的缩进水平
    // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
