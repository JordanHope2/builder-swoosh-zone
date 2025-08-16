import { useEffect, useState } from 'react';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { Navigation } from '../components/Navigation';
import { FeaturedJobs } from '../components/FeaturedJobs';
import { HeroSection } from '../components/HeroSection';

// Initialize the Builder SDK with your public API key
builder.init(import.meta.env.VITE_BUILDER_API_KEY);

export default function Index() {
  const isPreviewing = useIsPreviewing();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const fetchedContent = await builder
          .get('page', {
            userAttributes: {
              urlPath: window.location.pathname,
            },
          })
          .toPromise();
        setContent(fetchedContent);
      } catch (error) {
        console.error('Builder.io content fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      {/* Render the Builder page */}
      <BuilderComponent model="page" content={content} />

      {/* You can still include components that are not part of the Builder content */}
      {/* For example, if HeroSection and FeaturedJobs are managed outside Builder */}
      {/* <HeroSection /> */}
      {/* <FeaturedJobs /> */}

      {/* If no Builder content is found, and not in preview, show a 404 or fallback */}
      {!content && !isPreviewing && (
        <div>
          <h1 className="text-2xl font-bold text-center p-8">Page Not Found</h1>
          <p className="text-center">
            The page you are looking for does not exist or has not been published in Builder.io.
          </p>
        </div>
      )}
    </>
  );
}
