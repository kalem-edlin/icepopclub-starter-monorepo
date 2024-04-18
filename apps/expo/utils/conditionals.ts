import type { Mixpanel } from "mixpanel-react-native"

// Add all exportables here
interface ConditionalExports {
	Mixpanel?: typeof Mixpanel
}

// Add Defaults here
let c: ConditionalExports = {}

// App Clip Thining + Expo Go Compatible
try {
} catch (error) {
	__DEV__ &&
		console.log(`Excluding conditional imports from ${error} for app clip`)
}

// Non Expo Go Compatible
try {
	c.Mixpanel = require("mixpanel-react-native").Mixpanel
} catch (error) {
	__DEV__ &&
		console.log(`Excluding conditional imports from ${error} for Expo Go`)
}

export default c
