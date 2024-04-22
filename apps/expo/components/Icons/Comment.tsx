import * as React from "react"
import Svg, { Path } from "react-native-svg"
export default function CommentIcon(props: { size?: number; color?: string }) {
	return (
		<Svg
			width={props.size ?? 20}
			height={props.size ?? 20}
			viewBox="0 0 16 16"
			fill="none">
			<Path
				stroke={props.color ?? "#7D7D81"}
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M5.333 6.666h5.334M5.333 9.333H8M14.667 8A6.667 6.667 0 0 1 8 14.666c-.76 0-1.411-.108-2.016-.324-.571-.205-.857-.307-.967-.333-1.012-.238-1.432.456-2.304.601a.667.667 0 0 1-.774-.712c.031-.378.293-.736.397-1.1.217-.755-.077-1.328-.388-2A6.667 6.667 0 1 1 14.667 8Z"
			/>
		</Svg>
	)
}
