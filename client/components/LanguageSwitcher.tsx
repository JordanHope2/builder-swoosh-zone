import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, languages } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageChange = (language: typeof languages[0]) => {
    setLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral transition-all duration-200"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-jobequal-neutral-dark z-20 py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full px-4 py-3 text-left hover:bg-jobequal-neutral transition-colors duration-150 ${
                  currentLanguage.code === language.code 
                    ? 'bg-jobequal-green-light text-jobequal-green-dark font-medium' 
                    : 'text-jobequal-text'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{language.nativeLabel}</span>
                  <span className="text-sm text-jobequal-text-muted uppercase">
                    {language.code}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
