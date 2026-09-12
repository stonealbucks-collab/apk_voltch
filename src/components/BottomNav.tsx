import React from 'react';

export type TabType =
  | 'inicio'
  | 'expediente'
  | 'recepcion'
  | 'ensamblaje'
  | 'bateria'
  | 'auditoria'
  | 'certificado';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onTriggerCamera: () => void;
  activeFolio?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onTriggerCamera,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-variant/30 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
      <div className="max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-around relative">
        {/* Inicio */}
        <button
          onClick={() => onSelectTab('inicio')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'inicio' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="font-mono text-[10px] tracking-tight uppercase font-medium">Inicio</span>
        </button>

        {/* Expediente Activo */}
        <button
          onClick={() => onSelectTab('expediente')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'expediente' || currentTab === 'recepcion'
              ? 'text-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">folder_open</span>
          <span className="font-mono text-[10px] tracking-tight uppercase font-medium">Expediente</span>
        </button>

        {/* Central Rugged Camera Shutter Button */}
        <div className="flex flex-col items-center -mt-5">
          <button
            onClick={onTriggerCamera}
            className="w-13 h-13 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform ring-4 ring-surface-container-lowest border border-white/20"
            title="Capturar Evidencia Obligatoria"
          >
            <span className="material-symbols-outlined text-[26px]">photo_camera</span>
          </button>
          <span className="font-mono text-[9px] text-primary-container font-bold uppercase mt-1">
            + Foto Evid.
          </span>
        </div>

        {/* Telemetría / Batería HV */}
        <button
          onClick={() => onSelectTab('bateria')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'bateria' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">battery_charging_full</span>
          <span className="font-mono text-[10px] tracking-tight uppercase font-medium">Batería HV</span>
        </button>

        {/* Certificado A4 */}
        <button
          onClick={() => onSelectTab('certificado')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'certificado' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span className="font-mono text-[10px] tracking-tight uppercase font-medium">Certificado</span>
        </button>

        {/* Repositorio / Auditoría */}
        <button
          onClick={() => onSelectTab('auditoria')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'auditoria' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          <span className="font-mono text-[10px] tracking-tight uppercase font-medium">Auditoría</span>
        </button>
      </div>
    </nav>
  );
};
