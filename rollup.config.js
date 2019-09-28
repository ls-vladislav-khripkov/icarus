import babel from 'rollup-plugin-babel'
// import commonjs from 'rollup-plugin-commonjs';
// import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [
	babel({
		plugins: [
			// 'transform-object-assign'
		],
	}),
	// nodeResolve({
	// 	jsnext: true,
	// 	main: true
	// }),
	// commonjs({
	// 	include: 'node_modules/**',
	// 	exclude: ['node_modules/foo/**', 'node_modules/bar/**'],
	// 	extensions: ['.js'],
	// 	ignoreGlobal: false,
	// 	sourceMap: false,
	// 	namedExports: {
	// 		'./module.js': ['foo', 'bar']
	// 	}, 

	// 	ignore: ['conditional-runtime-dependency']
	// })
]



export default [{
	input: './src/scripts/index.js',
	output: {
	  file: './dist/scripts/main.js',
	  name: 'boo',
	  format: 'es'
	},
	plugins: plugins
}, {
	input: './src/scripts/libs.js',
	output: {
	  file: './dist/scripts/libs.js',
	  name: 'boo',
	  format: 'es'
	},
	plugins: plugins
}];