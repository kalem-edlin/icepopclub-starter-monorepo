import { env } from "@monoexpo/env/server"
import { appRouter } from "@monoexpo/server/routers"
import {
	Webhook,
	WebhookEvent,
	createCallerFactory,
	parseUser,
} from "@monoexpo/server/utils"
import { ExpoRequest } from "expo-router/server"

export async function GET(req: ExpoRequest) {
	return Response.json(
		{
			error: "POST route only",
		},
		{
			status: 501,
		}
	)
}

/**
 * Webhook request handler for a Clerk user update
 * @param req
 * @returns
 */
export async function POST(req: Request) {
	// Get the headers
	const headerPayload = req.headers
	const svix_id = headerPayload.get("svix-id")
	const svix_timestamp = headerPayload.get("svix-timestamp")
	const svix_signature = headerPayload.get("svix-signature")

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		})
	}

	// Get the body
	const payload = await req.json()
	const body = JSON.stringify(payload)

	// Create a new Svix instance with your secret.
	const wh = new Webhook(env.CLERK_USER_WEBHOOK_SECRET)

	let evt: WebhookEvent

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent
	} catch (err) {
		console.error("Error verifying webhook:", err)
		return new Response("Error occured", {
			status: 400,
		})
	}

	// Get the ID and type
	const { id } = evt.data
	const eventType = evt.type

	if (!evt.data.id) {
		return new Response(
			`ERROR: No id supplied for user mutation: ${eventType}`,
			{
				status: 500,
			}
		)
	}

	const createCaller = createCallerFactory(appRouter)

	const caller = createCaller(() => ({
		authorization: env.PROJECT_INTERNAL_API_KEY,
	}))

	switch (eventType) {
		case "user.created":
			const createdUser = await caller.users.createUser(
				parseUser(evt.data)
			)
			console.log(`created user ${JSON.stringify(createdUser)}`)
			break
		case "user.deleted":
			const result = await caller.users.deleteUser(evt.data.id)
			console.log(`deleted user ${JSON.stringify(result)}`)
			break
		case "user.updated":
			const updatedUser = await caller.users.updateUser(
				parseUser(evt.data)
			)
			console.log(`updated user ${updatedUser}`)
			break
		default:
			return new Response("ERROR: Cannot support this webhook event", {
				status: 501,
			})
	}

	return new Response("", { status: 200 })
}
