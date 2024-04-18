import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { ReactNode, useState } from "react"
import { trpc } from "."

// TODO: Pass in authentication token here from userstorage
export const QueryProvider = ({ children }: { children: ReactNode }) => {
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
					url: "http://localhost:8081/api/trpc",
					//https://monoexpo-kvy4yb52p-kalem-edlins-projects.vercel.app/
					// You can pass any HTTP headers you wish here
					async headers() {
						return {
							// authorization: getAuthCookie(),
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
