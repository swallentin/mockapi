{
	context: '/api/admin',
	port: 5001,
	host: 'localhost',
	changeOrigin: true,
	rewrite: {
		'^/api/admin': ''
	}
}