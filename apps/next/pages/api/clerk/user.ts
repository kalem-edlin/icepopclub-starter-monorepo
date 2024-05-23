import { env } from "@acme/env/server"
import { appRouter } from "@acme/server"
import {
	Webhook,
	WebhookEvent,
	createCallerFactory,
	parseUser,
} from "@acme/server/utils"
import { NextApiRequest, NextApiResponse } from "next"

/**
 * Webhook request handler for a Clerk webhook user mutation
 * @param req
 * @returns
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		// Get the headers
		const headerPayload = req.headers
		const svix_id = headerPayload["svix-id"] as string
		const svix_timestamp = headerPayload["svix-timestamp"] as string
		const svix_signature = headerPayload["svix-signature"] as string

		// If there are no headers, error out
		if (!svix_id || !svix_timestamp || !svix_signature) {
			return new Response("Error occurred -- no svix headers", {
				status: 400,
			})
		}

		// Get the body
		const payload = await JSON.parse(req.body)
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

		// Initiate TRPC internal route callers
		const createCaller = createCallerFactory(appRouter)

		const caller = createCaller(() => ({
			authorization: env.PROJECT_INTERNAL_API_KEY,
		}))

		switch (eventType) {
			// Call create user route and update clerk user with generated OR existing userId.
			case "user.created":
				const clerkParsedUser = parseUser(evt.data)
				const createUserResponse =
					await caller.users.createUser(clerkParsedUser)

				// If clerk externalId, set via clerk client expecting update webhook
				let userMetaDataPopulationResult
				if (!clerkParsedUser.id) {
					userMetaDataPopulationResult = await fetch(
						`${env.CLERK_API_URL}/users/${evt.data.id}`,
						{
							body: `{"external_id":"${createUserResponse.foundUserId}"}`,
							headers: {
								Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
								"Content-Type": "application/json",
							},
							method: "PATCH",
						}
					)
				}
				console.log(
					`User ${createUserResponse.foundUserId}:${evt.data.id} successfully create with metadata population: ${JSON.stringify(userMetaDataPopulationResult)}`
				)
				break

			// Using userId in clerk public metadata response, update user record. Error if no ID supplied (unexpected error)
			case "user.updated":
				const parsedUser = parseUser(evt.data)
				if (!parsedUser.id) {
					throw new Error(
						`Could not update user without userId public metadata for authId ${parsedUser.authId}`
					)
				}
				const updatedUser = await caller.users.updateUser({
					id: parsedUser.id,
					user: parsedUser,
				})
				console.log(
					`User ${parsedUser.id}:${evt.data.id} successfully updated with result: ${updatedUser}`
				)
				break

			// Call Delete user by their auth id
			case "user.deleted":
				await caller.users.deleteUser(evt.data.id)
				console.log(
					`User auth-only:${evt.data.id} successfully deleted`
				)
				break

			// Only act on user mutation webhooks, all others return errors to clerk server
			default:
				return res
					.status(501)
					.json("ERROR: Cannot support this webhook event")
		}

		return res.status(200)
	}
	return res.status(501).json("This route does not support get requests")
}
