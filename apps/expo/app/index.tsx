import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLayoutEffect, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { trpc } from "../services/Query"

export default function Page() {
	const [interviewId, setInterviewId] = useState<undefined | number>()
	const [error, setError] = useState<string | undefined>()
	const [updating, setUpdating] = useState(false)

	console.log(interviewId)

	const createCountMutation = trpc.interview.create.useMutation({
		onError: (e) => setError(e.message),
		onSuccess: (newId) => {
			setInterviewId(newId)
			AsyncStorage.setItem("interviewId", `${newId}`)
			utils.interview.byId.invalidate({
				id: newId,
			})
		},
	})

	const updateCountMutation = trpc.interview.update.useMutation({
		onError: (e) => setError(e.message),
		onSuccess: (c) =>
			utils.interview.byId.invalidate({
				id: interviewId,
			}),
	})

	const getCountQuery = trpc.interview.byId.useQuery({
		id: interviewId,
	})

	const utils = trpc.useUtils()

	const handleClick = async () => {
		setUpdating(true)
		const result = await updateCountMutation.mutateAsync({
			id: interviewId!,
			count: getCountQuery.data! + 1,
		})
		setUpdating(false)
	}

	useLayoutEffect(() => {
		const getStoredId = async () => {
			const id = await AsyncStorage.getItem("interviewId")
			if (id === undefined || id === null || !+id) {
				createCountMutation.mutate()
				return
			}
			setInterviewId(+id!)
		}
		getStoredId()
	}, [])

	return (
		<View className="h-screen w-full justify-center items-center">
			{error && <Text className="text-red-500">{error}</Text>}
			{getCountQuery.data === undefined || getCountQuery.isLoading ? (
				<ActivityIndicator />
			) : (
				<>
					<TouchableOpacity
						disabled={updating}
						onPress={handleClick}
						className="py-2 w-24 rounded-md items-center bg-blue-500 text-white">
						{updating ? <ActivityIndicator /> : "Click me"}
					</TouchableOpacity>
					<View className="mt-3">Count: {getCountQuery.data}</View>
				</>
			)}
		</View>
	)
}
