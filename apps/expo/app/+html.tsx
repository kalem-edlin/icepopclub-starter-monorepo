// @ts-ignore
export default function Root({ children }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="apple-itunes-app" content="app-id=<app linking id>" />
			</head>
			<body>{children}</body>
		</html>
	)
}