import { UserJSON } from "@clerk/backend"
import { InsertUser } from "../db/types"

/**
 * Take clerk user data on webhook update and tranform into user schema record for database consistency
 * @param j
 * @returns
 */
export const parseUser = (j: UserJSON): InsertUser => {
	if (!j.id) {
		throw new Error(`Webhook must pass in an id`)
	}

	// PRIMARY_USER_LOGIN check
	const emailAddress = j.email_addresses.find(
		(email) => email.id === j.primary_email_address_id
	)
	if (!emailAddress) {
		throw new Error(`Webhook must pass in an email`)
	}

	return {
		id: j.id,
		emailAddress: emailAddress.email_address,
		firstName: j.first_name,
		lastName: j.last_name,
		imageUrl: j.image_url,
	}
}
