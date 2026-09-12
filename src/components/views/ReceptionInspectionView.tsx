import React, { useState } from 'react';
import { Expediente, SubsystemItem, SeverityLevel, EvidencePhoto } from '../../types';
import { SignaturePad } from '../SignaturePad';

interface ReceptionInspectionViewProps {
  expediente: Expediente;
  onUpdateExpediente: (updated: Expediente) => void;
  onOpenLiveCamera: (subsystemName?: string) => void;
  onAdvanceToDiagnosis: () => void;
}

export const ReceptionInspectionView: React.FC<ReceptionInspectionViewProps> = ({
  expediente,
  onUpdateExpediente,
  onOpenLiveCamera,
  onAdvanceToDiagnosis,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [hvGuantesChecked, setHvGuantesChecked] = useState<boolean>(true);
  const [keysCustodyChecked, setKeysCustodyChecked] = useState<boolean>(true);
  const [viewEvidenceModal, setViewEvidenceModal] = useState<EvidencePhoto | null>(null);

  const handleToggleSubsystemStatus = (subsystemId: string, newStatus: SeverityLevel) => {
    const updatedSubsystems = expediente.subsystems.map((sub) => {
      if (sub.id === subsystemId) {
        return { ...sub, status: newStatus };
      }
      return sub;
    });
    onUpdateExpediente({
      ...expediente,
      subsystems: updatedSubsystems,
    });
  };

  const handlePlayVoice = (subsystemId: string) => {
    setPlayingAudioId(subsystemId);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 2500);
  };

  const handleSaveCarrierSignature = (sigUrl: string) => {
    onUpdateExpediente({
      ...expediente,
      carrierSignature: sigUrl,
    });
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary font-bold">FASE 01 / 03</span>
          <span className="text-xs font-mono text-outline">• RECEPCIÓN & INSPECCIÓN</span>
        </div>
        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
          {expediente.folio}
        </span>
      </div>

      {/* High-Voltage Safety Checkpoint Banner (Screen 10) */}
      <div className="bg-error-container/20 border-2 border-error/50 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center shrink-0 shadow-md">
          <span className="material-symbols-outlined text-[24px]">electric_bolt</span>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-error uppercase tracking-wide">
              CHECKPOINT ALTA TENSIÓN (72V DC LIVE)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
          </div>
          <p className="text-xs font-body text-on-surface-variant">
            Protocolo NFPA 70E: Uso de guantes dieléctricos Clase 0 (1000V) y máscara facial obligatorio antes de retirar la tapa de batería.
          </p>
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={hvGuantesChecked}
              onChange={(e) => setHvGuantesChecked(e.target.checked)}
              className="w-4 h-4 accent-error rounded"
            />
            <span className="text-xs font-mono font-bold text-on-surface">
              Confirmo EPP dieléctrico colocado y zona delimitada
            </span>
          </label>
        </div>
      </div>

      {/* Vehicle Info Card */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface">
              {expediente.vehicleModel}
            </h2>
            <span className="text-xs font-mono text-outline">
              VIN: <strong className="text-on-surface">{expediente.vin}</strong>
            </span>
          </div>
          <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-surface-container-high text-primary border border-surface-variant">
            {expediente.vehiclePlate}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-variant/30">
          <div className="bg-surface-container-low p-2 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-outline uppercase">Odómetro</span>
            <span className="font-mono font-bold text-sm text-on-surface">
              {expediente.odometer.toLocaleString()} km
            </span>
          </div>

          <div className="bg-surface-container-low p-2 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-outline uppercase">SOC Batería</span>
            <span className="font-mono font-bold text-sm text-tertiary">
              {expediente.batterySoc}% SOC
            </span>
          </div>

          <div className="bg-surface-container-low p-2 rounded-xl flex flex-col">
            <span className="text-[10px] font-mono text-outline uppercase">Custodia Llaves</span>
            <span className="font-mono font-bold text-xs text-primary flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">key</span>
              En Pañol
            </span>
          </div>
        </div>
      </div>

      {/* Subsystems Inspection Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
            <span className="font-headline font-bold text-sm text-on-surface uppercase">
              Inspección de Subsistemas ({expediente.subsystems?.length || 0})
            </span>
          </div>
          <span className="text-[11px] font-mono text-outline">
            Toca el estado para cambiar
          </span>
        </div>

        {/* List of 5 Subsystems */}
        <div className="flex flex-col gap-2.5">
          {expediente.subsystems.map((sub) => (
            <div
              key={sub.id}
              className="bg-surface-container p-3.5 rounded-2xl border border-surface-variant/40 flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      sub.status === 'bueno'
                        ? 'bg-tertiary-container/20 text-tertiary'
                        : sub.status === 'regular'
                        ? 'bg-secondary-container/20 text-secondary'
                        : 'bg-error-container/20 text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{sub.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline font-bold text-sm text-on-surface truncate">
                      {sub.name}
                    </span>
                    <span className="text-xs font-body text-on-surface-variant">
                      {sub.alertText}
                    </span>
                  </div>
                </div>

                {/* Status Badges Selector */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleSubsystemStatus(sub.id, 'bueno')}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold uppercase transition-colors ${
                      sub.status === 'bueno'
                        ? 'bg-tertiary text-on-tertiary shadow-sm'
                        : 'bg-surface-container-high text-outline hover:text-on-surface'
                    }`}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSubsystemStatus(sub.id, 'regular')}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold uppercase transition-colors ${
                      sub.status === 'regular'
                        ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                        : 'bg-surface-container-high text-outline hover:text-on-surface'
                    }`}
                  >
                    REG
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSubsystemStatus(sub.id, 'malo')}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold uppercase transition-colors ${
                      sub.status === 'malo'
                        ? 'bg-error text-on-error shadow-sm'
                        : 'bg-surface-container-high text-outline hover:text-on-surface'
                    }`}
                  >
                    FALLA
                  </button>
                </div>
              </div>

              {/* Subsystem Action Buttons: Voice note & Camera trigger */}
              <div className="flex items-center justify-between pt-1 border-t border-surface-variant/20 text-xs font-mono">
                <div className="flex items-center gap-2">
                  {sub.voiceNoteDuration && (
                    <button
                      type="button"
                      onClick={() => handlePlayVoice(sub.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high transition-colors ${
                        playingAudioId === sub.id ? 'text-primary animate-pulse' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {playingAudioId === sub.id ? 'graphic_eq' : 'play_arrow'}
                      </span>
                      <span>{playingAudioId === sub.id ? 'Reproduciendo...' : `Audio (${sub.voiceNoteDuration})`}</span>
                    </button>
                  )}

                  {sub.observationNote && (
                    <span className="text-[11px] font-body text-outline truncate max-w-[200px]">
                      "{sub.observationNote}"
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenLiveCamera(sub.name)}
                  className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container hover:bg-primary-container/30 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">add_a_photo</span>
                  <span>+ Foto Evidencia</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Evidence Photo Grid (Screen 10 Quadrant) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">photo_library</span>
            <div>
              <span className="font-headline font-bold text-sm text-on-surface uppercase block">
                EVIDENCIA FOTOGRÁFICA OBLIGATORIA
              </span>
              <span className="text-[11px] font-mono text-tertiary">
                REGLA DE TALLER: TODO HALLAZGO DEBE TENER FOTO Y OBSERVACIÓN
              </span>
            </div>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary font-bold">
            {expediente.evidences.length} Registradas
          </span>
        </div>

        {/* 4-Quadrant Evidence Photos Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {expediente.evidences.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setViewEvidenceModal(ev)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-lowest border border-surface-variant/50 cursor-pointer shadow hover:border-primary transition-all"
            >
              <img
                src={ev.imageUrl}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {/* Bottom technical overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent p-2 flex flex-col">
                <span className="font-mono font-bold text-[10px] text-primary truncate">
                  {ev.title}
                </span>
                <span className="text-[9px] font-mono text-on-surface-variant truncate">
                  {ev.observation}
                </span>
              </div>
              {/* Severity badge at top */}
              <span
                className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                  ev.severity === 'bueno'
                    ? 'bg-tertiary text-on-tertiary'
                    : ev.severity === 'regular'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-error text-on-error'
                }`}
              >
                {ev.severity}
              </span>
            </div>
          ))}
        </div>

        {/* Add photo button using the rugged camera */}
        <button
          onClick={() => onOpenLiveCamera()}
          className="w-full h-12 rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary border border-dashed border-primary/40 flex items-center justify-center gap-2 font-headline font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
          <span>ABRIR CÁMARA RUGERIZADA & REGISTRAR NUEVA EVIDENCIA</span>
        </button>
      </div>

      {/* Driver/Carrier Signature Pad (Screen 10) */}
      <SignaturePad
        label="Firma de Conformidad Transportista / Conductor"
        roleDescription="Valida el estado físico, kilometraje y pertenencias al ingreso de la unidad"
        savedSignature={expediente.carrierSignature}
        onSaveSignature={handleSaveCarrierSignature}
      />

      {/* Advance to Phase 2 Button */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={onAdvanceToDiagnosis}
          disabled={!hvGuantesChecked}
          className={`w-full h-14 rounded-2xl font-headline font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
            hvGuantesChecked
              ? 'bg-primary-container text-on-primary shadow-primary-container/20 active:scale-[0.98]'
              : 'bg-surface-container-high text-outline cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">electrical_services</span>
          <span>GUARDAR RECEPCIÓN Y PASAR A DIAGNÓSTICO TRIFÁSICO (FASE 2)</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <span className="text-center font-mono text-[11px] text-outline">
          Se emitirá automáticamente el LOTO de desenergización y orden de banco.
        </span>
      </div>

      {/* Modal View Detail of Evidence Photo */}
      {viewEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-2xl max-w-lg w-full overflow-hidden border border-surface-variant flex flex-col">
            <div className="p-3 bg-surface-container-high flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-primary uppercase">
                {viewEvidenceModal.title}
              </span>
              <button
                onClick={() => setViewEvidenceModal(null)}
                className="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:text-error"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="aspect-[4/3] bg-black">
              <img
                src={viewEvidenceModal.imageUrl}
                alt={viewEvidenceModal.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-outline">
                <span>SUB-SISTEMA: {viewEvidenceModal.subsystemTag}</span>
                <span>FECHA: {viewEvidenceModal.timestamp}</span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-xl border border-surface-variant/30">
                <span className="text-[10px] font-mono text-primary font-bold uppercase block mb-1">
                  OBSERVACIÓN TÉCNICA DEL ESPECIALISTA:
                </span>
                <p className="text-sm font-body text-on-surface leading-relaxed">
                  {viewEvidenceModal.observation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
