// Web Speech API for J.A.R.V.I.S. Voice Deck and User Speech-to-Text

export function speakJarvis(text, onStart, onEnd) {
  if (!('speechSynthesis' in window)) {
    if (onStart) onStart();
    setTimeout(() => { if (onEnd) onEnd(); }, 2000);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip code blocks or action markup from speech text for natural listening
  const cleanSpeechText = text
    .replace(/\[ACTION:[A-Z_]+\]/g, '')
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_#]/g, '')
    .trim();

  if (!cleanSpeechText) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;

  const voices = window.speechSynthesis.getVoices();
  // Try to find British English voice (Daniel / Oliver / Arthur / George / UK English)
  const preferredVoice = voices.find(v => 
    v.lang.includes('en-GB') || 
    v.name.includes('Daniel') || 
    v.name.includes('Oliver') ||
    v.name.includes('George') ||
    v.name.includes('UK English Male')
  ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(onResult, onStatusChange, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognizer = new SpeechRecognition();
  recognizer.continuous = false;
  recognizer.interimResults = false;
  recognizer.lang = 'en-US';

  recognizer.onstart = () => {
    if (onStatusChange) onStatusChange('listening');
  };

  recognizer.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  recognizer.onerror = (event) => {
    if (onError) onError(event.error);
    if (onStatusChange) onStatusChange('idle');
  };

  recognizer.onend = () => {
    if (onStatusChange) onStatusChange('idle');
  };

  return recognizer;
}

