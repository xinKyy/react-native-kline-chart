const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const libraryRoot = path.resolve(__dirname, '..');

const config = {
  watchFolders: [libraryRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(libraryRoot, 'node_modules'),
    ],
    extraNodeModules: {
      'react-native-kline-chart': path.resolve(libraryRoot, 'src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
