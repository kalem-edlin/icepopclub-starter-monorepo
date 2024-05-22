import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo"
import { MaterialIcons } from "@expo/vector-icons"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Redirect, Tabs } from "expo-router"
import React, { useEffect } from "react"
import { TouchableOpacity } from "react-native"

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"]
	color: string
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
	const { isLoaded, signOut } = useAuth()
	const { user } = useUser()

	useEffect(() => {
		console.log(user)
	}, [user])

	return (
		<>
			<SignedIn>
				<Tabs
					screenOptions={{
						headerShown: true,
					}}>
					<Tabs.Screen
						name="user"
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
