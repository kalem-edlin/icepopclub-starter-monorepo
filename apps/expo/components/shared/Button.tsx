import React, { ReactNode } from "react"
import {
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"

export default function Button(props: {
	disabled?: boolean
	mode?: "normal" | "danger"
	onPress: () => void
	right?: ReactNode
	style?: StyleProp<ViewStyle>
	children?: ReactNode
}) {
	const { disabled = false, mode = "normal" } = props

	return (
		<TouchableOpacity
			{...props}
			disabled={disabled}
			className="justify-center align-middle p-auto">
			<Text
				className={`font-semibold text-center text-sm ${
					mode === "danger" ? "text-red-500" : "text-white"
				} mix-blend-difference 
					`}>
				{props.children}
			</Text>
			{props.right && (
				<View className="absolute right-3 h-full">{props.right}</View>
			)}
		</TouchableOpacity>
	)
}
