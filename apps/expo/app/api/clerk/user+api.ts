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

// This endpoint is only necessary if user data will become more expansive than what the auth provider can store resulting in a need for a custom user table (good to have anyway)

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

	console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
	console.log("Webhook body:", body)

	const createCaller = createCallerFactory(appRouter)

	const caller = createCaller(() => ({
		authorization: env.PROJECT_INTERNAL_API_KEY,
	}))

	console.log("we here by now")

	switch (eventType) {
		case "user.created":
			caller.users.createUser(parseUser(evt.data))
			console.log("created user")
			break
		case "user.deleted":
			caller.users.deleteUser(evt.data.id)
			console.log("deleted user")
			break
		case "user.updated":
			caller.users.updateUser({
				id: evt.data.id,
				user: parseUser(evt.data),
			})
			console.log("updated user")
			break
		default:
			return new Response("ERROR: Cannot support this webhook event", {
				status: 501,
			})
	}

	return new Response("", { status: 200 })
}
