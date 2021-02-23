const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    publicPath: "/",
    devServer: {
        port: 8080,
    },
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin()
        ]
    }
}
