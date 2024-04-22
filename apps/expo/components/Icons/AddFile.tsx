import * as React from "react"
import Svg, { Path } from "react-native-svg"
export default function AddFileIcon(props: { color?: string }) {
	return (
		<Svg width={24} height={24} fill="none">
			<Path
				stroke={props.color ?? "#7D7D81"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9.5 14H12m0 0h2.5M12 14v-2.5m0 2.5v2.5m2-14v2.3c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C15.52 8 16.08 8 17.2 8h2.3m.5 2.314V14c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C16.2 22 14.8 22 12 22v0c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C4 18.2 4 16.8 4 14V9.778c0-2.591 0-3.887.469-4.891a5 5 0 0 1 2.418-2.418C7.89 2 9.187 2 11.778 2v0c1.133 0 1.699 0 2.233.119a5 5 0 0 1 1.604.664c.462.294.862.695 1.663 1.495l.379.379c.865.865 1.297 1.297 1.606 1.802.274.447.476.935.599 1.445.138.575.138 1.187.138 2.41Z"
			/>
		</Svg>
	)
}
