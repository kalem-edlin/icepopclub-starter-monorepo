// import type { Mixpanel } from "mixpanel-react-native"
// import c from "../../utils/conditionals"
// import { env } from "../../utils/env"

// const trackAutomaticEvents = true
// let mixpanel: Mixpanel | undefined

// /**
//  * Init mixpanel if the conditional import is available (non expo go)
//  */
// const initMixpanel = async () => {
// 	const MixpanelObject = c.Mixpanel

// 	if (MixpanelObject) {
// 		mixpanel = new MixpanelObject(
// 			env.EXPO_PUBLIC_MIXPANEL_TOKEN,
// 			trackAutomaticEvents
// 		)
// 	}
// }

// initMixpanel()

// export default mixpanel ?? null
