module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  publicPath: process.env.NODE_ENV === 'production'
      ? '/XIUtilsEquipCalculator/'
      : '/',
  pwa: {
    name: 'XI EquipSet Simulator',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
