import { useAuth } from "@clerk/clerk-expo"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { ReactNode, useState } from "react"
import { trpc } from "."
import getUrl from "../../utils/url"

// TODO: Pass in authentication token here from userstorage
export const QueryProvider = ({ children }: { children: ReactNode }) => {
	const { getToken } = useAuth()

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: 3 },
					mutations: { retry: 3 },
				},
			})
	)
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: getUrl("/api/trpc"),
					async headers() {
						return { Authorization: `Bearer ${await getToken()}` }
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
