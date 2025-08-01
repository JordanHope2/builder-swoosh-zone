import { useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { PlaceholderPage } from '../components/PlaceholderPage';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <PlaceholderPage 
        title={`Company Profile #${id}`}
        description="Detailed company information, culture insights, open positions, and employee reviews."
      />
    </main>
  );
}
