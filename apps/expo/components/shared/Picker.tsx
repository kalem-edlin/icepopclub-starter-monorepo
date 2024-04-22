import React, { ReactNode, useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, StyleProp, View, ViewStyle } from "react-native"

export type PickerValue = { value: string; label: string }

const WIDTH = Dimensions.get("window").width

export default function Picker(props: {
	itemHeight: number
	marginY: number
	items: PickerValue[]
	currentIndex: number
	onChange: (value: string, index: number) => void
	renderItem: (value: string, label: string) => ReactNode
	style?: StyleProp<ViewStyle>
}) {
	const [fontScrolling, setFontScrolling] = useState(false)
	const [height, setHeight] = useState(0)
	const listRef = useRef<FlatList<PickerValue>>(null)

	const itemHeight = (height * 1.2) / 3

	useEffect(() => {
		listRef.current?.scrollToIndex({
			index: props.currentIndex,
			animated: true,
		})
	}, [props.currentIndex])

	return (
		<View
			onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
			style={[props.style]}>
			<FlatList
				initialScrollIndex={props.currentIndex}
				onLayout={() =>
					listRef.current?.scrollToIndex({
						index: props.currentIndex,
						animated: true,
					})
				}
				getItemLayout={(data, index) => ({
					length: itemHeight,
					offset: (itemHeight - 0.5) * index,
					index,
				})}
				ref={listRef}
				pointerEvents="auto"
				snapToInterval={itemHeight}
				decelerationRate={0.1}
				scrollEventThrottle={0.5}
				className="absolute w-full -top-[20px] bottom-0 "
				onMomentumScrollEnd={(e) => {
					if (!fontScrolling) return
					setFontScrolling(false)
					const index = Math.min(
						props.items.length - 1,
						Math.ceil(e.nativeEvent.contentOffset.y / itemHeight)
					)
					props.onChange(props.items[index].value, index)
				}}
				onScrollBeginDrag={() => setFontScrolling(true)}
				data={[
					{ value: "", label: "" },
					...props.items,
					{ value: "", label: "" },
				]}
				renderItem={({ item, index }) => (
					<View
						key={item.value + index}
						className={`justify-center mx-auto ${
							index - 1 !== props.currentIndex
								? "opacity-30"
								: "opacity-100"
						}`}
						style={{
							height: itemHeight,
						}}>
						{props.renderItem(item.value, item.label)}
					</View>
				)}
			/>
		</View>
	)
}
