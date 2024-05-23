import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	server: {
		PROJECT_NAME: z.string().min(1),
		PROJECT_INTERNAL_API_KEY: z.string().min(1),
		POSTGRES_URL: z.string().url(),
		POSTGRES_PRISMA_URL: z.string().url(),
		POSTGRES_URL_NO_SSL: z.string().url(),
		POSTGRES_URL_NON_POOLING: z.string().url(),
		POSTGRES_USER: z.string().min(1),
		POSTGRES_HOST: z.string().min(1),
		POSTGRES_PASSWORD: z.string().min(1),
		POSTGRES_DATABASE: z.string().min(1),
		CLERK_PEM_PUBLIC_KEY: z
			.string()
			.min(1)
			.transform((value) => value.replaceAll(/\\n/g, "\n")),
		CLERK_USER_WEBHOOK_SECRET: z.string().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_API_URL: z.string().url(),
		EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME: z.string().min(1),
		S3_BUCKET_NAME: z.string().min(1),
		S3_SECRET_KEY: z.string().min(1),
		S3_ACCESS_KEY: z.string().min(1),
		S3_REGION: z.string().min(1),
		NODE_ENV: z.string(),
	},
	runtimeEnv: {
		PROJECT_NAME: process.env.PROJECT_NAME,
		PROJECT_INTERNAL_API_KEY: process.env.PROJECT_INTERNAL_API_KEY,
		POSTGRES_URL: process.env.POSTGRES_URL,
		POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
		POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
		POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
		POSTGRES_USER: process.env.POSTGRES_USER,
		POSTGRES_HOST: process.env.POSTGRES_HOST,
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
		POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
		CLERK_PEM_PUBLIC_KEY: process.env.CLERK_PEM_PUBLIC_KEY,
		CLERK_USER_WEBHOOK_SECRET: process.env.CLERK_USER_WEBHOOK_SECRET,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_API_URL: process.env.CLERK_API_URL,
		EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME:
			process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME,
		S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		S3_SECRET_KEY: process.env.S3_SECRET_KEY,
		S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
		S3_REGION: process.env.S3_REGION,
		NODE_ENV: process.env.NODE_ENV,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
})
