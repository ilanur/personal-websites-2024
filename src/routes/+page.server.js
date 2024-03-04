export async function load() {
	const res = await fetch('https://dummyjson.com/users?limit=50');
	const students = await res.json();

	return {
		students: students.users
	};
}
