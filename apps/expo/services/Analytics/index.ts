import type { Mixpanel } from "mixpanel-react-native";
import c from "../../utils/conditionals";

const trackAutomaticEvents = true
let mixpanel: Mixpanel | undefined;

const initMixpanel = async () => {
    const MixpanelObject = c.Mixpanel
    if (MixpanelObject) {
        mixpanel = new MixpanelObject("token", trackAutomaticEvents)
    }
}

initMixpanel()

export default mixpanel
