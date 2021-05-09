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
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      start_url: '/XIUtilsEquipCalculator/' // The default vue pwa plugin uses '.'. Also many examples on line show '/index.html'. Either of these will
      // result in a blank screen when installed on iOS or Android, but they will work fine on a PC. The '/' must also be included
      // in the router. This will meet the requirements of a good start_url and it will install and display correctly on the devices.
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      cleanupOutdatedCaches: true // cleans up cache that is outdated because of a previous version of Workbox.
    }
  }
}
