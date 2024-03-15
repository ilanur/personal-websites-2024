export async function load() {
	const res = await fetch('https://dummyjson.com/users?limit=50');
	const users = await res.json();

	return {
		users: users.users
	};
}
