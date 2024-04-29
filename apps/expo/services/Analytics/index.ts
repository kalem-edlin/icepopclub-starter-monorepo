import { env } from "@monoexpo/env/client"
import type { Mixpanel } from "mixpanel-react-native"
import { Platform } from "react-native"
import c from "../../utils/conditionals"

const trackAutomaticEvents = true
let mixpanel: Mixpanel | undefined

const initMixpanel = async () => {
	const MixpanelObject = c.Mixpanel

	if (MixpanelObject) {
		mixpanel = new MixpanelObject(
			env.EXPO_PUBLIC_MIXPANEL_TOKEN,
			trackAutomaticEvents
		)
	}
}

if (Platform.OS === "ios") {
	initMixpanel()
}

export default mixpanel
