import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SongFavorites from "../SongFavorites";
import { Music } from "lucide-react";

export const metadata: Metadata = {
  title: "My Favorite Songs",
  description: "Save and manage your favorite songs",
};

export default async function SongFavoritesPage() {
  const session = await auth();

  // Protect the page - only logged-in users can access
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/favorites/songs");
  }

  return (
    <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Music className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          My Favorite Songs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Save and manage your favorite songs
        </p>
      </div>

      <SongFavorites />
    </div>
  );
}

