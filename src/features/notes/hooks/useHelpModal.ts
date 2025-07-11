import { useState, useEffect } from 'react';

export const useHelpModal = () => {
  const [hasSeenHelp, setHasSeenHelp] = useState<boolean>(false);
  const [showResizeHelp, setShowResizeHelp] = useState<boolean>(false);
  const [manualHelp, setManualHelp] = useState<boolean>(false);

  useEffect(() => {
    // Load the hasSeenHelp state from localStorage when component mounts
    const helpSeen = localStorage.getItem('ghostnote-help-seen') === 'true';
    if (helpSeen) {
      setHasSeenHelp(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ghostnote-help-seen', hasSeenHelp ? 'true' : 'false');
  }, [hasSeenHelp]);

  const openHelpModal = () => {
    setShowResizeHelp(true);
    setManualHelp(true);
  };

  const closeHelpModal = () => {
    setShowResizeHelp(false);
    setManualHelp(false);
    setHasSeenHelp(true);
    localStorage.setItem('ghostnote-help-seen', 'true');
  };

  return {
    hasSeenHelp,
    showResizeHelp,
    manualHelp,
    openHelpModal,
    closeHelpModal
  };
};
