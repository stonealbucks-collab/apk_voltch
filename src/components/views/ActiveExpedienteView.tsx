import React, { useState } from 'react';
import { Expediente, WorkOrder, SparePart } from '../../types';
import { WORKSHOP_SPARE_PARTS } from '../../data/initialData';

interface ActiveExpedienteViewProps {
  expediente: Expediente;
  onUpdateExpediente: (updated: Expediente) => void;
  onOpenLiveCamera: (subsystemName?: string) => void;
  onAdvanceToCertification: () => void;
}

export const ActiveExpedienteView: React.FC<ActiveExpedienteViewProps> = ({
  expediente,
  onUpdateExpediente,
  onOpenLiveCamera,
  onAdvanceToCertification,
}) => {
  // Collapsible Accordion States
  const [reporteOpen, setReporteOpen] = useState<boolean>(true);
  const [telemetriaOpen, setTelemetriaOpen] = useState<boolean>(true);
  const [diagnosticoOpen, setDiagnosticoOpen] = useState<boolean>(true);
  const [showAddPartModal, setShowAddPartModal] = useState<boolean>(false);
  const [barcodeScanActive, setBarcodeScanActive] = useState<boolean>(false);
  const [newOtTitle, setNewOtTitle] = useState<string>('');
  const [showAddOtModal, setShowAddOtModal] = useState<boolean>(false);

  // Toggle Work Order Status
  const handleToggleOtStatus = (otId: string) => {
    const updated = expediente.workOrders.map((ot) => {
      if (ot.id === otId) {
        if (ot.status === 'en_proceso') {
          return {
            ...ot,
            status: 'completado' as const,
            actualHours: ot.estimatedHours,
            certificateOk: true,
            completionTime: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          };
        } else if (ot.status === 'completado') {
          return { ...ot, status: 'en_proceso' as const, certificateOk: false };
        } else {
          return { ...ot, status: 'en_proceso' as const };
        }
      }
      return ot;
    });

    onUpdateExpediente({
      ...expediente,
      workOrders: updated,
    });
  };

  // Add spare part to work order
  const handleUpdatePartQty = (partId: string, delta: number) => {
    const updatedParts = expediente.spareParts.map((p) => {
      if (p.id === partId) {
        const newQty = Math.max(0, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    }).filter((p) => p.quantity > 0);

    onUpdateExpediente({
      ...expediente,
      spareParts: updatedParts,
    });
  };

  const handleAddCatalogPart = (part: SparePart) => {
    const exists = expediente.spareParts.find((p) => p.id === part.id);
    if (exists) {
      handleUpdatePartQty(part.id, 1);
    } else {
      onUpdateExpediente({
        ...expediente,
        spareParts: [...expediente.spareParts, { ...part, quantity: 1 }],
      });
    }
    setShowAddPartModal(false);
  };

  const handleCreateOt = () => {
    if (!newOtTitle.trim()) return;
    const newOt: WorkOrder = {
      id: 'ot-' + Date.now(),
      code: `OT-0${expediente.workOrders.length + 1}`,
      title: newOtTitle.trim(),
      status: 'en_proceso',
      estimatedHours: 1.5,
      technician: expediente.technicianName,
    };
    onUpdateExpediente({
      ...expediente,
      workOrders: [...expediente.workOrders, newOt],
    });
    setNewOtTitle('');
    setShowAddOtModal(false);
  };

  // Financial calculations
  const totalLaborHours = expediente.workOrders.reduce(
    (acc, ot) => acc + (ot.actualHours || ot.estimatedHours),
    0
  );
  const laborCost = totalLaborHours * expediente.laborRatePerHour;
  const partsCost = expediente.spareParts.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
  const subtotal = laborCost + partsCost;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* LOTO Protocol Verified (Screen 1 Banner) */}
      <div className="bg-surface-container-low border border-tertiary/40 rounded-2xl p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 text-tertiary-container border border-tertiary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-headline font-bold text-xs text-tertiary uppercase tracking-wider">
                LOTO PROTOCOL VERIFIED // CIRCUITO DESENERGIZADO
              </span>
            </div>
            <span className="font-mono text-[11px] text-outline">
              ISO-6469-3 // 0.0V DC MEASURED AT FOC BUS
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            onUpdateExpediente({
              ...expediente,
              isLotoActive: !expediente.isLotoActive,
            })
          }
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
            expediente.isLotoActive
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-error text-on-error'
          }`}
        >
          {expediente.isLotoActive ? 'LOTO ACTIVO' : 'ENERGIZADO'}
        </button>
      </div>

      {/* Vehicle & Technician Summary Card (Screen 1) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-lg text-on-surface">
                {expediente.vehicleModel}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold">
                {expediente.vehiclePlate}
              </span>
            </div>
            <span className="text-xs font-mono text-outline">
              BATERÍA: {expediente.batterySpecs}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-primary font-bold">{expediente.bayId}</span>
            <span className="text-[11px] font-mono text-outline block">{expediente.technicianName}</span>
          </div>
        </div>

        {/* Telemetry Waveform: Sensor de Fase HUB (Screen 1 Waveform) */}
        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-surface-variant/50 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">show_chart</span>
              <span className="font-headline font-bold text-xs text-on-surface uppercase tracking-wide">
                Telemetría // Sensor de Fase HUB (Motor 4kW)
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">
              DESFASE 18° DETECTADO
            </span>
          </div>

          {/* Interactive SVG Oscillation Graph */}
          <div className="relative w-full h-24 bg-[#060e20] rounded-lg overflow-hidden border border-outline-variant/30 p-2 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="25" x2="500" y2="25" stroke="#171f33" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#222a3d" strokeWidth="1.5" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#171f33" strokeDasharray="3,3" />
              
              {/* Healthy Sine Wave (Phase U) */}
              <path
                d="M 0,50 Q 30,10 60,50 T 120,50 T 180,50 T 240,50 T 300,50 T 360,50 T 420,50 T 480,50 T 500,50"
                fill="none"
                stroke="#5be9ad"
                strokeWidth="2"
                opacity="0.7"
              />

              {/* Faulty Jitter Wave (Hall Sensor #2 Desfasado con armónicos) */}
              <path
                d="M 0,50 Q 25,15 45,35 Q 60,85 85,60 Q 110,20 135,45 Q 160,90 190,55 Q 215,10 240,40 Q 270,95 300,60 Q 325,15 355,50 Q 385,85 415,55 Q 445,15 475,50 L 500,45"
                fill="none"
                stroke="#ffb95f"
                strokeWidth="2.5"
              />

              {/* Anomaly circle highlight */}
              <circle cx="285" cy="78" r="9" fill="#ffb4ab" opacity="0.3" className="animate-ping" />
              <circle cx="285" cy="78" r="5" fill="#ffb4ab" />
            </svg>

            {/* Micro annotations */}
            <span className="absolute bottom-1 left-2 font-mono text-[9px] text-tertiary">
              FASE U (NOMINAL 120°)
            </span>
            <span className="absolute top-1 right-2 font-mono text-[9px] text-secondary font-bold">
              HALL #2 (JITTER 18° / ANOMALÍA)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
            <div className="bg-surface-container-high/60 p-1.5 rounded">
              <span className="text-[10px] text-outline block">FOC TEMP</span>
              <span className="font-bold text-secondary">{expediente.focTemp || 68}°C</span>
            </div>
            <div className="bg-surface-container-high/60 p-1.5 rounded">
              <span className="text-[10px] text-outline block">AISLAMIENTO</span>
              <span className="font-bold text-tertiary">{expediente.isolationResistanceMOhm} MΩ</span>
            </div>
            <div className="bg-surface-container-high/60 p-1.5 rounded">
              <span className="text-[10px] text-outline block">OFFSET HALL</span>
              <span className="font-bold text-error">+18.4° Jitter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz Trifásica de Diagnóstico (Screen 1 Accordions) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-sm text-on-surface uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
            Matriz Trifásica de Diagnóstico
          </span>
          <span className="text-[11px] font-mono text-outline">Desplegables Técnicos</span>
        </div>

        {/* Accordion 01: Reporte de Conducción */}
        <div className="bg-surface-container rounded-xl border border-surface-variant/40 overflow-hidden">
          <button
            onClick={() => setReporteOpen(!reporteOpen)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-container/20 text-primary flex items-center justify-center text-[10px] font-mono font-bold">
                01
              </span>
              <span className="font-headline font-bold text-xs text-on-surface uppercase">
                Reporte de Conducción (Entrevista Conductor)
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">
              {reporteOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {reporteOpen && (
            <div className="px-3.5 pb-3.5 pt-1 text-xs font-body text-on-surface-variant border-t border-surface-variant/20 bg-surface-container-lowest/50 flex flex-col gap-1.5">
              <p className="leading-relaxed">
                "{expediente.clientReport || 'Pérdida súbita de par motor en pendientes y tironeo continuo a más de 45 km/h.'}"
              </p>
              <div className="flex items-center gap-2 font-mono text-[11px] text-outline">
                <span>CONDUCTOR: Juan Carlos (Flota Reparto)</span>
                <span>•</span>
                <span>FECHA: 02/07/2026</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 02: Telemetría CAN-Bus & Banco */}
        <div className="bg-surface-container rounded-xl border border-surface-variant/40 overflow-hidden">
          <button
            onClick={() => setTelemetriaOpen(!telemetriaOpen)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center text-[10px] font-mono font-bold">
                02
              </span>
              <span className="font-headline font-bold text-xs text-on-surface uppercase">
                Telemetría CAN-Bus & Banco Dinamométrica
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">
              {telemetriaOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {telemetriaOpen && (
            <div className="px-3.5 pb-3.5 pt-1 text-xs font-body text-on-surface-variant border-t border-surface-variant/20 bg-surface-container-lowest/50 flex flex-col gap-2">
              <div className="bg-surface-container-high/80 p-2.5 rounded-lg font-mono text-xs text-primary leading-relaxed border border-surface-variant/40">
                {expediente.obdDtcCode ||
                  'DTC P0A1F: Desfase sostenido de 18° en Hall Sensor #2 del estator del motor HUB. Temperatura de FOC en 68°C registrada en log de esfuerzo.'}
              </div>
            </div>
          )}
        </div>

        {/* Accordion 03: Diagnóstico Confirmado */}
        <div className="bg-surface-container rounded-xl border border-surface-variant/40 overflow-hidden">
          <button
            onClick={() => setDiagnosticoOpen(!diagnosticoOpen)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center text-[10px] font-mono font-bold">
                03
              </span>
              <span className="font-headline font-bold text-xs text-tertiary uppercase">
                Diagnóstico Confirmado (Firma Nivel 2)
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[20px]">
              {diagnosticoOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {diagnosticoOpen && (
            <div className="px-3.5 pb-3.5 pt-1 text-xs font-body text-on-surface-variant border-t border-surface-variant/20 bg-surface-container-lowest/50 flex flex-col gap-1.5">
              <p className="leading-relaxed">
                {expediente.confirmedDiagnostic ||
                  'Falla intermitente en sensor Hall 2 por sulfatación severa en mazo de arnés sellado y fuga de aislamiento de 120 kΩ en fase U (mínimo seguro: 500 kΩ).'}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-tertiary font-bold">
                  DICTAMEN: PROCEDE REEMPLAZO DE SENSOR & SELLADO
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLiveCamera('Potencia HV (Motor HUB 4kW & FOC)')}
                  className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  Evidencia Foto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Órdenes de Trabajo (OT) Section (Screen 1) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">task</span>
            <span className="font-headline font-bold text-sm text-on-surface uppercase">
              Órdenes de Trabajo Activas ({expediente.workOrders.length})
            </span>
          </div>
          <button
            onClick={() => setShowAddOtModal(true)}
            className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nueva OT
          </button>
        </div>

        {/* List of Work Orders */}
        <div className="flex flex-col gap-2.5">
          {expediente.workOrders.map((ot) => (
            <div
              key={ot.id}
              className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                ot.status === 'completado'
                  ? 'bg-surface-container-low border-tertiary/40 opacity-90'
                  : ot.status === 'en_proceso'
                  ? 'bg-surface-container-high border-primary/50 shadow-sm'
                  : 'bg-surface-container-low border-surface-variant/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-xs text-primary">{ot.code}</span>
                  <span className="font-body text-xs text-on-surface font-semibold truncate">
                    {ot.title}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${
                    ot.status === 'completado'
                      ? 'bg-tertiary text-on-tertiary'
                      : ot.status === 'en_proceso'
                      ? 'bg-primary-container text-on-primary animate-pulse'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  {ot.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-outline pt-1 border-t border-surface-variant/20">
                <div className="flex items-center gap-2">
                  <span>{ot.technician}</span>
                  <span>•</span>
                  <span>
                    {ot.actualHours ? `${ot.actualHours}h real` : `${ot.estimatedHours}h est.`}
                  </span>
                  {ot.completionTime && (
                    <span className="text-tertiary">Completado {ot.completionTime}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleOtStatus(ot.id)}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold transition-colors ${
                    ot.status === 'completado'
                      ? 'bg-surface-container text-on-surface-variant hover:text-error'
                      : 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary shadow-sm'
                  }`}
                >
                  {ot.status === 'completado' ? 'Reabrir' : 'Marcar Conforme'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repuestos de Taller HV (BOM) Section */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">category</span>
            <span className="font-headline font-bold text-sm text-on-surface uppercase">
              Repuestos & Consumibles de Taller HV
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBarcodeScanActive(true)}
              className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary hover:bg-surface-bright text-xs font-mono flex items-center gap-1 transition-colors"
              title="Escanear Código de Barras"
            >
              <span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
              Escanear
            </button>
            <button
              onClick={() => setShowAddPartModal(true)}
              className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary text-xs font-mono font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Catálogo
            </button>
          </div>
        </div>

        {/* Selected Parts List */}
        {expediente.spareParts.length === 0 ? (
          <div className="text-center py-4 text-xs font-mono text-outline border border-dashed border-surface-variant rounded-xl">
            No hay repuestos vinculados aún. Usa "Escanear" o "+ Catálogo".
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {expediente.spareParts.map((part) => (
              <div
                key={part.id}
                className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">{part.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body font-semibold text-xs text-on-surface truncate">
                      {part.name}
                    </span>
                    <span className="font-mono text-[10px] text-outline">
                      {part.sku} • Stock Bahía: {part.bayStock}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-surface-container rounded-lg border border-surface-variant/40">
                    <button
                      onClick={() => handleUpdatePartQty(part.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-outline hover:text-error"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono text-xs font-bold text-on-surface">
                      {part.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdatePartQty(part.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-outline hover:text-primary"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono text-xs font-bold text-on-surface w-16 text-right">
                    S/. {(part.unitPrice * part.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liquidación Económica en Tiempo Real (Screen 1) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-2">
        <span className="font-headline font-bold text-xs text-primary uppercase">
          Liquidación Económica // Taller Oficial Voltech
        </span>

        <div className="flex flex-col gap-1.5 pt-1 text-xs font-mono">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Mano de Obra ({totalLaborHours.toFixed(1)} hrs x S/. {expediente.laborRatePerHour}/h)</span>
            <span>S/. {laborCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Repuestos & Insumos Dieléctricos</span>
            <span>S/. {partsCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-outline pt-1 border-t border-surface-variant/20">
            <span>Subtotal Neto</span>
            <span>S/. {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-outline">
            <span>I.G.V. (18%)</span>
            <span>S/. {igv.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-headline font-bold text-primary pt-1 border-t border-primary/30">
            <span>TOTAL EXPEDIENTE S/.</span>
            <span>S/. {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Advance to QC & Certification Button */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={onAdvanceToCertification}
          className="w-full h-14 rounded-2xl bg-primary-container text-on-primary font-headline font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-primary-container/20 active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span>APROBAR ÓRDENES Y AVANZAR A CONTROL DE CALIDAD & CERTIFICADO</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <span className="text-center font-mono text-[11px] text-outline">
          Se sellará el informe técnico pericial con hash SHA-256 inmutable.
        </span>
      </div>

      {/* Modal: Add Spare Part from Catalog */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-2xl max-w-md w-full p-4 border border-surface-variant flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-primary uppercase">
                Almacén Central // Repuestos EV
              </span>
              <button
                onClick={() => setShowAddPartModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {WORKSHOP_SPARE_PARTS.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-on-surface">{p.name}</span>
                    <span className="font-mono text-[10px] text-outline">
                      {p.sku} • Stock: {p.bayStock} {p.unit}
                    </span>
                    <span className="font-mono text-xs text-tertiary">S/. {p.unitPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddCatalogPart(p)}
                    className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-mono text-xs font-bold hover:bg-primary"
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Barcode Scanner Simulation */}
      {barcodeScanActive && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-2xl max-w-sm w-full p-4 border border-primary/40 flex flex-col gap-3 text-center">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-xs text-primary uppercase">
                Lector de Código de Barras // Almacén Bahía 03
              </span>
              <button
                onClick={() => setBarcodeScanActive(false)}
                className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="relative aspect-[3/2] bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center border-2 border-primary/50">
              <div className="w-48 h-0.5 bg-error animate-pulse shadow-[0_0_10px_#ffb4ab]"></div>
              <span className="material-symbols-outlined text-outline/30 text-[64px] absolute">
                barcode
              </span>
              <span className="absolute bottom-2 font-mono text-[10px] text-primary">
                Alinee el código de barras en la línea roja
              </span>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-mono text-outline">Simular escaneo rápido:</span>
              <div className="flex flex-col gap-1">
                {WORKSHOP_SPARE_PARTS.slice(0, 3).map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      handleAddCatalogPart(sp);
                      setBarcodeScanActive(false);
                    }}
                    className="p-2 rounded bg-surface-container-high hover:bg-surface-bright text-xs font-mono text-left flex items-center justify-between"
                  >
                    <span className="truncate">{sp.name}</span>
                    <span className="text-primary text-[11px]">Detectar</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Work Order */}
      {showAddOtModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-2xl max-w-md w-full p-4 border border-surface-variant flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-primary uppercase">
                Añadir Orden de Trabajo (OT)
              </span>
              <button
                onClick={() => setShowAddOtModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-on-surface-variant">
                Descripción de la Tarea Técnica
              </label>
              <input
                type="text"
                value={newOtTitle}
                onChange={(e) => setNewOtTitle(e.target.value)}
                placeholder="Ej. Recalibración de sensor TPS en acelerador..."
                className="w-full h-11 bg-surface-container-high text-on-surface px-3 rounded-xl text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={handleCreateOt}
              className="w-full h-11 rounded-xl bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-wider hover:bg-primary"
            >
              Crear e Iniciar OT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
