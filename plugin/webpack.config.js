const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const createConfig = (env, options) => {
	const isProduction = options.mode === 'production';
	const isDevelopment = options.mode === 'development';

	const baseConfig = {
		entry: './src/index.ts',
		resolve: {
			extensions: ['.ts', '.js'],
			extensionAlias: {
				'.js': ['.js', '.ts'],
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|ts)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								['@babel/preset-typescript', { allowDeclareFields: true }],
							],
						},
					},
				},
			],
		},
		devtool: isDevelopment ? 'source-map' : 'source-map',
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: isProduction,
						},
						format: {
							comments: false,
						},
					},
					extractComments: false,
				}),
			],
		},
	};

	if (isDevelopment) {
		return {
			...baseConfig,
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'arda-analytics.dev.js',
				library: 'ARDAAnalytics',
				libraryTarget: 'umd',
				globalObject: 'this',
			},
			devServer: {
				static: {
					directory: path.join(__dirname, 'dist'),
				},
				port: 8080,
				hot: true,
				open: true,
			},
		};
	}

	// Production builds - multiple outputs
	return [
		// UMD build for CDN distribution
		{
			...baseConfig,
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'arda-analytics.min.js',
				library: 'ARDAAnalytics',
				libraryTarget: 'umd',
				globalObject: 'this',
			},
		},
		// CommonJS build for NPM
		{
			...baseConfig,
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'index.js',
				library: 'ARDAAnalytics',
				libraryTarget: 'commonjs2',
			},
		},
		// ES Module build for modern bundlers
		{
			...baseConfig,
			output: {
				path: path.resolve(__dirname, 'dist'),
				filename: 'index.esm.js',
				library: {
					type: 'module',
				},
			},
			experiments: {
				outputModule: true,
			},
		},
	];
};

module.exports = createConfig; 