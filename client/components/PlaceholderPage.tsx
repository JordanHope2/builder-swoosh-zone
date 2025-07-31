import { Navigation } from './Navigation';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            This page is coming soon! Continue prompting to build out this section.
          </p>
          <div className="bg-white rounded-2xl p-8 border border-border">
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
