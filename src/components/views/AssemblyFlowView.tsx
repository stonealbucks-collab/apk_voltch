import React, { useState } from 'react';
import { Expediente, AssemblyComponent, AssemblyStage } from '../../types';
import { SignaturePad } from '../SignaturePad';

interface AssemblyFlowViewProps {
  expediente: Expediente;
  onUpdateExpediente: (updated: Expediente) => void;
  onOpenLiveCamera: (subsystemName?: string) => void;
  onFinishAssembly: () => void;
}

export const AssemblyFlowView: React.FC<AssemblyFlowViewProps> = ({
  expediente,
  onUpdateExpediente,
  onOpenLiveCamera,
  onFinishAssembly,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2);
  const [expandedStageId, setExpandedStageId] = useState<string>('stg-1');
  const [scanningComponentId, setScanningComponentId] = useState<string | null>(null);

  // Toggle component validation
  const handleToggleComponent = (comp: AssemblyComponent) => {
    if (!expediente.assemblyComponents) return;
    const updated = expediente.assemblyComponents.map((c) =>
      c.id === comp.id ? { ...c, isValidated: !c.isValidated } : c
    );
    onUpdateExpediente({
      ...expediente,
      assemblyComponents: updated,
    });
  };

  // Toggle assembly stage verification
  const handleToggleStage = (stg: AssemblyStage) => {
    if (!expediente.assemblyStages) return;
    const updated = expediente.assemblyStages.map((s) =>
      s.id === stg.id ? { ...s, isVerified: !s.isVerified } : s
    );
    onUpdateExpediente({
      ...expediente,
      assemblyStages: updated,
    });
  };

  const validatedCount =
    expediente.assemblyComponents?.filter((c) => c.isValidated).length || 6;
  const verifiedStagesCount =
    expediente.assemblyStages?.filter((s) => s.isVerified).length || 5;

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Sub-Stepper Navigation for Assembly (Paso 1, 2, 3) */}
      <div className="flex items-center justify-between border-b border-surface-variant/30 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveStep(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors shrink-0 ${
              activeStep === 1
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            01. Trazabilidad Serial ({validatedCount}/6)
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors shrink-0 ${
              activeStep === 2
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            02. Celda & Banco ({verifiedStagesCount}/5)
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors shrink-0 ${
              activeStep === 3
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            03. Homologación & Despacho
          </button>
        </div>
      </div>

      {/* Vehicle Identity Header Banner */}
      <div className="bg-surface-container rounded-2xl p-4 border border-tertiary/30 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-base text-on-surface">
              {expediente.vehicleModel}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-bold">
              0 KM HOMOLOGACIÓN
            </span>
          </div>
          <span className="text-xs font-mono text-outline">
            VIN: <strong className="text-on-surface">{expediente.vin}</strong> • FOLIO: {expediente.folio}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-tertiary font-bold">{expediente.bayId}</span>
          <span className="text-[10px] font-mono text-outline block">Téc. M. Huamán</span>
        </div>
      </div>

      {/* STEP 1: TRAZABILIDAD SERIAL (Screen 8) */}
      {activeStep === 1 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-on-surface uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[20px]">qr_code_scanner</span>
              Matriz Serializada de Componentes Críticos (6/6)
            </span>
            <button
              onClick={() => onOpenLiveCamera('Componentes Seriales Alta Tensión')}
              className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
              + Foto Serial
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {expediente.assemblyComponents?.map((comp) => (
              <div
                key={comp.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                  comp.isValidated
                    ? 'bg-surface-container border-tertiary/40'
                    : 'bg-surface-container-low border-surface-variant'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-surface-container-high text-tertiary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {comp.stepNumber}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline font-bold text-xs text-on-surface truncate">
                      {comp.name}
                    </span>
                    <span className="font-mono text-[11px] text-primary truncate">
                      {comp.serialCode}
                    </span>
                    <span className="text-[10px] font-mono text-outline truncate">
                      {comp.specs}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleComponent(comp)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                      comp.isValidated
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-container-high text-outline hover:text-on-surface'
                    }`}
                  >
                    {comp.isValidated ? 'VERIFICADO' : 'PENDIENTE'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveStep(2)}
            className="w-full h-12 rounded-xl bg-tertiary text-on-tertiary font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            <span>AVANZAR A CELDA DE MONTAJE Y BANCO</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* STEP 2: CELDA DE MONTAJE & BANCO DINAMOMÉTRICO (Screen 2) */}
      {activeStep === 2 && (
        <div className="flex flex-col gap-4">
          {/* Dyno Bench & Megohmmeter Card */}
          <div className="bg-surface-container rounded-2xl p-4 border border-tertiary/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">speed</span>
                <div>
                  <span className="font-headline font-bold text-sm text-on-surface uppercase block">
                    Banco Dinamométrico // Prueba de Carga
                  </span>
                  <span className="font-mono text-[10px] text-tertiary">
                    PAR SOSTENIDO: 145 Nm • POTENCIA PICO: 5000W
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-mono text-[10px] font-bold">
                100% CONFORME
              </span>
            </div>

            {/* Dyno Curve Graphic */}
            <div className="relative w-full h-24 bg-[#060e20] rounded-xl overflow-hidden border border-outline-variant/30 p-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path
                  d="M 10,90 Q 60,30 150,20 L 350,20 Q 430,35 490,65"
                  fill="none"
                  stroke="#5be9ad"
                  strokeWidth="3"
                />
                <circle cx="250" cy="20" r="5" fill="#c3f5ff" />
              </svg>
              <span className="absolute top-2 left-3 font-mono text-[10px] text-tertiary font-bold">
                CURVA DE PAR MOTOR (145 Nm @ 450 RPM)
              </span>
              <span className="absolute bottom-2 right-3 font-mono text-[10px] text-primary">
                FOC: 52°C • 0% DERIVA TÉRMICA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
                <span className="text-[10px] text-outline uppercase">Aislamiento Megóhmetro</span>
                <span className="font-bold text-sm text-tertiary">920 MΩ @ 1000V DC</span>
                <span className="text-[9px] text-outline">Supera norma ISO 6469-1</span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
                <span className="text-[10px] text-outline uppercase">Frenado Regen CBS</span>
                <span className="font-bold text-sm text-primary">18ms Corte / 12A Recarga</span>
                <span className="text-[9px] text-outline">Microswitch verificado</span>
              </div>
            </div>
          </div>

          {/* Collapsible 5 Assembly Stages (Screen 2 Accordions) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-on-surface uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">build_circle</span>
                Bitácora de 5 Etapas de Celda de Montaje
              </span>
              <span className="font-mono text-xs text-outline">{verifiedStagesCount}/5 Aprobadas</span>
            </div>

            <div className="flex flex-col gap-2">
              {expediente.assemblyStages?.map((stage) => {
                const isExpanded = expandedStageId === stage.id;
                return (
                  <div
                    key={stage.id}
                    className="bg-surface-container rounded-xl border border-surface-variant/40 overflow-hidden"
                  >
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div
                        onClick={() => setExpandedStageId(isExpanded ? '' : stage.id)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <span className="w-6 h-6 rounded bg-primary-container/20 text-primary-container font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {stage.stepNumber}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-headline font-bold text-xs text-on-surface truncate">
                            {stage.title}
                          </span>
                          <span className="text-[11px] font-mono text-tertiary truncate">
                            {stage.spec}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleStage(stage)}
                          className={`px-2.5 py-1 rounded font-mono text-xs font-bold transition-colors ${
                            stage.isVerified
                              ? 'bg-tertiary text-on-tertiary'
                              : 'bg-surface-container-high text-outline hover:text-on-surface'
                          }`}
                        >
                          {stage.isVerified ? 'CONFORME' : 'VERIFICAR'}
                        </button>
                        <button
                          onClick={() => setExpandedStageId(isExpanded ? '' : stage.id)}
                          className="text-outline hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-surface-variant/20 bg-surface-container-lowest/50 text-xs font-mono flex flex-col gap-2">
                        <div className="flex flex-col gap-1 text-on-surface-variant">
                          <div>
                            HERRAMIENTA CALIBRADA: <strong className="text-on-surface">{stage.toolUsed}</strong>
                          </div>
                          <div>
                            REVISIÓN ESTRUCTURAL: <strong className="text-tertiary">{stage.structuralCheck}</strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenLiveCamera(stage.title)}
                            className="px-2.5 py-1 rounded bg-surface-container-high text-primary flex items-center gap-1 text-[11px]"
                          >
                            <span className="material-symbols-outlined text-[15px]">add_a_photo</span>
                            Adjuntar Foto Evidencia
                          </button>
                          <span className="text-[10px] text-outline">Sellado en Folio VD</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveStep(3)}
            className="w-full h-12 rounded-xl bg-tertiary text-on-tertiary font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-1"
          >
            <span>CONTINUAR A HOMOLOGACIÓN & DESPACHO</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* STEP 3: HOMOLOGACIÓN & DESPACHO (Screen 3) */}
      {activeStep === 3 && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface-container rounded-2xl p-4 border border-tertiary/40 flex flex-col gap-3">
            <span className="font-headline font-bold text-sm text-tertiary uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px]">card_membership</span>
              Certificado de Homologación de Fábrica // SUNARP - MTC
            </span>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Unidad construida bajo estándares ISO 9001:2015, ISO 6469-1 e ISO 6469-3 para vehículos eléctricos livianos (L5e).
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
                <span className="text-[10px] text-outline uppercase">Garantía Oficial Voltech</span>
                <span className="font-bold text-primary">36 Meses / 50,000 km</span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
                <span className="text-[10px] text-outline uppercase">Hash Criptográfico</span>
                <span className="font-bold text-tertiary truncate">e8f49a21c0...</span>
              </div>
            </div>
          </div>

          {/* Inspector Digital Signature */}
          <SignaturePad
            label="Firma de Inspector en Línea de Ensamblaje"
            roleDescription="Ing. Marcos Huamán · CIP 310942 · Inspector Calidad EV"
            savedSignature={expediente.engineerSignature}
            onSaveSignature={(sig) =>
              onUpdateExpediente({ ...expediente, engineerSignature: sig })
            }
          />

          <button
            onClick={onFinishAssembly}
            className="w-full h-14 rounded-2xl bg-tertiary-container text-on-tertiary-container font-headline font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-tertiary-container/20 active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            <span>DESPACHAR UNIDAD Y GENERAR EXPEDIENTE OFICIAL A4</span>
          </button>
        </div>
      )}
    </div>
  );
};
