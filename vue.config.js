const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    publicPath: "/",
    devServer: {
        port: 8080,
        //
        // proxy: {
        //     "/api": {
        //         target: "https://editor.yandage.top",
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     },
        // }
    },
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin()
        ]
    },
}
