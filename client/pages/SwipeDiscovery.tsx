import { Navigation } from '../components/Navigation';
import EnhancedSwipeDiscovery from '../components/EnhancedSwipeDiscovery';
import { PageTransition } from '../components/ui/enhanced-motion';

export default function SwipeDiscovery() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        <Navigation />
        <EnhancedSwipeDiscovery />
      </main>
    </PageTransition>
  );
}
