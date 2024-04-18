const { createRequestHandler } = require("@expo/server/adapter/vercel")

module.exports = createRequestHandler({
	build: require("path").join(__dirname, "../expo/apps/dist/server"),
	mode: process.env.NODE_ENV,
})
