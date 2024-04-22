import React from "react"
import { Path, Svg } from "react-native-svg"

export default function FriendsIcon(props: { size?: number; color?: string }) {
	return (
		<Svg
			width={props.size ?? 24}
			height={props.size ?? 24}
			fill="none"
			viewBox="0 0 24 24">
			<Path
				stroke={props.color ?? "#fff"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M15 10a4 4 0 0 0 0-8m2 20h2.8a3.2 3.2 0 0 0 3.2-3.2v0a4.8 4.8 0 0 0-4.8-4.8H17m-5-8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4.2 22h7.6a3.2 3.2 0 0 0 3.2-3.2v0a4.8 4.8 0 0 0-4.8-4.8H5.8A4.8 4.8 0 0 0 1 18.8v0A3.2 3.2 0 0 0 4.2 22Z"
			/>
		</Svg>
	)
}
