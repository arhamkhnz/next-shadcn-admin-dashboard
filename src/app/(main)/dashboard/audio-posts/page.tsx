import postsData from "./_components/posts-table/data.json";
import type { PostRow } from "./_components/posts-table/schema";
import { PostsTable } from "./_components/posts-table/table";

export default function AudioPostsPage() {
  const posts = postsData as PostRow[];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audio Posts</h1>
        <p className="text-muted-foreground">Monitor and moderate audio content posted by users.</p>
      </div>
      <PostsTable data={posts} />
    </div>
  );
}
