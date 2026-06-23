import { BlogDraftDetail } from "@/components/BlogDraftDetail";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BlogDraftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BlogDraftDetail draftId={id} />
    </div>
  );
}
