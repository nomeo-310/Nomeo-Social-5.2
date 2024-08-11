import React from "react";
import BookmarksClient from "./components/BookmarksClient";
import { getCurrentUser } from "@/lib/authAction";
import { Metadata } from "next";
import TrendsSideBar from "../components/TrendsSideBar";

export const metadata: Metadata = {
  title: "Bookmarks"
};

const Page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-md bg-card p-4 shadow-sm">
          <h2 className="font-bold text-2xl text-center">Bookmarks</h2>
        </div>
        <BookmarksClient currentUser={currentUser} />
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  );
};

export default Page;
