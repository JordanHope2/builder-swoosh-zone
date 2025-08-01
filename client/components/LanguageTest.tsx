import { useLanguage } from '../contexts/LanguageContext';

export function LanguageTest() {
  const { currentLanguage, t } = useLanguage();

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-w-sm z-50">
      <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
        Language Test
      </h3>
      <div className="space-y-1 text-sm">
        <div>
          <strong>Current:</strong> {currentLanguage.nativeLabel} ({currentLanguage.code})
        </div>
        <div>
          <strong>Browse Jobs:</strong> {t('nav.browse_jobs')}
        </div>
        <div>
          <strong>Sign In:</strong> {t('nav.sign_in')}
        </div>
        <div>
          <strong>Save:</strong> {t('common.save')}
        </div>
        <div>
          <strong>Hero Title:</strong> {t('hero.title')}
        </div>
      </div>
    </div>
  );
}
