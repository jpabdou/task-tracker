import Image from 'next/image'
import { currentUser } from '@clerk/nextjs';
import { SignIn } from '@clerk/nextjs';
export default async function Home() {
  const user = await currentUser();
  if (!user) return  <SignIn path="/" routing="path" signInUrl="/sign-in" afterSignUpUrl="/" />;
  return (
    <main className="w-full flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1>Welcome, {user.username}!</h1>
      <br/>
      <h1>Either click on:</h1>
        <ul>
          <li>• "Task List" link to view and modify tasks</li>
          <li>• Button to log out or manage account</li>
        </ul> 
    </main>
  )
}
