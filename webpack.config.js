const path = require("path");

module.exports = (env, argv) => ({
    entry: "./src/index.ts",
    output: {
        filename: "payva-sdk.js",
        path: path.resolve(__dirname, "dist"),
        library: {
            name: "Payva",
            type: "umd",
            export: "default"
        },
        globalObject: "typeof self !== 'undefined' ? self : this" // ✅ Fixes UMD issues
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    mode: argv.mode || "development",
    optimization: {
        minimize: argv.mode === "production" // ✅ Minify only in production
    },
    devtool: argv.mode === "production" ? false : "source-map" // ✅ Debugging support in development
});