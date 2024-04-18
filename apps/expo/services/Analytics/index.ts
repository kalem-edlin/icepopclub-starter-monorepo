import c from "../../utils/conditionals"

const trackAutomaticEvents = true
const mixpanel = c.Mixpanel?.init("token", trackAutomaticEvents)

export default mixpanel
