import React, { useState } from 'react';
import { Expediente } from '../../types';

interface BatteryTelemetryViewProps {
  expediente: Expediente;
  onOpenLiveCamera: (subsystemName?: string) => void;
}

export const BatteryTelemetryView: React.FC<BatteryTelemetryViewProps> = ({
  expediente,
  onOpenLiveCamera,
}) => {
  const [activeBalancing, setActiveBalancing] = useState<boolean>(true);

  // Generate 20S Cell Voltages simulating CATL LFP or NMC pack
  const cells = [
    { num: 1, v: 3.621, temp: 28.4, delta: 0.002 },
    { num: 2, v: 3.619, temp: 28.6, delta: 0.000 },
    { num: 3, v: 3.624, temp: 29.1, delta: 0.005 },
    { num: 4, v: 3.620, temp: 28.9, delta: 0.001 },
    { num: 5, v: 3.622, temp: 28.5, delta: 0.003 },
    { num: 6, v: 3.618, temp: 28.2, delta: -0.001 },
    { num: 7, v: 3.625, temp: 29.0, delta: 0.006 },
    { num: 8, v: 3.621, temp: 28.7, delta: 0.002 },
    { num: 9, v: 3.620, temp: 28.8, delta: 0.001 },
    { num: 10, v: 3.623, temp: 29.2, delta: 0.004 },
    { num: 11, v: 3.619, temp: 28.6, delta: 0.000 },
    { num: 12, v: 3.622, temp: 28.7, delta: 0.003 },
    { num: 13, v: 3.620, temp: 28.5, delta: 0.001 },
    { num: 14, v: 3.621, temp: 28.8, delta: 0.002 },
    { num: 15, v: 3.617, temp: 28.4, delta: -0.002 },
    { num: 16, v: 3.624, temp: 29.3, delta: 0.005 },
    { num: 17, v: 3.620, temp: 28.9, delta: 0.001 },
    { num: 18, v: 3.622, temp: 28.6, delta: 0.003 },
    { num: 19, v: 3.619, temp: 28.5, delta: 0.000 },
    { num: 20, v: 3.621, temp: 28.7, delta: 0.002 },
  ];

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-xl text-on-surface uppercase">
            Telemetría Smart BMS // Batería HV
          </h1>
          <span className="text-xs font-mono text-outline">
            {expediente.vehicleModel} • {expediente.batterySpecs}
          </span>
        </div>

        <button
          onClick={() => onOpenLiveCamera('Batería & Puerto Anderson SB50')}
          className="h-10 px-3 rounded-xl bg-primary-container/20 text-primary-container font-mono text-xs font-bold flex items-center gap-1 hover:bg-primary-container/30"
        >
          <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
          <span>Foto Pack</span>
        </button>
      </div>

      {/* Main Pack Metrics */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Tensión Pack</span>
          <span className="font-bold text-lg text-primary">72.4 V</span>
          <span className="text-[9px] text-tertiary">DC Nominal</span>
        </div>
        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">SOC Carga</span>
          <span className="font-bold text-lg text-tertiary">{expediente.batterySoc}%</span>
          <span className="text-[9px] text-outline">Disponible</span>
        </div>
        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Salud (SOH)</span>
          <span className="font-bold text-lg text-primary">98.4%</span>
          <span className="text-[9px] text-tertiary">Grado A</span>
        </div>
        <div className="bg-surface-container p-3 rounded-xl border border-surface-variant/40 flex flex-col">
          <span className="text-[10px] text-outline uppercase">Delta Celda</span>
          <span className="font-bold text-lg text-secondary">8 mV</span>
          <span className="text-[9px] text-outline">Max Diff</span>
        </div>
      </div>

      {/* Balancing Status Card */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">balance</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm text-on-surface uppercase">
              Balanceador Activo 2A por Celda
            </span>
            <span className="text-xs font-mono text-outline">
              Smart BMS CAN-Bus • Disipación térmica controlada
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveBalancing(!activeBalancing)}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
            activeBalancing
              ? 'bg-tertiary text-on-tertiary'
              : 'bg-surface-container-high text-outline'
          }`}
        >
          {activeBalancing ? 'ACTIVO' : 'PAUSADO'}
        </button>
      </div>

      {/* 20S Cell Voltage Grid */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-sm text-on-surface uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">apps</span>
            Monitoreo 20 Celdas en Serie (20S)
          </span>
          <span className="text-[11px] font-mono text-outline">Rango: 3.2V - 3.65V</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {cells.map((cell) => (
            <div
              key={cell.num}
              className="bg-surface-container-low p-2 rounded-xl border border-surface-variant/40 flex flex-col text-center"
            >
              <span className="text-[10px] font-mono text-outline">C{cell.num}</span>
              <span className="font-mono font-bold text-xs text-primary">{cell.v.toFixed(3)}V</span>
              <span className="text-[9px] font-mono text-tertiary">{cell.temp}°C</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resistance & Thermal Insulation */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-2">
        <span className="font-headline font-bold text-xs text-primary uppercase">
          Parámetros Dieléctricos & Resistencia Interna
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40">
            <span className="text-[10px] text-outline block uppercase">Resistencia Pack</span>
            <span className="font-bold text-sm text-on-surface">1.42 mΩ</span>
            <span className="text-[10px] text-tertiary block">Baja impedancia nominal</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40">
            <span className="text-[10px] text-outline block uppercase">Aislamiento a Masa</span>
            <span className="font-bold text-sm text-tertiary">
              {expediente.isolationResistanceMOhm} MΩ @ 1000V
            </span>
            <span className="text-[10px] text-outline block">Aprobado ISO 6469</span>
          </div>
        </div>
      </div>
    </div>
  );
};
