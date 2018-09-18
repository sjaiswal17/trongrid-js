const webpack = require("webpack");

const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

const basePlugins = [
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    'transform-object-rest-spread',
    "source-map-support"
];

module.exports = function (config) {
    config.set({

        files: [
            'test/test.js'
        ],

        frameworks: ['mocha'],

        preprocessors: {
            'test/test.js': ['webpack', 'sourcemap']
        },

        reporters: ['spec', 'coverage'],

        coverageReporter: {

            dir: 'coverage/',
            reporters: [
                {type: 'html'},
                {type: 'text'},
                {type: 'text-summary'}
            ],
            instrumenterOptions: {
                istanbul: {noCompact: true}
            }
        },

        webpack: {

            output: {
                libraryTarget: 'umd',
                libraryExport: 'default',
                umdNamedDefine: true
            },
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js/,
                        exclude: /(test|node_modules|bower_components)/,
                        loader: 'istanbul-instrumenter-loader',
                        options: {
                            esModules: true,
                            presets: [
                                ['@babel/env', {
                                    targets: {
                                        browsers: [
                                            '>0.25%',
                                            'not dead'
                                        ]
                                    }
                                }]
                            ],
                            plugins: [
                                ...basePlugins
                            ]
                        },
                    }
                ]
            },
            resolve: {
                modules: [
                    'node_modules',
                    'src'
                ],
            },
            mode: process.env.NODE_ENV || 'development',
            target: 'web'
        },

        webpackMiddleware: {
            noInfo: true
        },

        plugins: [
            require("karma-webpack"),
            require("istanbul-instrumenter-loader"),
            require("karma-mocha"),
            require("karma-coverage"),
            require("karma-chrome-launcher"),
            require("karma-spec-reporter"),
            require('karma-sourcemap-loader'),
            require('karma-coverage-istanbul-reporter')
        ],

        browsers: ['ChromeHeadless']
    });
};
