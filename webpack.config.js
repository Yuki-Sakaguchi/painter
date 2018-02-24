var webpack = require('webpack');

module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './src/ts/main.ts',

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/build`,
    // 出力ファイル名
    filename: 'bundle.js'
  },

  // モジュール
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: 'awesome-typescript-loader'
      },
      // ソースマップファイルの処理
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },

  // 解決
  resolve: {
    // import 文で .ts ファイルを解決するため
    extensions: [
      '.ts', '.js', '.json'
    ],

    // Vueをインポートするため
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
  },

  // ソースマップを有効に
  devtool: 'source-map',

  // プラグイン
  plugins: [
    new webpack.ProvidePlugin({
      // jQueryをファイルにロードするため
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};
