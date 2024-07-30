import { getCurrentUser } from "@/lib/authAction";
import PostEditor from "./components/PostEditor";
import TrendsSideBar from "./components/TrendsSideBar";
import PostFeeds from "./components/PostFeeds";

export default async function Home () {
  const currentUser = await getCurrentUser();

  return (
    <main className="w-full min-w-0 flex gap-4 ">
      <div className="w-full min-w-0 space-y-4">
        <PostEditor currentUser={currentUser}/>
        <PostFeeds/>
      </div>
      <TrendsSideBar/>
    </main>
  );
}
