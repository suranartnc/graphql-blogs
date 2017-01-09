module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    extends: [
      'standard'
    ],
    plugins: [],
    'rules': {
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
}
