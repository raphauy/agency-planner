"use client"

import { PublicationDAO } from "@/services/publication-services";
import FeedBox from "./feed-box";

interface FeedProps{
  title: string
  posts: PublicationDAO[]
}

export default function Feed({ title, posts }: FeedProps) {

  return (
    <div className="pt-2 border justify-self-center w-full h-fit rounded-xl border-gray-300 dark:bg-black bg-white pb-2 min-w-[370px] max-w-[500px]">
      <p className="mb-2 h-14 flex items-center justify-center">{title}</p>

      <div  className="grid grid-cols-3 gap-1 p-2 overflow-auto max-h-[330px] md:max-h-[800px]">
        {posts.map((post) => (
          <FeedBox
            key={post.id}
            post={post}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-4">No hay publicaciones aún</p>
        </div>
      )}

    </div>
  );
}
