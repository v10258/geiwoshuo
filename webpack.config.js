
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
        main: './assets/js/detail.js',
        vendor: ['jquery']
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'bootstrap': __dirname + '/vendor/bootstrap/dist/js/bootstrap.js',
            'jquery': __dirname + "/vendor/jquery/dist/jquery.js"
        }
    },
    plugins: [commonsPlugin, providePlugin]
};
