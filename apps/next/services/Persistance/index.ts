import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { UserContext } from "./types"

/**
 * The Persistance layer is used to maintain data generated from server requests intented to be shared across front end routes
 * Persistance of user auth JWT is handled by secure store
 *
 * Example uses an unimplemented userContext which is otherwise handled by Clerk frontend auth functionality
 */

export interface Persistance {
	userContext?: UserContext
}

export interface PersistanceMethods {
	setUserContext: (userContext?: Persistance["userContext"]) => void
}

export const usePersistance = create<Persistance & PersistanceMethods>()(
	persist(
		(set, get) => ({
			setUserContext: (userContext?: UserContext) =>
				set((state) => ({
					userContext: userContext,
				})),
		}),
		{
			name: "persistance-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)
