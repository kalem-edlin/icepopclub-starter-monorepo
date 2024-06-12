import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { NativeWindStyleSheet } from "nativewind"
import { QueryProvider } from "../services/Query/provider"

NativeWindStyleSheet.setOutput({
	default: "native",
})

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	})

	if (!loaded) {
		return null
	}

	return (
		<QueryProvider>
			<Stack />
		</QueryProvider>
	)
}
