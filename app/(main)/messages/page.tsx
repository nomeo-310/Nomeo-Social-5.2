import { Metadata } from "next";
import React from "react";
import Chat from "./components/Chat";
import { getCurrentUser } from "@/lib/authAction";

export const metadata: Metadata = {
  title: "Messages",
};

const page = async () => {
  const currentUser = await getCurrentUser();

  return <Chat currentUser={currentUser}/>;
};

export default page;
