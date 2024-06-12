import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { ReactNode, useState } from "react"
import { trpc } from "."
import { getHostUrl } from "../../utils/url"

// TODO: Pass in authentication token here from userstorage
export const QueryProvider = ({ children }: { children: ReactNode }) => {
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
					url: getHostUrl("/api/trpc"),
					async headers() {
						return {}
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
