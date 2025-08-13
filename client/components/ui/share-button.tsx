import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  MessageCircle, 
  Mail, 
  Linkedin, 
  Twitter,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { applicationToast } from '../../hooks/use-toast';

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

interface ShareButtonProps {
  shareData: ShareData;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const socialPlatforms = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-600 hover:bg-blue-700',
    getUrl: (data: ShareData) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-600 hover:bg-green-700',
    getUrl: (data: ShareData) => 
      `https://wa.me/?text=${encodeURIComponent(`${data.title} ${data.url}`)}`
  },
  {
    name: 'Email',
    icon: Mail,
    color: 'bg-gray-600 hover:bg-gray-700',
    getUrl: (data: ShareData) => 
      `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.text || ''}\n\n${data.url}`)}`
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-black hover:bg-gray-800',
    getUrl: (data: ShareData) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`
  }
];

export function ShareButton({ shareData, className, variant = 'default', size = 'md' }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: 'bg-jobequal-green text-white hover:bg-jobequal-green-hover',
    outline: 'border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white',
    ghost: 'text-jobequal-green hover:bg-jobequal-green-light'
  };

  const handleShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        applicationToast.info('Shared successfully', 'Content shared via native sharing');
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to modal
        if ((error as Error).name !== 'AbortError') {
          console.warn('Web Share API failed:', error);
        }
      }
    }

    // Fallback to custom share modal
    setIsModalOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setIsCopied(true);
      applicationToast.info('Link copied', 'URL copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      applicationToast.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
    const url = platform.getUrl(shareData);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
    applicationToast.info('Opening share window', `Sharing via ${platform.name}`);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={cn(
          'inline-flex items-center space-x-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-label={`Share ${shareData.title}`}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              role="dialog"
              aria-labelledby="share-modal-title"
              aria-describedby="share-modal-description"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 id="share-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                  Share this job
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close share modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p id="share-modal-description" className="text-gray-600 dark:text-gray-300 mb-6">
                {shareData.title}
              </p>

              {/* Copy Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareData.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={cn(
                      'px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm',
                      isCopied
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    )}
                    aria-label={isCopied ? 'Link copied' : 'Copy link'}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Social Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Share via
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => handleSocialShare(platform)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105',
                        platform.color
                      )}
                    >
                      <platform.icon className="w-5 h-5" />
                      <span>{platform.name}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Specialized share buttons for common use cases
export function JobShareButton({ job }: { job: { id: string; title: string; company: string } }) {
  const shareData: ShareData = {
    title: `${job.title} at ${job.company}`,
    text: `Check out this amazing job opportunity!`,
    url: `${window.location.origin}/job/${job.id}`
  };

  return (
    <ShareButton 
      shareData={shareData} 
      variant="ghost" 
      size="sm"
      className="text-gray-600 hover:text-jobequal-green"
    />
  );
}

export function CompanyShareButton({ company }: { company: { id: string; name: string } }) {
  const shareData: ShareData = {
    title: `${company.name} - Company Profile`,
    text: `Discover career opportunities at ${company.name}`,
    url: `${window.location.origin}/company/${company.id}`
  };

  return (
    <ShareButton 
      shareData={shareData} 
      variant="outline" 
      size="md"
    />
  );
}
