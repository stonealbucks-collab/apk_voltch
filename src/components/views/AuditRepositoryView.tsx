import React, { useState } from 'react';
import { Expediente } from '../../types';

interface AuditRepositoryViewProps {
  expedientes: Expediente[];
  onSelectExpediente: (exp: Expediente) => void;
  onNewExpediente: () => void;
}

export const AuditRepositoryView: React.FC<AuditRepositoryViewProps> = ({
  expedientes,
  onSelectExpediente,
  onNewExpediente,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reparacion' | 'ensamblaje' | 'listo' | 'cuarentena'>('all');

  const filtered = expedientes.filter((e) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'reparacion' && e.type === 'service') ||
      (statusFilter === 'ensamblaje' && e.type === 'assembly') ||
      (statusFilter === 'listo' && (e.status === 'listo' || e.status === 'homologado' || e.status === 'liberado')) ||
      (statusFilter === 'cuarentena' && e.status === 'cuarentena');

    const matchesSearch =
      e.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vin.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleExportRegistry = () => {
    alert('Generando libro de registro oficial para SUNARP / MTC con firmas criptográficas de los 14 expedientes...');
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-xl text-on-surface uppercase">
            Repositorio & Auditoría Unificada
          </h1>
          <span className="text-xs font-mono text-outline">
            Trazabilidad Pericial • Historial de Folios • Normas ISO
          </span>
        </div>

        <button
          onClick={onNewExpediente}
          className="h-10 px-3.5 rounded-xl bg-primary-container text-on-primary font-headline font-bold text-xs uppercase flex items-center gap-1 shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nuevo</span>
        </button>
      </div>

      {/* KPI Stats Bar (Screen 4) */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-surface-container p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Total Folios</span>
          <span className="font-bold text-lg text-primary">{expedientes.length} Actas</span>
          <span className="text-[9px] text-tertiary">100% Auditables</span>
        </div>
        <div className="bg-surface-container p-2.5 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Evidencias</span>
          <span className="font-bold text-lg text-secondary">
            {expedientes.reduce((acc, e) => acc + (e.evidences?.length || 0), 0)} Fotos
          </span>
          <span className="text-[9px] text-outline">Con Observación</span>
        </div>
        <div className="bg-surface-container p-2.5 rounded-xl border border-tertiary/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Seguridad LOTO</span>
          <span className="font-bold text-lg text-tertiary">0 Fallas</span>
          <span className="text-[9px] text-tertiary">ISO 6469 OK</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por placa, VIN, folio, cliente o técnico..."
          className="w-full h-11 bg-surface-container-high text-on-surface pl-10 pr-4 rounded-xl text-sm font-body border border-surface-variant focus:outline-none focus:border-primary"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            statusFilter === 'all'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Todos ({expedientes.length})
        </button>
        <button
          onClick={() => setStatusFilter('reparacion')}
          className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            statusFilter === 'reparacion'
              ? 'bg-primary-container text-on-primary font-bold'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Servicio Técnico
        </button>
        <button
          onClick={() => setStatusFilter('ensamblaje')}
          className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            statusFilter === 'ensamblaje'
              ? 'bg-tertiary-container text-on-tertiary-container font-bold'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Ensamblaje 0km
        </button>
        <button
          onClick={() => setStatusFilter('listo')}
          className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            statusFilter === 'listo'
              ? 'bg-tertiary text-on-tertiary font-bold'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Liberados / Listos
        </button>
        <button
          onClick={() => setStatusFilter('cuarentena')}
          className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
            statusFilter === 'cuarentena'
              ? 'bg-error text-on-error font-bold'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Cuarentena LOTO
        </button>
      </div>

      {/* Expedientes Table / List (Screen 4) */}
      <div className="flex flex-col gap-2.5">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            onClick={() => onSelectExpediente(exp)}
            className="bg-surface-container hover:bg-surface-container-high p-3.5 rounded-2xl border border-surface-variant/40 hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-primary">{exp.folio}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                  {exp.createdAt}
                </span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  exp.status === 'cuarentena'
                    ? 'bg-error text-on-error animate-pulse'
                    : exp.status === 'listo' || exp.status === 'homologado' || exp.status === 'liberado'
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-secondary text-on-secondary'
                }`}
              >
                {exp.statusLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-surface-container-lowest overflow-hidden shrink-0 border border-surface-variant/50">
                <img src={exp.imageUrl} alt={exp.vehicleModel} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline font-bold text-sm text-on-surface truncate">
                  {exp.vehicleModel}
                </span>
                <span className="text-xs font-mono text-outline">
                  PLACA: <strong className="text-on-surface">{exp.vehiclePlate}</strong> • VIN: {exp.vin.slice(0, 12)}...
                </span>
                <span className="text-[11px] font-mono text-outline truncate">
                  CLIENTE: {exp.clientName}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">
                arrow_forward_ios
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-surface-variant/20 text-[11px] font-mono text-outline">
              <span>RESPONSABLE: {exp.technicianName} ({exp.bayId})</span>
              <span>{exp.evidences?.length || 0} Evidencias</span>
            </div>
          </div>
        ))}
      </div>

      {/* Export to SUNARP Button */}
      <button
        onClick={handleExportRegistry}
        className="w-full h-12 rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary border border-primary/40 font-headline font-bold text-xs uppercase flex items-center justify-center gap-2 mt-2 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">download</span>
        <span>EXPORTAR REPORTE CONSOLIDADO PARA MTC & SUNARP</span>
      </button>
    </div>
  );
};
