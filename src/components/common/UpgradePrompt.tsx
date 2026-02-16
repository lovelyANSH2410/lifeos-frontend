import React from 'react';
import { createPortal } from 'react-dom';
import { Crown, X, Zap } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { useScreenSize } from '@/hooks/useScreenSize';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  currentCount: number;
  limit: number;
  onUpgrade?: () => void;
  isFeatureBlocked?: boolean; // For features completely blocked (vault, documents)
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  featureName,
  currentCount,
  limit,
  onUpgrade,
  isFeatureBlocked = false
}) => {
  const screenSize = useScreenSize();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
    onClose();
  };

  const content = (
    <div className={`${screenSize === 'mobile' ? 'p-4' : 'p-6'} space-y-4`}>
      <div className={`flex items-center justify-center ${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-4`}>
        <Crown className={`${screenSize === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
      </div>

      <h3 className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white text-center`}>
        {isFeatureBlocked ? 'Feature Locked' : 'Limit Reached'}
      </h3>

      {isFeatureBlocked ? (
        <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
          <span className="font-bold text-white">{featureName}</span> is only available in PRO/COUPLE/LIFETIME plans. Upgrade to unlock this feature.
        </p>
      ) : (
        <>
          <div className="modern-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-400`}>Current Usage</span>
              <span className={`${screenSize === 'mobile' ? 'text-sm' : 'text-base'} font-bold text-white`}>
                {currentCount} / {limit}
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (currentCount / limit) * 100)}%` }}
              />
            </div>
            <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-gray-500 text-center`}>
              You've reached your limit of {limit} {featureName.toLowerCase()}
            </p>
          </div>

          <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
            Upgrade to PRO/COUPLE/LIFETIME for unlimited access to {featureName.toLowerCase()}.
          </p>
        </>
      )}

      <div className="space-y-2">
        <button
          onClick={handleUpgrade}
          className={`w-full ${screenSize === 'mobile' ? 'py-2.5 text-sm' : 'py-3'} bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
        >
          <Zap className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          Upgrade Now
        </button>
        <button
          onClick={onClose}
          className={`w-full ${screenSize === 'mobile' ? 'py-2 text-xs' : 'py-2.5 text-sm'} bg-white/5 text-gray-400 rounded-xl font-medium hover:bg-white/10 transition-all`}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );

  if (screenSize === 'mobile') {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={isFeatureBlocked ? 'Feature Locked' : 'Limit Reached'}
        maxHeight="60vh"
      >
        {content}
      </BottomSheet>
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#0F131F] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className={`${screenSize === 'mobile' ? 'p-4' : 'p-6'} space-y-4`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white`}>
              {isFeatureBlocked ? 'Feature Locked' : 'Limit Reached'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
            </button>
          </div>
          {content}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpgradePrompt;
