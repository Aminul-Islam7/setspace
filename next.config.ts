import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentFeedback: true,
	},
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'i.ibb.co' },
			{ protocol: 'https', hostname: 'i.ibb.co.com' },
		],
	},

	cacheComponents: true,
	partialPrefetching: true,
	reactCompiler: true,
	turbopack: {
		rules: {
			'*.css': {
				loaders: ['@tailwindcss/turbopack'],
				as: '*.css',
			},
		},
	},
};

export default nextConfig;

