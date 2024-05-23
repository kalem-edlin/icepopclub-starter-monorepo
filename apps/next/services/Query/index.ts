import type { AppRouter } from "@acme/server/shared"
import { transformer } from "@acme/server/shared"
import { httpLink, loggerLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import { getHostUrl } from "../../utils/url"

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" &&
							opts.result instanceof Error),
				}),
				httpLink({
					transformer,
					url: `${getHostUrl()}/api/trpc`,
					async headers() {
						return {
							Authorization: `Bearer ${await "USERID"}`,
						}
					},
				}),
			],
		}
	},
	ssr: false,
	transformer,
})
