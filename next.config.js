/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: false,
  reactStrictMode: true,
  webpack(config, { isServer, dev }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }

    // 在开发环境中输出更详细的错误信息
    if (dev) {
      console.log('Running in development mode');
    }

    // 在服务器端构建时的特定配置
    if (isServer) {
      console.log('Building for server-side');
    }

    return config
  }
}
