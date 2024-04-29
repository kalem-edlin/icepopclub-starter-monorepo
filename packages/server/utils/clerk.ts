import { UserJSON } from "@clerk/backend"
import { InsertUser } from "../db/types"

export const parseUser = (j: UserJSON): InsertUser => {
	if (!j.id) {
		throw new Error(`Webhook must pass in an id`)
	}
	if (!j.primary_email_address_id) {
		throw new Error(`Webhook must pass in an email_address`)
	}

	return {
		id: j.id,
		emailAddress: j.primary_email_address_id,
		firstName: j.first_name,
		lastName: j.last_name,
		imageUrl: j.image_url,
		phoneNumber: j.primary_phone_number_id,
		username: j.username,
	}
}
