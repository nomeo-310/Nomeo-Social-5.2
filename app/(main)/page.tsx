import { getCurrentUser } from "@/lib/authAction";
import TrendsSideBar from "./components/TrendsSideBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostEditor from "./posts/components/PostEditor";
import PostFeeds from "./posts/components/PostFeeds";
import FollowingFeeds from "./posts/components/FollowingFeeds";

export default async function Home () {
  const currentUser = await getCurrentUser();

  return (
    <main className="w-full min-w-0 flex gap-4 ">
      <div className="w-full min-w-0 space-y-4">
        <PostEditor currentUser={currentUser}/>
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <PostFeeds currentUser={currentUser}/>
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeeds currentUser={currentUser}/>
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  );
}
