import { env } from "@monoexpo/env/server"
import z from "zod"

// This is defined as a custom JWT schema on the clerk dashboard
export const zExpectedJWT = z.object({
	auth_id: z.string().min(1),
	primary: z.string().min(1),
	external_id: z.string().min(1),
})

export const ClerkJWTTemplateName = env.CLERK_JWT_TEMPLATE_NAME
