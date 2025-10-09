import Intro from "@/components/intro";
import RecentPosts from "@/components/recent-posts";
import { MDXRemote } from "next-mdx-remote/rsc";


export default function Home() {
  
  return (
      <section className="py-24">
        <div className="container max-w-3xl">
          <Intro/>
          <RecentPosts/>
        </div>
      </section>
  );
}
