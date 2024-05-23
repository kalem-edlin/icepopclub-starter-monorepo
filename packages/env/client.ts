import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	clientPrefix: "EXPO_PUBLIC_",
	client: {
		EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME: z.string().min(1),
		EXPO_PUBLIC_MIXPANEL_TOKEN: z.string().min(1),
		EXPO_PUBLIC_SERVER_ORIGIN: z.string().url(),
		EXPO_PUBLIC_S3_URL_BASE: z.string().url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
