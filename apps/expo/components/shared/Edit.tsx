import { Feather } from "@expo/vector-icons"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"

export default function EditButton(props: {
	onPress: () => void
	iconSize?: number
	style: StyleProp<ViewStyle>
}) {
	const { iconSize = 15 } = props

	return (
		<TouchableOpacity
			onPress={props.onPress}
			style={props.style}
			className="justify-center items-center">
			<View className="bg-black w-full h-full rounded-full p-2 opacity-40" />
			<View className="absolute justify-center items-center">
				<Feather name="edit-3" size={iconSize} color="white" />
			</View>
		</TouchableOpacity>
	)
}
