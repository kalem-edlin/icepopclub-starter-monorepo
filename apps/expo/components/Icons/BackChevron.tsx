import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"

export default function BackChevron(props: {
	disabled?: boolean
	color?: string
	onPress?: () => void
	style?: StyleProp<ViewStyle>
}) {
	const { disabled = false, color = "white" } = props
	const handleNavigation = () => {
		props.onPress ? props.onPress() : router.back()
	}

	return (
		<TouchableOpacity
			className={props.disabled ? "opacity-0" : "opacity-100"}
			disabled={disabled}
			style={props.style}
			onPress={handleNavigation}>
			<View className="my-auto">
				<Ionicons name="chevron-back" size={22} color={color} />
			</View>
		</TouchableOpacity>
	)
}
