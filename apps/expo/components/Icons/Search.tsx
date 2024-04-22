import { StyleProp, TouchableOpacity, ViewStyle } from "react-native"
import { Path, Svg } from "react-native-svg"

export default function Search(props: {
	onSearch?: () => void
	focused?: boolean
	style?: StyleProp<ViewStyle>
}) {
	const { focused = false } = props
	return (
		<TouchableOpacity style={props.style} onPress={props.onSearch}>
			<Svg width={20} height={20} fill="none">
				<Path
					stroke="#232323"
					strokeLinecap="round"
					strokeWidth={1.25}
					d="m17.5 17.5-3.03-3.03m0 0A7.5 7.5 0 1 0 3.863 3.863 7.5 7.5 0 0 0 14.47 14.47Z"
				/>
			</Svg>
		</TouchableOpacity>
	)
}
