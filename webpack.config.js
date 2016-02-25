
var webpack =require('webpack');
var path = require('path');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendor.js');
var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
});

console.log('__dirname', __dirname);

module.exports = {
    entry: {
        main: './assets/js/task.js',
        vendor: ['jquery']
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'jquery': __dirname + "/node_modules/jquery/dist/jquery.min.js"
        }
    },
    plugins: [commonsPlugin, providePlugin]
};
