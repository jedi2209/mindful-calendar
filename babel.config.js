module.exports = {
  presets: [
    ['react-app', { flow: false, typescript: true }]
  ],
  env: {
    production: {
      plugins: [
        ["transform-remove-console", { "exclude": ["error", "warn"] }]
      ]
    }
  }
}; 