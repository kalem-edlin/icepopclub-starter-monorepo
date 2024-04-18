import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import {
    UserContext,
} from "./types"

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
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
)
