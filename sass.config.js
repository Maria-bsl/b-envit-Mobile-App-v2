// cross verify with node_modules/@ionic/app-scripts/config/sass.config.js

module.exports = {
  /**
   * includePaths: Used by node-sass for additional
   * paths to search for sass imports by just name.
   */
  includePaths: [
    "node_modules/ionic-angular/themes",
    "node_modules/ionicons/dist/scss",
    "node_modules/ionic-angular/fonts",

    "src/styles.scss",
  ],
  includeFiles: [/\.(s?(c|a)ss)$/i],

  excludeFiles: [
    // /\.(wp|ios|md).(scss)$/i
  ],
};
