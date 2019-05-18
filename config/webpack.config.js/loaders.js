const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('../paths');

const cssRegex = [/\.css$/, /\.scss$/];
// const cssModuleRegex = /\.module\.css$/;

const babelLoader = {
    test: /\.(js|jsx|ts|tsx|mjs)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: process.env.NODE_ENV === 'production',
        compact: process.env.NODE_ENV === 'production',
    },
};

const sassLoaders = [
    {
        loader: require.resolve('sass-loader'),
    },
    {
        loader: require.resolve('sass-resources-loader'),
        options: {
            resources: paths.sassResources,
        },
    },
];

const cssModuleLoaderClient = {
    test: cssRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                camelCase: true,
                modules: true,
                importLoaders: 1,
                sourceMap: generateSourceMap,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        ...sassLoaders,
    ],
};

// const cssLoaderClient = {
//     test: cssRegex,
//     exclude: cssModuleRegex,
//     use: [
//         require.resolve('css-hot-loader'),
//         MiniCssExtractPlugin.loader,
//         require.resolve('css-loader'),
//         {
//             loader: require.resolve('postcss-loader'),
//             options: {
//                 sourceMap: generateSourceMap,
//             },
//         },
//     ],
// };

const cssModuleLoaderServer = {
    test: cssRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                exportOnlyLocals: true,
                camelCase: true,
                importLoaders: 1,
                modules: true,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        ...sassLoaders,
    ],
};

// const cssLoaderServer = {
//     test: cssRegex,
//     exclude: cssModuleRegex,
//     use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
// };

const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
};

const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile: false,
    },
};

const fileLoaderClient = {
    exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
};

const fileLoaderServer = {
    exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
};

const client = [
    {
        oneOf: [babelLoader, cssModuleLoaderClient, urlLoaderClient, fileLoaderClient],
    },
];
const server = [
    {
        oneOf: [babelLoader, cssModuleLoaderServer, urlLoaderServer, fileLoaderServer],
    },
];

module.exports = {
    client,
    server,
};
