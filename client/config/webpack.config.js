const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */

module.exports = (env) => {
	env.mode && console.log(`Mode: ${env.mode}`);
	return {
		entry: path.resolve(__dirname, '..', 'src', 'index.tsx'),
		output: {
			path: path.resolve(__dirname, '..', 'build'),
			filename: 'bundle.[contenthash].js',
		},
		mode: env.mode || 'development',
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		devServer: {
			static: path.resolve(__dirname, '..', 'src'),
			port: 3000,
			hot: true,
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
				},
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: ['ts-loader'],
				},
				{
					test: /\.(css|scss|sass)$/,
					exclude: /node_modules/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					type: 'asset',
					test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
					exclude: /node_modules/,
					use: ['file-loader'],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, '..', 'public', 'index.html'),
			}),
		],
	};
};
