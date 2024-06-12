import AsyncStorage from "@react-native-async-storage/async-storage"
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
	interviewId: number | null
}

export interface PersistanceMethods {
	setUserContext: (userContext?: Persistance["userContext"]) => void
	setInterviewId: (id: number) => void
}

export const usePersistance = create<Persistance & PersistanceMethods>()(
	persist(
		(set, get) => ({
			interviewId: null,
			setUserContext: (userContext?: UserContext) =>
				set((state) => ({
					userContext: userContext,
				})),
			setInterviewId: (id: number) =>
				set((state) => ({
					interviewId: id,
				})),
		}),
		{
			name: "persistance-storage",
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
