import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import Svg, { Path } from "react-native-svg"
export default function LikeIcon(props: {
	color?: string
	fill?: string
	size?: number
	style?: StyleProp<ViewStyle>
}) {
	return (
		<Svg
			style={props.style}
			width={props.size ?? 20}
			height={props.size ?? 20}
			viewBox="0 0 16 16"
			fill={props.fill ?? "none"}>
			<Path
				stroke={props.fill ?? props.color ?? "#7D7D81"}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8 14c.667 0 6.667-3.333 6.667-8 0-2.333-2-3.97-4-4-1-.014-2 .334-2.667 1.334C7.333 2.334 6.316 2 5.333 2c-2 0-4 1.667-4 4 0 4.667 6 8 6.667 8Z"
			/>
		</Svg>
	)
}
