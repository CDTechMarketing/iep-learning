import { useState, useCallback } from 'react';
import { useStore } from '../store';
import { SensoryBreak } from '../components/SensoryBreak';
import { BreakPrompt } from '../components/BreakPrompt';

interface UseBreakFlowProps {
  onContinue: () => void;
}

export function useBreakFlow({ onContinue }: UseBreakFlowProps) {
  const { settings } = useStore();
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [showBreakActivity, setShowBreakActivity] = useState(false);

  const noteItemCompleted = useCallback(() => {
    const newItemsCompleted = itemsCompleted + 1;
    setItemsCompleted(newItemsCompleted);

    const interval = settings?.breakPromptInterval;
    if (interval && newItemsCompleted % interval === 0) {
      setShowBreakPrompt(true);
      return 'break-due';
    }
    return 'continue';
  }, [itemsCompleted, settings?.breakPromptInterval]);

  const handleBreakContinue = useCallback(() => {
    setShowBreakPrompt(false);
    setShowBreakActivity(false);
    onContinue();
  }, [onContinue]);

  const handleTakeBreak = useCallback(() => {
    setShowBreakActivity(true);
  }, []);

  const breakUi = showBreakActivity ? (
    <SensoryBreak onComplete={handleBreakContinue} />
  ) : showBreakPrompt ? (
    <BreakPrompt onTakeBreak={handleTakeBreak} onContinue={handleBreakContinue} />
  ) : null;

  return {
    itemsCompleted,
    setItemsCompleted,
    showBreakPrompt,
    setShowBreakPrompt,
    showBreakActivity,
    setShowBreakActivity,
    noteItemCompleted,
    handleBreakContinue,
    handleTakeBreak,
    breakUi
  };
}
