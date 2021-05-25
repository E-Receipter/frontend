export async function handle({ request, render }) {
    const response = await render(request);
	return {
		...response,
		headers: {
			...response.headers,
		}
	};
}