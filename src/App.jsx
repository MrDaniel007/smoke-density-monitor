import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ShieldCheck, Flame, Wind, RotateCcw, Activity } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('home');
  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  // Функция для генерации звука тревоги (пищалка "ту-ту-ту")
  const startAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      const playBeep = () => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtxRef.current.currentTime); // Высокая нота для сирены
        
        gain.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.3);
      };

      playBeep();
      alarmIntervalRef.current = setInterval(playBeep, 400); // Пищит каждые 0.4 секунды
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };

  // Функция остановки звука
  const stopAlarmSound = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  // Переключение экранов с управлением звуком
  const handleSelectScreen = (nextScreen) => {
    stopAlarmSound();
    if (nextScreen === 'danger') {
      startAlarmSound();
    }
    setScreen(nextScreen);
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => stopAlarmSound();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans select-none overflow-x-hidden">
      
      {/* Шапка приложения */}
      <header className="text-center pt-2 sm:pt-4 pb-2">
        <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-emerald-300">GREEN-TECH SENSOR v2.8</span>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">Эко-Мониторинг Воздуха</h1>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto">
        
        {/* ЭКРАН 1: ГЛАВНОЕ МЕНЮ (ДВЕ КНОПКИ ДЛЯ ПРЕПОДАВАТЕЛЕЙ) */}
        {screen === 'home' && (
          <div className="w-full space-y-4 animate-fade-in">
            <p className="text-xs sm:text-sm text-center text-slate-400 mb-6 px-2">
              Выберите режим симуляции датчика для демонстрации комиссии:
            </p>

            {/* Кнопка 1: Опасный / токсичный дымомер */}
            <button
              onClick={() => handleSelectScreen('danger')}
              className="w-full bg-red-950/40 hover:bg-red-900/60 border-2 border-red-500/50 hover:border-red-400 p-4 sm:p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-95 shadow-lg group text-left"
            >
              <div className="bg-red-500/20 p-3 sm:p-3.5 rounded-xl text-red-400 group-hover:scale-110 transition-transform shrink-0">
                <Flame className="w-7 h-7 sm:w-8 sm:h-8" /></div>
              <div>
                <span className="font-bold text-sm sm:text-base block text-white">Тест у зоны выброса (ТЭЦ / Дым)</span>
                <span className="text-[11px] sm:text-xs text-red-300/80">Симуляция едкого дыма и токсичных газов</span>
              </div>
            </button>

            {/* Кнопка 2: Чистый воздух */}
            <button
              onClick={() => handleSelectScreen('clean')}
              className="w-full bg-emerald-950/40 hover:bg-emerald-900/60 border-2 border-emerald-500/50 hover:border-emerald-400 p-4 sm:p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-95 shadow-lg group text-left"
            >
              <div className="bg-emerald-500/20 p-3 sm:p-3.5 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                <Wind className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base block text-white">Тест чистой зоны (Контроль)</span>
                <span className="text-[11px] sm:text-xs text-emerald-300/80">Проверка нормального состава воздуха</span>
              </div>
            </button>
          </div>
        )}

        {/* ЭКРАН 2: ОПАСНОСТЬ / ТОКСИЧНЫЙ ГАЗ (С МИГАЛКОЙ И ЗВУКОМ) */}
        {screen === 'danger' && (
          <div className="w-full bg-red-950/50 border-2 border-red-500 rounded-3xl p-5 sm:p-6 text-center space-y-4 sm:space-y-5 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-[pulse_0.6s_infinite]">
            <div className="inline-flex p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 shadow-inner">
              <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
            </div>
            
            <div>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-red-400 uppercase block mb-1">КРИТИЧЕСКАЯ ТРЕВОГА • ШКАЛА БАХЕМА</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">Превышение плотности дыма!</h2>
            </div>

            <div className="bg-black/70 border border-red-500/40 rounded-2xl p-4 text-left space-y-2 text-xs sm:text-sm">
              <div className="text-red-300 font-bold flex items-center gap-1.5">
                <span>⚠️ Отчет оптического дымомера:</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                Зафиксированы едкие токсичные взвеси, оксиды углерода (<code className="text-red-400 font-bold">CO</code>) и сажевые микрочастицы. Шкала дымности превысила допустимый порог в 4.2 раза. Воздух опасен для дыхания!
              </p>
              <div className="pt-2 border-t border-red-900/60 flex justify-between text-[11px] sm:text-xs text-red-400 font-mono">
                <span>Шкала Бахема: 7.8 Б</span>
                <span>СТАТУС: ОПАСНО</span>
              </div>
            </div>

            {/* Кнопка возврата в центре */}
            <button
              onClick={() => handleSelectScreen('home')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Вернуться к выбору теста
            </button>
          </div>
        )}

        {/* ЭКРАН 3: ЧИСТЫЙ ВОЗДУХ (МЕДЛЕННЫЙ УСПОКАИВАЮЩИЙ ПУЛЬС) */}
        {screen === 'clean' && (
          <div className="w-full bg-emerald-950/40 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 text-center space-y-4 sm:space-y-5 shadow-[0_0_25px_rgba(16,185,129,0.2)] animate-[pulse_3s_infinite]"><div className="inline-flex p-3 sm:p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 shadow-inner">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            
            <div>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-emerald-400 uppercase block mb-1">СИСТЕМА В НОРМЕ • КОНТРОЛЬ КАЧЕСТВА</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">Воздух идеально чистый</h2>
            </div>

            <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-4 text-left space-y-2 text-xs sm:text-sm">
              <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                <span>🌿 Отчет фильтрационного модуля:</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                Многоступенчатая система фильтрации успешно нейтрализовала выбросы. Уровень задымленности равен нулю, состав газов полностью соответствует экологическим нормам.
              </p>
              <div className="pt-2 border-t border-emerald-900/60 flex justify-between text-[11px] sm:text-xs text-emerald-400 font-mono">
                <span>Шкала Бахема: 0.1 Б</span>
                <span>СТАТУС: ИДЕАЛЬНО</span>
              </div>
            </div>

            {/* Кнопка возврата в центре */}
            <button
              onClick={() => handleSelectScreen('home')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-xs sm:text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Вернуться к выбору теста
            </button>
          </div>
        )}

      </main>

      {/* Футер */}
      <footer className="text-center text-[10px] sm:text-xs text-slate-500 pb-2">
        GreenTech Project Defense © 2026
      </footer>

    </div>
  );
}