module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-prefix-selector')({
      prefix: 'kit-',
      // transform (prefix, selector,) {
      //   return prefix + selector
      // }
    }),
    require('autoprefixer')
  ]
}