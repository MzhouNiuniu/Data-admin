const path = require('path');
const PROJECT_ROOT = process.cwd();
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(PROJECT_ROOT, './src'),
      '@constant': path.resolve(PROJECT_ROOT, './src/constant'),
      '@public': path.resolve(PROJECT_ROOT, './public'),
      '@components': path.resolve(PROJECT_ROOT, './src/components'),
      '@pages': path.resolve(PROJECT_ROOT, './src/pages'),
      '@services': path.resolve(PROJECT_ROOT, './src/services'),
      '@utils': path.resolve(PROJECT_ROOT, './src/utils'),
    },
  },
};

/**
 * idea使用说明
 * setting->搜索webpack->选择此文件
 * */
