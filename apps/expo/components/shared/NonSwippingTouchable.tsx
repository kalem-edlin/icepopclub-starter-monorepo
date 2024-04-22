import React, { ReactNode, useState } from "react"
import {
	StyleProp,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from "react-native"

export default function NonSwippingTouchable(props: {
	children: ReactNode
	opacity?: boolean
	onPress: () => void
	style?: StyleProp<ViewStyle>
}) {
	const { opacity = false } = props

	const [pressLocation, setPressLocation] = useState(0)

	const onNonSwipingPress = (endPressLocation: number) => {
		if (Math.abs(pressLocation - endPressLocation) > 10) {
			return
		}

		props.onPress()
	}

	return opacity ? (
		<TouchableOpacity
			onPressIn={(event) => setPressLocation(event.nativeEvent.locationX)}
			onPressOut={(event) =>
				onNonSwipingPress(event.nativeEvent.locationX)
			}
			style={[props.style]}>
			<View>{props.children}</View>
		</TouchableOpacity>
	) : (
		<TouchableWithoutFeedback
			onPressIn={(event) => setPressLocation(event.nativeEvent.locationX)}
			onPressOut={(event) =>
				onNonSwipingPress(event.nativeEvent.locationX)
			}
			style={[props.style]}>
			<View>{props.children}</View>
		</TouchableWithoutFeedback>
	)
}
