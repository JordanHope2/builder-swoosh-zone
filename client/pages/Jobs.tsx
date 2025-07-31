import { Navigation } from '../components/Navigation';

export default function Jobs() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Browse Jobs
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            This page is coming soon! Continue prompting to build out this section.
          </p>
          <div className="bg-white rounded-2xl p-8 border border-border">
            <p className="text-muted-foreground">
              The jobs listing page will include advanced filters, search functionality, 
              and detailed job descriptions. Ask me to implement specific features for this page!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
