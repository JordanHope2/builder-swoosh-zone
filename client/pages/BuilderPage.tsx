import { useEffect, useState } from 'react';
import { BuilderComponent, builder, BuilderContent } from '@builder.io/sdk';
import { useLocation } from 'react-router-dom';
import { builderConfig } from '../lib/builderConfig';

builder.init(builderConfig.apiKey);

export function BuilderPage() {
  const [content, setContent] = useState<BuilderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      const fetchedContent = await builder
        .get('page', {
          userAttributes: {
            urlPath: location.pathname,
          },
        })
        .toPromise();

      setContent(fetchedContent);
      setLoading(false);
    }
    fetchContent();
  }, [location.pathname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!content) {
    return <p>Page not found.</p>;
  }

  return <BuilderComponent model="page" content={content} />;
}
