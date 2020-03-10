const HtmlWebpackPlugin = require('html-webpack-plugin'); //the same like import only for node
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}) => { // empty configuration the same like export node.js

    const { mode = 'development' } = env;

    const isProd = mode === 'production';
    const isDev = mode === 'development';

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
        ]
    }

    return {
        mode: isProd ? 'production': isDev && 'development', // or production

        output: {
            filename: isProd ? 'main-[hash:8].js' : undefined
        },
        module: {
            rules: [ //collections rules how work with modules
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/, // isn't passing through node_modules
                    loader: 'babel-loader' //if loader is one we can not use -use- for this.. shortcut
                    
                },
                // Loading images
                {
                    test: /\.(png|jpg|gif|ico|jpeg)$/, //only those files with which we need work
                    use: [
                        { 
                            loader: 'file-loader', //loader for change names files in order to it works without conflict
                            options: {
                                outputPath: 'images', //all images in this chapter, create automatically
                                name: '[name]-[sha1:hash:7].[ext]'
                            }  
                        }
                    ] 
                },
                // Loading fonts
                {
                    test: /\.(ttf|btf|eot|woff|woff2)$/, //only those files with which we need work
                    use: [
                        { 
                            loader: 'file-loader', //loader for change names files in order to it works without conflict
                            options: {
                                outputPath: 'fonts', //all images in this chapter, create automatically
                                name: '[name].[ext]'
                            }  
                        }
                    ] 
                },
                //Loading CSS
                {
                    test: /\.(css)$/,
                    use: getStyleLoaders()//[ MiniCssExtractPlugin.loader, 'css-loader' ] //we can use this record instade of -loader- shortcut 
                },
                //Loading SASS/SCSS
                {
                    test: /\.(s[ca]ss)$/, //one of them letter
                    use: [
                        {loader: 'style-loader'}, //scope loaders
                        {loader: 'css-loader'}, //from this file to another file which above second loader
                        //works as function in react 'compose' from starting it'll be css-loader then next
                        //if we exchange files on the contrary it'll be mistake
                        {loader: 'sass-loader'} //do it first and give away another loader above
                    ]
                }
            ]
        },
        plugins: [
            new BundleAnalyzerPlugin(),
            new HtmlWebpackPlugin({ //in order to work with our index.html
                title: 'Validation Form', //in order to exchange title in html-file
                template: 'public/index.html'
            }),
            new MiniCssExtractPlugin({ //for prodaction build
                filename: 'main-[hash:8].css'
            }) //now we don't needta use loaders for css
        ],
        devServer: {
            open: true
        }
    }
   
};