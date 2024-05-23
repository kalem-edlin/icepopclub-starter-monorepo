import { useAuth } from "@clerk/clerk-expo"
import { env } from "@monoexpo/env/client"
import { transformer } from "@monoexpo/server/shared"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { ReactNode, useState } from "react"
import { trpc } from "."
import { getHostUrl } from "../../utils/url"

// TODO: Pass in authentication token here from userstorage
export const QueryProvider = ({ children }: { children: ReactNode }) => {
	const { getToken } = useAuth()

	/**
	 * Define tanstack retry policy
	 */
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: 3 },
					mutations: { retry: 3 },
				},
			})
	)

	/**
	 * Initiate TRPC client by including authorization headers on each request
	 * Point to the api/trpc route defined in app/api/trpc+[api]
	 */
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					transformer,
					url: getHostUrl("/api/trpc"),
					async headers() {
						console.log(
							`headers assigned with ${env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME}`
						)
						return {
							Authorization: `Bearer ${await getToken({ template: env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME })}`,
						}
					},
				}),
			],
		})
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpc.Provider>
	)
}
