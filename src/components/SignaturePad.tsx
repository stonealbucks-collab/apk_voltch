import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  label: string;
  roleDescription: string;
  onSaveSignature: (dataUrl: string) => void;
  savedSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  roleDescription,
  onSaveSignature,
  savedSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(!!savedSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#c3f5ff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (savedSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = savedSignature;
    }
  }, [savedSignature]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        onSaveSignature(dataUrl);
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSaveSignature('');
  };

  return (
    <div className="bg-surface-container-low border border-surface-variant/40 rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-on-surface uppercase block">{label}</span>
          <span className="text-[11px] font-mono text-outline">{roleDescription}</span>
        </div>
        {hasDrawn && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1 rounded bg-surface-container text-xs font-mono text-error hover:bg-surface-variant transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Borrar
          </button>
        )}
      </div>

      <div className="relative w-full h-24 bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair block"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-outline/50 font-mono text-xs">
            Firme aquí con el dedo o puntero
          </div>
        )}

        <div className="absolute bottom-1 right-2 pointer-events-none text-[9px] font-mono text-outline/60">
          TRAZABILIDAD ISO-9001
        </div>
      </div>
    </div>
  );
};
