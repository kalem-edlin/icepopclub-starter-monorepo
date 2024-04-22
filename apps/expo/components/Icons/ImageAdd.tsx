import * as React from "react"
import Svg, { Path } from "react-native-svg"
export default function AddImageIcon(props: { color?: string }) {
	return (
		<Svg width={24} height={24} fill="none">
			<Path
				stroke={props.color ?? "#7D7D81"}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="m2.5 18.5 4.27-4.27c.782-.782 1.173-1.173 1.624-1.322A2 2 0 0 1 9.62 12.9c.454.143.85.528 1.643 1.297l3.224 3.13m7.014.361-1.425-1.424c-.792-.792-1.188-1.188-1.645-1.337a2 2 0 0 0-1.235 0c-.457.149-.853.545-1.646 1.337l-1.063 1.063M18.5 21.34l-4.014-4.014M18 9V6m0 0V3m0 3h-3m3 0h3m-9-4h-.5v0c-3.266 0-4.899 0-6.154.619A6 6 0 0 0 2.62 5.346C2 6.601 2 8.234 2 11.5v.9c0 3.36 0 5.04.654 6.324a6 6 0 0 0 2.622 2.622C6.56 22 8.24 22 11.6 22h.9c3.266 0 4.899 0 6.154-.619a6 6 0 0 0 2.727-2.727C22 17.399 22 15.766 22 12.5v0-.5"
			/>
		</Svg>
	)
}
