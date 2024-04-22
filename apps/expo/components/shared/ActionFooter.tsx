import React, { ReactNode } from "react"
import {
	KeyboardAvoidingView,
	StyleProp,
	Text,
	TouchableOpacity,
	ViewStyle,
} from "react-native"
import Button from "./Button"

export default function ActionFooter(props: {
	children?: ReactNode
	step?: {
		total: number
		current: number
	}
	cta: string
	mode?: "normal" | "danger"
	bottomText?: ReactNode
	bottomTextPress?: () => void
	onCta: () => void
	style?: StyleProp<ViewStyle>
}) {
	const { mode = "normal" } = props

	return (
		<KeyboardAvoidingView
			behavior="height"
			// keyboardVerticalOffset={}
			style={[props.style]}
			className="bg-white absolute w-full bottom-0 pt-4">
			{props.children}
			<Button
				// @ts-ignore
				className={`${
					mode === "danger"
						? "border-2 border-red-500"
						: "bg-cyan-500"
				} h-12 w-11/12 mx-auto rounded-lg`}
				mode={mode}
				onPress={props.onCta}
				textTint="light"
				right={
					props.step && (
						<Text
							className={` font-bold opacity-40 my-auto text-white right-2`}>
							{props.step.current}/{props.step.total}
						</Text>
					)
				}>
				{props.cta}
			</Button>
			{props.bottomText && (
				<TouchableOpacity
					disabled={!props.bottomTextPress}
					onPress={props.bottomTextPress}>
					<Text className="text-xs h-10 text-center px-14 mt-4">
						{props.bottomText}
					</Text>
				</TouchableOpacity>
			)}
		</KeyboardAvoidingView>
	)
}
