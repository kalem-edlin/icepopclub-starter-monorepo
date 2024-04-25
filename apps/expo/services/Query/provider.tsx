import { useAuth } from "@clerk/clerk-expo"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { ReactNode, useState } from "react"
import { trpc } from "."
import getUrl from "../../utils/url"

// TODO: Pass in authentication token here from userstorage
export const QueryProvider = ({ children }: { children: ReactNode }) => {
	const { userId } = useAuth()

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: 0 },
					mutations: { retry: 0 },
				},
			})
	)
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: getUrl("/api/trpc"),
					//https://monoexpo-kvy4yb52p-kalem-edlins-projects.vercel.app/
					// You can pass any HTTP headers you wish here
					async headers() {
						// const token = await getToken()
						return userId
							? {
									authorization: userId,
								}
							: {}
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
