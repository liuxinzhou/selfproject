/**
 *
 * 相对于该配置的nginx服务器请参考nginx配置文件
 *
 * @刘新洲 {{publicPath: string, outputDir: string, assetsDir: string, devServer: {port: number}}}
 */
module.exports = {
  // 默认选择'/'
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
  // 这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: './static',
  devServer: {
    port: 10081

  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      return {
        performance: {
          hints: 'warning',
          // 入口起点的最大体积
          maxEntrypointSize: 50000000,
          // 生成文件的最大体积
          maxAssetSize: 30000000,
          // 只给出 js 文件的性能提示
          assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
          }
        }
      };
    } else {
      return {
        // 设置项目编译调试
        devtool: 'cheap-module-source-map'
      };
    }
  }
};
