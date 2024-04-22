import React from "react"
import { Path, Svg } from "react-native-svg"

export default function ItalicIcon(props: { active?: boolean }) {
	const { active } = props
	return (
		<Svg width={20} height={20} fill={active ? "#7D7D81" : "#F0EDE2"}>
			<Path
				stroke={active ?? false ? "#F0EDE2" : "#7D7D81"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.25}
				d="M8.333 5h5.834M5.833 15h5.834m0-10L8.333 15m0 3.334h3.334c2.333 0 3.5 0 4.391-.454a4.167 4.167 0 0 0 1.821-1.821c.454-.892.454-2.059.454-4.392V8.334c0-2.334 0-3.5-.454-4.392a4.167 4.167 0 0 0-1.82-1.82c-.892-.455-2.059-.455-4.392-.455H8.333c-2.333 0-3.5 0-4.391.454A4.167 4.167 0 0 0 2.12 3.942c-.454.891-.454 2.058-.454 4.392v3.333c0 2.334 0 3.5.454 4.392a4.167 4.167 0 0 0 1.82 1.82c.892.455 2.059.455 4.392.455Z"
			/>
		</Svg>
	)
}
