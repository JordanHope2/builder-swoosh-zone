import { notFound } from 'next/navigation';
import { Content, fetchOneEntry } from '@builder.io/sdk-react';

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const urlPath = '/' + (params.slug?.join('/') ?? '');
  const content = await fetchOneEntry({
    model: 'page',
    apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
    userAttributes: { urlPath },
  });

  if (!content) return notFound();
  return <Content model="page" content={content} apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!} />;
}
