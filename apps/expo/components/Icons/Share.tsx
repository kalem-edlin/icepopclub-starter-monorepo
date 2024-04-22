import React from "react"
import { Path, Svg } from "react-native-svg"

export default function ShareIcon(props: { color: string; size: number }) {
	return (
		<Svg
			style={{
				borderColor: "black",
			}}
			width={props.size}
			height={props.size * 0.9}
			viewBox="0 0 27 25"
			fill="none">
			<Path
				stroke={props.color}
				strokeLinecap="round"
				strokeWidth={2.25}
				d="M16.666 23.406 25.032 2.66M12.373 13.469 1.605 9.708M16.533 23.539 11.925 13.53M25.043 2.66 1.048 9.576M24.688 2.73l-12.43 11.056"
			/>
		</Svg>
	)
}
