import React, { useState, useRef, useEffect } from 'react';
import { EvidencePhoto, SeverityLevel } from '../types';

interface RuggedCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvidence: (evidence: EvidencePhoto) => void;
  folio: string;
  vin: string;
  defaultSubsystem?: string;
  technicianName?: string;
}

const PRESET_OBSERVATIONS = [
  'Sulfatación severa visible en terminal positivo Anderson SB50',
  'Desgaste crítico >85% en pastillas frontales de freno CBS',
  'Desfase angular sostenido de 18° en sensor Hall #2 con jitter',
  'Fuga de aislamiento eléctrico <120 kΩ en fase U de estator',
  'Alineación micrométrica 0.2 mm en eje basculante conforme',
  'Presión verificada: 32 PSI delantero / 36 PSI trasero',
  'Sellado IP67 con barniz dieléctrico 3M verificado sin fisuras',
  'Grabado láser de chasis legible y sin marcas de alteración',
];

const PRESET_SAMPLE_PHOTOS = [
  {
    name: 'Conector Anderson (Sulfatado)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFhdyXL5OyFXB_BBZ0KMGEW1cT9ow_yUmTZAfjWH8OErHU1KJ4CZ1EgcdQfbSjCfM2kIxfjtdekoL2smYHHY6XTJzJfChJsGEu-qDpv2thDuw8Czmdh4sS96kMpMXpIROqhe2R-x-AHOS4hcCCj_GhUNQ1EQD5MFmAwsBxbUc4Z1iHpqhhE2RTaWpXZgUjSe1XaLApB1HSnD-cf-W2Giajgc21ksBANDKugZNDxu8BKBadLizTbCun',
    obs: 'Sulfatación en terminal (+) con caída de tensión en marcha.',
    subsystem: 'Batería & Puerto Anderson SB50',
    severity: 'regular' as SeverityLevel,
  },
  {
    name: 'Megóhmetro 1000V HV',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp-6GxLzuBtKakytCV5iwzeU_Ka-XyOlccvk-yGNZnPc-ODCAehkegLsdfMGmFVJcRWDIUity6v5bo0a7XILLIPsp8Sf-jEVt816KwbbDcsGeA8xDgFdv26fetc8PjgmXl6pjSle5sAiP1G5iA-pgl1WfzF7M84hf33FtFDBsYtulhFET2pF0zthUKk3GNeluWqtoTTv3XHhP1A0JOAvfeyXlc6R2opkQBzEVFuRVrxn1zxA8xOXVf',
    obs: 'Prueba dieléctrica 1000V DC arrojó 920 MΩ. Margen de seguridad +84%.',
    subsystem: 'Potencia HV (Motor HUB 4kW & FOC)',
    severity: 'bueno' as SeverityLevel,
  },
  {
    name: 'Mordaza & Pastilla Freno',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGocjgzDKbHU7PVxL4QR5ruTQbu1qZ9WXjC05ozZBhZEeNG9mwKCqO-rCIa9EhvPetQv7IQbGefeH7AuYdnlO3_9DobUQuHu9nLPf2SUhdqLucOZ5Mq6a9-RBeFOclsdVYW5QDg6PT4m4eNz8p6mpbWzy4Gve56itFNb3t8_Zg2-p-lW3VRok8OUYX_VNVIfWPVtCWT5wneoMf0j_U1BUAUqwe4hggiqnTOLtP7Njptw6ZiZWCvVM5',
    obs: 'Montaje de mordaza frontal cerámico. Purga de líquido DOT 4 OK.',
    subsystem: 'Frenos Hidráulicos & Regen (CBS)',
    severity: 'bueno' as SeverityLevel,
  },
  {
    name: 'Pack Batería Tracción Li-Ion',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGiemR-DYyX8rnD-Hq5K5ldZRW7ESbFp06Gh9aXFX7b0PFutYDqE_zrnaWfEPndzTTm3gPjl_OvRt4q9Dt3v2IP1mzJv2TZ3LnZqFtklBAzVZYXl3p6Ja8ZfZcmHVL6dA3nn4DCm_tqj7cfMaiA32vFxJ_Zszs2b0Haw3l6lXuY_dD-0IZTyJqYdzElJi5esGBG2cQCkhCO7LywaRhGH7aRVsq72o34Tg7A2PcvUUAEPnFTGwYtfUU',
    obs: 'Inspección de celdas CATL en serie. Delta celda 4 mV nominal.',
    subsystem: 'Batería & Puerto Anderson SB50',
    severity: 'bueno' as SeverityLevel,
  },
];

const SUBSYSTEM_OPTIONS = [
  'Potencia HV (Motor HUB 4kW & FOC)',
  'Frenos Hidráulicos & Regen (CBS)',
  'Batería & Puerto Anderson SB50',
  'Chasis, Horquilla & Neumáticos',
  'Alumbrado Full LED & Bocina',
  'Controlador FOC & Arnés Naranja 1000V',
  'Odómetro & Display Digital',
  'Aislamiento Dieléctrico (Megóhmetro)',
];

export const RuggedCameraModal: React.FC<RuggedCameraModalProps> = ({
  isOpen,
  onClose,
  onSaveEvidence,
  folio,
  vin,
  defaultSubsystem,
  technicianName = 'Roberto Soto',
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [subsystem, setSubsystem] = useState<string>(defaultSubsystem || SUBSYSTEM_OPTIONS[0]);
  const [observation, setObservation] = useState<string>('');
  const [severity, setSeverity] = useState<SeverityLevel>('bueno');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (defaultSubsystem) {
      setSubsystem(defaultSubsystem);
    }
  }, [defaultSubsystem]);

  // Start camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setObservation('');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Cámara web no soportada en este entorno. Puedes cargar imagen desde archivo o usar plantillas de taller.');
      }
    } catch (err) {
      console.warn('Camera error, using fallbacks:', err);
      setCameraError('Permiso de cámara no concedido o no disponible. Puedes subir imagen o usar presets de taller.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Industrial Technical Watermark Overlay
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        
        // Semi-transparent banner at bottom
        ctx.fillStyle = 'rgba(6, 14, 32, 0.85)';
        ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

        // Technical borders
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

        // Corner markings
        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText(`VOLTECH DYNAMICS // BAY-03`, 16, 26);
        ctx.fillText(`FOLIO: ${folio}`, canvas.width - 240, 26);

        // Bottom text
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillStyle = '#c3f5ff';
        ctx.fillText(`VIN: ${vin}  |  SUBSYSTEM: ${subsystem.slice(0, 26)}`, 16, canvas.height - 42);
        ctx.fillStyle = '#a8ffd2';
        ctx.fillText(`DATE: ${timestamp}  |  TECH: ${technicianName}  |  STATUS: ${severity.toUpperCase()}`, 16, canvas.height - 18);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLE_PHOTOS[0]) => {
    setCapturedImage(preset.url);
    setObservation(preset.obs);
    setSubsystem(preset.subsystem);
    setSeverity(preset.severity);
  };

  const handleSimulateVoice = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const randomNote = PRESET_OBSERVATIONS[Math.floor(Math.random() * PRESET_OBSERVATIONS.length)];
      setObservation((prev) => (prev ? `${prev} • ${randomNote}` : randomNote));
    }, 1200);
  };

  const handleSave = () => {
    if (!capturedImage) return;
    if (!observation.trim()) {
      alert('REGLA DE TALLER: Todo lo que se ve o se inspecciona se debe evidenciar con una imagen y su OBSERVACIÓN técnica obligatoria.');
      return;
    }

    const newEvidence: EvidencePhoto = {
      id: 'ev-' + Date.now(),
      title: subsystem.toUpperCase(),
      category: 'Inspección Taller',
      imageUrl: capturedImage,
      observation: observation.trim(),
      timestamp: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      technicianName,
      subsystemTag: subsystem,
      severity,
    };

    onSaveEvidence(newEvidence);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Rugged Camera Bar */}
      <div className="bg-surface-container-lowest/90 px-4 py-3 border-b border-surface-variant flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-primary text-sm tracking-wider uppercase">
              CÁMARA DE INSPECCIÓN RUGERIZADA
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              FOLIO: {folio} • VIN: {vin}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface hover:text-error flex items-center justify-center transition-colors"
          title="Cerrar cámara"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col p-4 max-w-xl mx-auto w-full gap-3">
        {/* Subsystem Picker Header */}
        <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-1.5 border border-surface-variant/40">
          <label className="text-xs font-mono text-on-surface-variant uppercase flex items-center justify-between">
            <span>Punto de Inspección / Subsistema</span>
            <span className="text-primary font-bold">REGLA DE EVIDENCIA 100%</span>
          </label>
          <select
            value={subsystem}
            onChange={(e) => setSubsystem(e.target.value)}
            className="w-full h-11 bg-surface-container-highest text-on-surface font-semibold text-sm px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {SUBSYSTEM_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Viewfinder or Preview Box */}
        <div className="relative w-full aspect-[4/3] bg-surface-container-lowest rounded-xl overflow-hidden border-2 border-primary-container/40 flex items-center justify-center shadow-2xl">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img src={capturedImage} alt="Captura de inspección" className="w-full h-full object-contain" />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest/80 text-secondary font-mono text-xs flex items-center gap-1.5 hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                Volver a capturar
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
              
              {/* HUD / Reticle Target Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-start font-mono text-[10px] text-primary-container/80">
                  <span>[EV-INSPEC: ACTIVE]</span>
                  <span>ISO 6469-1 // QC-PASS</span>
                </div>

                {/* Center crosshair */}
                <div className="self-center flex items-center justify-center">
                  <div className="w-24 h-24 border border-primary-container/60 rounded-lg relative flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-primary-container"></div>
                    <div className="h-3 w-0.5 bg-primary-container absolute"></div>
                    <span className="absolute -bottom-5 font-mono text-[9px] text-primary">ENFOQUE MACRO</span>
                  </div>
                </div>

                <div className="flex justify-between items-end font-mono text-[10px] text-primary-container/80">
                  <span>ZOOM: {zoomLevel}X</span>
                  <span>72V HV READY</span>
                </div>
              </div>

              {/* Shutter Button floating */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-6">
                {/* Torch Toggle */}
                <button
                  onClick={() => setTorchEnabled(!torchEnabled)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    torchEnabled ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high/80 text-on-surface'
                  }`}
                  title="Flash de taller"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {torchEnabled ? 'flash_on' : 'flash_off'}
                  </span>
                </button>

                {/* Big Shutter Button */}
                <button
                  onClick={takeSnapshot}
                  className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform ring-4 ring-primary-container/40"
                  title="Tomar Foto"
                >
                  <span className="material-symbols-outlined text-[32px]">photo_camera</span>
                </button>

                {/* Zoom Cycle */}
                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
                  className="w-11 h-11 rounded-full bg-surface-container-high/80 text-primary font-mono text-xs font-bold flex items-center justify-center"
                  title="Aumentar zoom"
                >
                  {zoomLevel}X
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Upload or Sample Preset Quick Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-on-surface-variant">¿Cámara bloqueada o sin dispositivo?</span>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-xs font-mono flex items-center gap-1.5 hover:bg-surface-bright"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Subir Archivo
              </button>
            </div>
          </div>

          {/* Quick Presets for EV Bay */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_SAMPLE_PHOTOS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container text-left shrink-0 text-xs text-on-surface border border-surface-variant hover:border-primary transition-colors"
              >
                <img src={p.url} alt={p.name} className="w-8 h-8 rounded object-cover" />
                <div className="flex flex-col">
                  <span className="font-bold truncate max-w-[120px]">{p.name}</span>
                  <span className="text-[10px] text-tertiary uppercase font-mono">{p.severity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Selector */}
        <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-2 border border-surface-variant/40">
          <span className="text-xs font-mono text-on-surface-variant uppercase">
            Dictamen Técnico de Estado
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setSeverity('bueno')}
              className={`h-11 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                severity === 'bueno'
                  ? 'bg-tertiary text-on-tertiary shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              BUENO
            </button>
            <button
              type="button"
              onClick={() => setSeverity('regular')}
              className={`h-11 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                severity === 'regular'
                  ? 'bg-secondary-container text-on-secondary-container shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              REGULAR
            </button>
            <button
              type="button"
              onClick={() => setSeverity('malo')}
              className={`h-11 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                severity === 'malo'
                  ? 'bg-error-container text-on-error-container shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
              MALO
            </button>
            <button
              type="button"
              onClick={() => setSeverity('critico')}
              className={`h-11 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                severity === 'critico'
                  ? 'bg-error text-on-error shadow-md ring-2 ring-error'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
              CRÍTICO
            </button>
          </div>
        </div>

        {/* MANDATORY OBSERVATION FIELD */}
        <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-2 border-2 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">edit_note</span>
              <span className="text-xs font-mono font-bold text-primary uppercase">
                Observación Técnica Obligatoria *
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulateVoice}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                isRecordingVoice
                  ? 'bg-error text-on-error animate-pulse'
                  : 'bg-surface-container-high text-primary-container hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
              {isRecordingVoice ? 'Grabando audio...' : 'Dictar Nota (0:14)'}
            </button>
          </div>

          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Describa el hallazgo visual, mediciones con multímetro/megóhmetro, desgaste o anomalía detectada..."
            rows={3}
            className="w-full bg-surface-container-lowest text-on-surface font-body p-2.5 rounded-lg border border-surface-variant focus:outline-none focus:border-primary text-sm placeholder:text-outline"
          />

          {/* Preset quick tag pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-outline self-center mr-1">Rápidos:</span>
            {PRESET_OBSERVATIONS.slice(0, 4).map((phrase, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setObservation(phrase)}
                className="text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-1 rounded hover:bg-primary-container hover:text-on-primary transition-colors truncate max-w-[240px]"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Save / Confirm Button */}
      <div className="bg-surface-container-lowest p-4 border-t border-surface-variant shrink-0 max-w-xl mx-auto w-full flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={!capturedImage || !observation.trim()}
          className={`w-full h-14 rounded-xl font-headline text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
            capturedImage && observation.trim()
              ? 'bg-primary-container text-on-primary active:scale-[0.98] shadow-primary-container/30'
              : 'bg-surface-container-high text-outline cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span>VINCULAR EVIDENCIA AL EXPEDIENTE</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center text-xs font-mono text-outline">
          <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
          <span>Regla de taller: Evidencia sellada en blockchain con timestamp inmutable</span>
        </div>
      </div>
    </div>
  );
};
