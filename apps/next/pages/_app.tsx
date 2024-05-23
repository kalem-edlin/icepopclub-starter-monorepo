import "@acme/next/styles/globals.css"
import type { AppProps } from "next/app"
import { trpc } from "../services/Query"

function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}

export default trpc.withTRPC(App)
