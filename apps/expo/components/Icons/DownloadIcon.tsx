import * as React from "react"
import Svg, { Path } from "react-native-svg"
export default function DownloadIcon(props: { size?: number; color?: string }) {
	return (
		<Svg
			width={props.size ?? 20}
			height={props.size ?? 20}
			viewBox="0 0 16 16"
			fill="none">
			<Path
				stroke={props.color ?? "#2AB9E5"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.25}
				d="M10.667 5.333H11v0c.93 0 1.396 0 1.774.115.852.258 1.52.925 1.778 1.778.115.378.115.843.115 1.774v1.4c0 1.493 0 2.24-.291 2.81-.256.502-.664.91-1.165 1.166-.57.29-1.318.29-2.811.29H5.6c-1.494 0-2.24 0-2.81-.29a2.667 2.667 0 0 1-1.166-1.166c-.29-.57-.29-1.317-.29-2.81V9c0-.93 0-1.396.114-1.774a2.667 2.667 0 0 1 1.778-1.778c.378-.115.844-.115 1.774-.115v0h.333m2.667-4v10m0 0 2.667-2.667M8 11.333 5.333 8.666"
			/>
		</Svg>
	)
}
