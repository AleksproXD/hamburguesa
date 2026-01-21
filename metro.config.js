const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Agregar extensiones de assets para archivos 3D
config.resolver.assetExts.push('glb', 'gltf', 'obj', 'mtl');

module.exports = withNativeWind(config, { input: './global.css' });