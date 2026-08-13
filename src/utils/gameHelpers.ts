import { FEEDBACK_AUDIO } from '../data/numbersData';
import { playMP3, playSuccessKidsSFX, playLevelUpSFX } from './mp3Player';

let positiveToggle = false;

export function playAudioWithPromise(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!url) {
      resolve();
      return;
    }

    const audio = playMP3(url);

    if (!audio) {
      resolve();
      return;
    }

    if (audio.ended) {
      resolve();
      return;
    }

    let resolved = false;
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      clearTimeout(fallbackTimer);
      resolve();
    };

    const handleEnded = () => {
      cleanup();
    };

    const handleError = () => {
      cleanup();
    };

    // Safe fallback timeout (4 seconds) in case audio fails to load or play
    const fallbackTimer = setTimeout(() => {
      cleanup();
    }, 4000);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
  });
}

export function playPositiveFeedback(): Promise<void> {
  // Alternating between 01_raea and 02_momtaz
  positiveToggle = !positiveToggle;
  const chosenAudio = positiveToggle ? FEEDBACK_AUDIO.raea : FEEDBACK_AUDIO.momtaz;
  return playAudioWithPromise(chosenAudio);
}

export function playNegativeFeedback(): Promise<void> {
  return playAudioWithPromise(FEEDBACK_AUDIO.hawelMarraOkhra);
}

export function playNegativeNextQuestionFeedback(): Promise<void> {
  return playAudioWithPromise(FEEDBACK_AUDIO.hawelMarraOkhraFelSoalEltaly);
}

export function playNextStageFeedback(): Promise<void> {
  playLevelUpSFX();
  return playAudioWithPromise(FEEDBACK_AUDIO.elmarhalaEltalya);
}

export function playMicrophoneUnclearFeedback(): Promise<void> {
  return playAudioWithPromise(FEEDBACK_AUDIO.microphoneUnclear);
}


