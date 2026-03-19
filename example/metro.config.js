const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const libraryRoot = path.resolve(__dirname, '..');
const exampleNodeModules = path.resolve(__dirname, 'node_modules');

const sharedDeps = [
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-gesture-handler',
  'react-native-worklets',
  '@shopify/react-native-skia',
];

const extraNodeModules = sharedDeps.reduce((acc, dep) => {
  acc[dep] = path.resolve(exampleNodeModules, dep);
  return acc;
}, {
  'react-native-kline-chart': path.resolve(libraryRoot, 'src'),
});

const config = {
  watchFolders: [libraryRoot],
  resolver: {
    nodeModulesPaths: [exampleNodeModules],
    extraNodeModules,
    blockList: [
      new RegExp(
        path.resolve(libraryRoot, 'node_modules').replace(/[/\\]/g, '[/\\\\]') + '[/\\\\].*',
      ),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
