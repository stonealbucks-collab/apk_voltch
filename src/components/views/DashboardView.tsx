import React, { useState } from 'react';
import { Expediente } from '../../types';

interface DashboardViewProps {
  expedientes: Expediente[];
  onSelectExpediente: (exp: Expediente) => void;
  onNewExpediente: () => void;
  onOpenAudit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  expedientes,
  onSelectExpediente,
  onNewExpediente,
  onOpenAudit,
}) => {
  const [filter, setFilter] = useState<'todos' | 'reparacion' | 'ensamblaje' | 'critico'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = expedientes.filter((exp) => {
    const matchesFilter =
      filter === 'todos' ||
      (filter === 'reparacion' && exp.type === 'service') ||
      (filter === 'ensamblaje' && exp.type === 'assembly') ||
      (filter === 'critico' && (exp.status === 'cuarentena' || exp.isolationResistanceMOhm < 1));

    const matchesSearch =
      exp.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vin.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const countInProgress = expedientes.filter((e) => e.status !== 'liberado' && e.status !== 'cuarentena').length;
  const countInspection = expedientes.filter((e) => e.status === 'recepcion' || e.status === 'diagnostico').length;
  const countCritical = expedientes.filter((e) => e.status === 'cuarentena' || e.isolationResistanceMOhm < 1).length;

  return (
    <div className="pb-24 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Workshop Location Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-variant/40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[28px]">garage_home</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base text-on-surface uppercase tracking-tight">
              Taller Central EV // Bahía 03
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              Línea Activa: Diagnóstico & Ensamblaje HV
            </span>
          </div>
        </div>

        <button
          onClick={onNewExpediente}
          className="h-11 px-4 rounded-xl bg-primary-container text-on-primary font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-primary-container/20 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nuevo Registro</span>
        </button>
      </div>

      {/* Metric Counters (Screen 9) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
            En Proceso
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-primary">0{countInProgress}</span>
            <span className="text-[10px] font-mono text-tertiary">Activos</span>
          </div>
        </div>

        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
            Inspección
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-secondary">0{countInspection}</span>
            <span className="text-[10px] font-mono text-secondary">Bahías</span>
          </div>
        </div>

        <div className="bg-surface-container p-3 rounded-xl border border-error/40 flex flex-col bg-error-container/10">
          <span className="text-[10px] font-mono text-error uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
            Crítico HV
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-error">0{countCritical}</span>
            <span className="text-[10px] font-mono text-error">LOTO ON</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por placa, VIN, folio o cliente..."
            className="w-full h-11 bg-surface-container-high text-on-surface pl-10 pr-4 rounded-xl text-sm font-body placeholder:text-outline border border-surface-variant focus:outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
              filter === 'todos'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Todos ({expedientes.length})
          </button>
          <button
            onClick={() => setFilter('reparacion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
              filter === 'reparacion'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Servicio Técnico (Flujo A)
          </button>
          <button
            onClick={() => setFilter('ensamblaje')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
              filter === 'ensamblaje'
                ? 'bg-tertiary-container text-on-tertiary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Ensamblaje Nuevo (Flujo B)
          </button>
          <button
            onClick={() => setFilter('critico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0 ${
              filter === 'critico'
                ? 'bg-error text-on-error'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Críticos LOTO
          </button>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-mono text-outline uppercase tracking-wider">
          EXPEDIENTES EN TALLER ({filtered.length})
        </span>
        <button
          onClick={onOpenAudit}
          className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
        >
          <span>Ver Auditoría Completa</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* Expedientes Cards List */}
      <div className="flex flex-col gap-3">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            onClick={() => onSelectExpediente(exp)}
            className="group bg-surface-container hover:bg-surface-container-high transition-all p-3.5 rounded-2xl border border-surface-variant/40 hover:border-primary/50 cursor-pointer shadow-md flex flex-col gap-2.5"
          >
            {/* Top row: Folio + Type + Status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-primary">{exp.folio}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                    exp.type === 'assembly'
                      ? 'bg-tertiary-container/20 text-tertiary'
                      : 'bg-primary-container/20 text-primary-container'
                  }`}
                >
                  {exp.type === 'assembly' ? 'Flujo Ensamblaje' : 'Flujo Servicio'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    exp.status === 'cuarentena'
                      ? 'bg-error animate-ping'
                      : exp.status === 'listo' || exp.status === 'homologado'
                      ? 'bg-tertiary'
                      : 'bg-secondary'
                  }`}
                ></span>
                <span className="text-[11px] font-mono text-on-surface-variant font-medium">
                  {exp.statusLabel}
                </span>
              </div>
            </div>

            {/* Middle Row: Vehicle Image & Specs */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-surface-container-lowest overflow-hidden shrink-0 border border-surface-variant/50">
                <img
                  src={exp.imageUrl}
                  alt={exp.vehicleModel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline font-bold text-sm text-on-surface truncate">
                  {exp.vehicleModel}
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-outline truncate">
                  <span>PLACA: <strong className="text-on-surface">{exp.vehiclePlate}</strong></span>
                  <span>•</span>
                  <span>SOC: <strong className="text-tertiary">{exp.batterySoc}%</strong></span>
                </div>
                <div className="text-[11px] font-mono text-outline truncate">
                  CLIENTE: <span className="text-on-surface-variant">{exp.clientName}</span>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end">
                <span className="text-xs font-mono text-primary font-bold">{exp.bayId}</span>
                <span className="text-[10px] font-mono text-outline">{exp.technicianName}</span>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px] mt-1">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Fault or Status Summary */}
            {exp.faultSummary && (
              <div className="bg-surface-container-lowest/80 px-2.5 py-1.5 rounded-lg border border-surface-variant/20 flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">
                  info
                </span>
                <span className="text-xs font-body text-on-surface-variant line-clamp-1">
                  {exp.faultSummary}
                </span>
              </div>
            )}

            {/* Bottom mini stats */}
            <div className="flex items-center justify-between text-[11px] font-mono text-outline pt-1 border-t border-surface-variant/20">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                <span>{exp.evidences?.length || 0} Evidencias Vinculadas</span>
              </span>
              <span>{exp.stepProgress}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
