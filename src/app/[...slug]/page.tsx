import { notFound } from 'next/navigation';
import { BuilderComponent, builder } from '@builder.io/react';

// Initialize Builder.io
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const urlPath = '/' + (params.slug?.join('/') ?? '');
  const content = await builder
    .get('page', { url: urlPath, options: { includeUnpublished: true } })
    .toPromise();

  if (!content) return notFound();
  return <BuilderComponent model="page" content={content} />;
}
