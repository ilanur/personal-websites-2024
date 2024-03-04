export async function load({ params }) {
	const res = await fetch(`https://dummyjson.com/users/${params.studentId}`);
	const student = await res.json();

	return {
		student
	};
}
