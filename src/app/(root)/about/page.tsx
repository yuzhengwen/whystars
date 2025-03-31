import { getAllUsers } from "@/actions/timetable";

export default async function Home() {
  const users = await getAllUsers(); // Fetch user timetables for user with ID 1
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
      <p>{JSON.stringify(users)}</p>
    </div>
  );
}
