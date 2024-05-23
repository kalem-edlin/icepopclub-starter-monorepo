import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
	clientPrefix: "NEXT_PUBLIC_",
	client: {
		NEXT_PUBLIC_SERVER_ORIGIN: z.string().url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SERVER_ORIGIN: process.env.NEXT_PUBLIC_SERVER_ORIGIN,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
})
