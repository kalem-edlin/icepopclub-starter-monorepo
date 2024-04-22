import React from "react"
import { Path, Svg } from "react-native-svg"

export default function TickIcon(props: { size?: number; color?: string }) {
	return (
		<Svg
			width={props.size ?? 16}
			height={props.size ?? 16}
			fill="none"
			viewBox="0 0 16 16">
			<Path
				stroke={props.color ?? "#fff"}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.667 8.667 6 12l7.333-8"
			/>
		</Svg>
	)
}
