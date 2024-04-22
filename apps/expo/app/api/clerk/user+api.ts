import { WebhookEvent } from "@repo/server/db/types"
import { zInsertUser } from "@repo/server/db/zod"
import { appRouter } from "@repo/server/routers/_app"
import { createCallerFactory, createContext } from "@repo/server/trpc"
import { ExpoRequest } from "expo-router/server"
import { Webhook } from "svix"

export async function GET(req: ExpoRequest) {
	return "ERROR: Will only handle POST requests on this route"
}

// This endpoint is only necessary if user data will become more expansive than what the auth provider can store resulting in a need for a custom user table (good to have anyway)

export async function POST(req: ExpoRequest) {
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
		)
	}

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
	const wh = new Webhook(WEBHOOK_SECRET)

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

	console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
	console.log("Webhook body:", body)

	const createCaller = createCallerFactory(appRouter)
	const caller = createCaller(createContext)

	switch (eventType) {
		case "user.created":
			caller.users.createUser(
				zInsertUser.parse({ ...evt.data, authProviderId: evt.data.id })
			)
			break
		case "user.deleted":
			if (!evt.data.id) {
				return new Response("ERROR: No userId Supplied for deletion", {
					status: 500,
				})
			}
			caller.users.deleteUser(evt.data.id)
			break
		case "user.updated":
			if (!evt.data.id) {
				return new Response("ERROR: No userId Supplied for deletion", {
					status: 500,
				})
			}
			caller.users.updateUser({
				id: evt.data.id,
				user: zInsertUser.parse(evt.data),
			})
			break
		default:
			return new Response("ERROR: Cannot support this webhook event", {
				status: 501,
			})
	}

	return new Response("", { status: 200 })
}
