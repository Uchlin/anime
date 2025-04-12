import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Navbar } from "./_components/navbar";
import { SigninLink } from "./_components/signlink";
import { db } from "~/server/db";

export default async function Home() {
  return (
    <h1>Main page</h1>
  );
}
