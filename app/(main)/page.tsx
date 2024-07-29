import { getCurrentUser } from "@/lib/authAction";

export default async function Home () {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello Home Page!!!</p>
    </main>
  );
}
