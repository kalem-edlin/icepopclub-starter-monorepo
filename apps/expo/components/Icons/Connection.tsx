import React from "react"
import { Path, Svg } from "react-native-svg"

export default function ConnectionIcon(props: { active?: boolean }) {
	const { active } = props
	return (
		<Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
			<Path
				stroke="#7D7D81"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m7.169 10.937-.415.427a2.868 2.868 0 0 1-4.145 0 3.092 3.092 0 0 1 0-4.277l.988-1.02a2.648 2.648 0 0 1 3.827 0l.16.165M6.83 3.063l.415-.427a2.868 2.868 0 0 1 4.145 0 3.092 3.092 0 0 1 0 4.277l-.988 1.02a2.648 2.648 0 0 1-3.827 0l-.16-.165"
			/>
		</Svg>
	)
}
