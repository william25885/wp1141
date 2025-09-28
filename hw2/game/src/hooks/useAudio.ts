import { useEffect, useRef, useState } from 'react';

interface AudioHookReturn {
  isPlaying: boolean;
  startMusic: () => void;
  stopMusic: () => void;
}

export const useAudio = (): AudioHookReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const createAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const startMusic = () => {
    // 如果已經在播放，先停止
    if (isPlaying) {
      stopMusic();
    }

    try {
      const audioContext = createAudioContext();
      
      // 創建簡單的愉快旋律
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        // 音量包絡
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const playMelody = () => {
        const currentTime = audioContext.currentTime;
        
        // 愉快的旋律
        const melody = [
          { freq: 523.25, time: 0 },    // C5
          { freq: 659.25, time: 0.5 },   // E5
          { freq: 783.99, time: 1.0 },   // G5
          { freq: 659.25, time: 1.5 },   // E5
          { freq: 523.25, time: 2.0 },   // C5
          { freq: 440.00, time: 2.5 },   // A4
          { freq: 523.25, time: 3.0 },   // C5
          { freq: 659.25, time: 3.5 },   // E5
          { freq: 783.99, time: 4.0 },   // G5
          { freq: 880.00, time: 4.5 },   // A5
          { freq: 783.99, time: 5.0 },   // G5
          { freq: 659.25, time: 5.5 },   // E5
          { freq: 523.25, time: 6.0 },   // C5
          { freq: 440.00, time: 6.5 },   // A4
          { freq: 392.00, time: 7.0 },   // G4
          { freq: 440.00, time: 7.5 },   // A4
        ];

        melody.forEach(note => {
          playNote(note.freq, currentTime + note.time, 0.4);
        });
      };

      playMelody();
      setIsPlaying(true);

      // 8秒後重複播放
      intervalRef.current = window.setInterval(() => {
        playMelody();
      }, 8000);

    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const stopMusic = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    
    // 停止所有正在播放的音頻
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
        audioContextRef.current = null;
      } catch (error) {
        console.log('Error closing audio context:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  return {
    isPlaying,
    startMusic,
    stopMusic,
  };
};
