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
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
