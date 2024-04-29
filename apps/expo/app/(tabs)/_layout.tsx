import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo"
import { MaterialIcons } from "@expo/vector-icons"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, Tabs } from "expo-router"
import React, { useEffect } from "react"
import { TouchableOpacity } from "react-native"
import { usePersistance } from "../../services/Persistance"
import { trpc } from "../../services/Query"

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"]
	color: string
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
	const { isLoaded, signOut, isSignedIn } = useAuth()
	const { user } = useUser()
	const setUserContext = usePersistance((state) => state.setUserContext)
	const createUserIfWebhookFailedMutation =
		trpc.users.getUserAndUpdateUserIfNotExists.useMutation()

	useEffect(() => {
		if (isSignedIn && user) {
			setTimeout(() => {
				createUserIfWebhookFailedMutation.mutate({
					id: user.id,
					emailAddress:
						user.primaryEmailAddress?.emailAddress ??
						"no_valid_email_address@gmail.com",
					firstName: user.firstName,
					lastName: user.lastName,
					imageUrl: user.imageUrl,
					username: user.username,
					phoneNumber: user.primaryPhoneNumber?.phoneNumber,
				})
			}, 20000)
		}
	}, [isSignedIn])

	return (
		<>
			<SignedIn>
				<Tabs
					screenOptions={{
						headerShown: true,
					}}>
					<Tabs.Screen
						name="index"
						options={{
							title: "Profile",
							tabBarIcon: ({ color }) => (
								<TabBarIcon name="code" color={color} />
							),
							headerRight: () =>
								isLoaded && (
									<TouchableOpacity
										onPress={() => signOut()}
										className="mr-4">
										<MaterialIcons
											name="logout"
											size={20}
											color="black"
										/>
									</TouchableOpacity>
								),
						}}
					/>
					<Tabs.Screen
						name="poke"
						options={{
							title: "Poke",
							tabBarIcon: ({ color }) => (
								<TabBarIcon name="code" color={color} />
							),
						}}
					/>
				</Tabs>
			</SignedIn>
			<SignedOut>
				<Redirect href="/(auth)/signin"></Redirect>
			</SignedOut>
		</>
	)
}
