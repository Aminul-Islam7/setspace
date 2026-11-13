import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

const client = new MongoClient(process.env.BETTER_AUTH_DB as string);
const db = client.db('setspace_prod');

export const auth = betterAuth({
	database: mongodbAdapter(db, {
		client,
	}),
	emailAndPassword: {
		enabled: true,
	},
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: ['http://localhost:3000', 'http://localhost:5000', process.env.BETTER_AUTH_URL || ''].filter(Boolean),
	socialProviders: {
		google: {
			clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string,
		},
	},
});
