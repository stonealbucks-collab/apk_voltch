import React, { useState } from 'react';
import { Expediente, WorkflowType } from '../../types';

interface NewExpedienteFlowProps {
  onCancel: () => void;
  onCreateExpediente: (newExp: Expediente) => void;
}

const FLEET_PRESETS = [
  {
    name: 'Distribuciones Rápidas Lima S.A.C.',
    ruc: '20601928411',
    phone: '+51 987 654 321',
    model: 'Super Soco CPx (L3e)',
    plate: '4812-3B',
    vin: 'L5YTE18C9NA004128',
    soc: 42,
    odometer: 14820,
    type: 'service' as WorkflowType,
  },
  {
    name: 'Envíos Ya Perú S.A.C.',
    ruc: '20601928411',
    phone: '+51 912 345 678',
    model: 'Voltech Cargo Pro 3000W Heavy Duty (L5e)',
    plate: 'EN TRÁMITE',
    vin: '5YTE18C9NA004992',
    soc: 98,
    odometer: 6,
    type: 'assembly' as WorkflowType,
  },
  {
    name: 'Juan Carlos Pérez (Particular)',
    ruc: '10442981921',
    phone: '+51 945 112 233',
    model: 'Yadea G5 Pro',
    plate: 'EV-8821',
    vin: 'L5YTE17A1MA001923',
    soc: 28,
    odometer: 8420,
    type: 'service' as WorkflowType,
  },
];

export const NewExpedienteFlow: React.FC<NewExpedienteFlowProps> = ({
  onCancel,
  onCreateExpediente,
}) => {
  const [workflowType, setWorkflowType] = useState<WorkflowType>('service');
  const [clientName, setClientName] = useState('');
  const [clientRuc, setClientRuc] = useState('');
  const [vehicleModel, setVehicleModel] = useState('Super Soco CPx (L3e)');
  const [vehiclePlate, setVehiclePlate] = useState('4812-3B');
  const [vin, setVin] = useState('L5YTE18C9NA004128');
  const [odometer, setOdometer] = useState('14820');
  const [batterySoc, setBatterySoc] = useState('42');
  const [faultReport, setFaultReport] = useState('Pérdida súbita de par motriz en pendientes y tironeo continuo a >45 km/h.');
  const [bayId, setBayId] = useState('Bahía 03');
  const [technicianName, setTechnicianName] = useState('Roberto Soto');

  const handleApplyPreset = (preset: typeof FLEET_PRESETS[0]) => {
    setWorkflowType(preset.type);
    setClientName(preset.name);
    setClientRuc(preset.ruc);
    setVehicleModel(preset.model);
    setVehiclePlate(preset.plate);
    setVin(preset.vin);
    setOdometer(preset.odometer.toString());
    setBatterySoc(preset.soc.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date();
    const dateCode = timestamp.getFullYear().toString() +
      String(timestamp.getMonth() + 1).padStart(2, '0') +
      String(timestamp.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const folio = `VD-${dateCode}-${randomSuffix}`;

    const newExp: Expediente = {
      id: 'vd-' + Date.now(),
      folio,
      type: workflowType,
      status: workflowType === 'assembly' ? 'ensamblaje' : 'recepcion',
      statusLabel: workflowType === 'assembly' ? '01 En Montaje & Trazabilidad' : '01 Recepción & Inspección',
      stepProgress: workflowType === 'assembly' ? 'Paso 01/03' : 'Paso 01/03',
      createdAt: `${timestamp.getDate()} ${['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC'][timestamp.getMonth()]} ${timestamp.getFullYear()} · ${timestamp.getHours()}:${String(timestamp.getMinutes()).padStart(2, '0')} PET`,
      vehicleModel,
      vehiclePlate: vehiclePlate || 'EN TRÁMITE',
      vin: vin || 'VIN-PENDING',
      clientName: clientName || 'Cliente Particular',
      clientRuc: clientRuc || 'RUC-20000000001',
      odometer: parseInt(odometer) || 0,
      batterySoc: parseInt(batterySoc) || 50,
      batterySpecs: 'Pack Li-Ion 72V Nominal (HV Grade)',
      bayId,
      technicianName,
      technicianRole: 'Especialista Certificado EV Nivel 2',
      technicianCip: 'CIP 194821',
      imageUrl:
        workflowType === 'assembly'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvh500USTLHBK9w3ufnc4GKLtlxwMc_jsiUbQtwlDaoFLCVyHsXkqe1LqVmL2sZgK7INQhplszwUL7uTfRa7wNR4cIQ86P536piT9BwBDSFTXSFaEmvw4ED62yh63kZqnLZMHU921SquWCTJ2WpT46v7Jf6rFqh5yPrgkOTslp78wqzRcsXwFD0vEEpg60Zv3ZUC0kOlVJA4vLqoGDq5Rb8GBAPcy9sIW6Al7E7Kks81goIy4NIwqr'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ7m43MGIcQXwr__Dx8LVq3KxKe4uPtZVmfLwoPr1h756CyaRTVHJMZG5he2IkIGDnt08RPUgOIg6kc5wmH6Vze2LWMH6dQzbOb7FLhRCodzlun4iv_uVOeWx7wCwp83AGIwN9WzYOwcmR60iMWdq_0i-etiIQ3mUaAbcGK9JurIqerTncWcVK6kOV0CS1EPnAtl_4Og7vy_0MiOVY1DCNQ6y8KawpkudR-VOFS4mH9ImwlHlTwuDy',
      highVoltageLive: false,
      isolationResistanceMOhm: 850,
      isLotoActive: true,
      faultSummary: faultReport,
      clientReport: faultReport,
      laborRatePerHour: 80.0,
      subsystems: [
        {
          id: 'sub-1',
          name: 'Potencia HV (Motor HUB 4kW & FOC)',
          icon: 'settings_input_component',
          status: 'regular',
          alertText: 'ALERTA: Ruido/tironeo al acelerar',
          photoCount: 0,
        },
        {
          id: 'sub-2',
          name: 'Frenos Hidráulicos & Regen (CBS)',
          icon: 'auto_read_pause',
          status: 'bueno',
          alertText: 'Presión de manetas y corte OK',
          photoCount: 0,
        },
        {
          id: 'sub-3',
          name: 'Batería & Puerto Anderson SB50',
          icon: 'battery_alert',
          status: 'regular',
          alertText: 'Sulfatación en terminal (+) detectada',
          photoCount: 0,
        },
        {
          id: 'sub-4',
          name: 'Chasis, Horquilla & Neumáticos',
          icon: 'tire_repair',
          status: 'bueno',
          alertText: 'Presión 32 PSI del / 36 PSI tras',
          photoCount: 0,
        },
        {
          id: 'sub-5',
          name: 'Alumbrado Full LED & Bocina',
          icon: 'highlight',
          status: 'bueno',
          alertText: 'Ópticas limpias, destellador OK',
          photoCount: 0,
        },
      ],
      evidences: [],
      workOrders: [
        {
          id: 'ot-1',
          code: 'OT-01',
          title: 'Diagnóstico trifásico y escaneo osciloscópico de sensores Hall',
          status: 'en_proceso',
          estimatedHours: 2.0,
          technician: technicianName,
        },
      ],
      spareParts: [],
      sha256Hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      warrantyPeriodMonths: 6,
      warrantyKilometers: 18000,
    };

    onCreateExpediente(newExp);
  };

  return (
    <div className="pb-24 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-xs font-mono text-outline hover:text-on-surface flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Cancelar
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-primary font-bold">PASO 01 / 05</span>
          <span className="text-xs font-mono text-outline">• SELECTOR DE FLUJO</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-headline font-bold text-2xl text-on-surface uppercase">
          Apertura de Expediente Técnico
        </h1>
        <p className="text-xs font-body text-on-surface-variant">
          Seleccione el tipo de operación para inicializar la hoja pericial y protocolos de seguridad LOTO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Workflow Type Selector Cards (Screen 7) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Flujo A: Servicio Técnico */}
          <div
            onClick={() => setWorkflowType('service')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative ${
              workflowType === 'service'
                ? 'bg-surface-container-high border-primary-container ring-1 ring-primary-container shadow-lg'
                : 'bg-surface-container border-surface-variant/40 hover:border-outline'
            }`}
          >
            {workflowType === 'service' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">build</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-base text-on-surface">
                Servicio Técnico (Flujo A)
              </span>
              <span className="font-mono text-xs text-primary">Mantenimiento & Reparación</span>
            </div>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Para unidades que ingresan por falla, siniestro, peritaje de garantía o mantenimiento correctivo con desconexión HV.
            </p>
          </div>

          {/* Flujo B: Ensamblaje Nuevo */}
          <div
            onClick={() => setWorkflowType('assembly')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-2 relative ${
              workflowType === 'assembly'
                ? 'bg-surface-container-high border-tertiary-container ring-1 ring-tertiary-container shadow-lg'
                : 'bg-surface-container border-surface-variant/40 hover:border-outline'
            }`}
          >
            {workflowType === 'assembly' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">precision_manufacturing</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-base text-on-surface">
                Ensamblaje Nuevo (Flujo B)
              </span>
              <span className="font-mono text-xs text-tertiary">0 km & Homologación</span>
            </div>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Para unidades nuevas cero kilómetros. Trazabilidad serial de 6 componentes, banco dinamométrico y despacho oficial.
            </p>
          </div>
        </div>

        {/* Quick Autofill Presets from Fleet Database */}
        <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-variant/40 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-outline uppercase tracking-wider">
              AUTOCOMPLETAR DESDE FLOTA / CLIENTES RECURRENTES
            </span>
            <span className="text-[10px] font-mono text-primary">RUC / DNI ONLINE</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FLEET_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 rounded-xl bg-surface-container text-left shrink-0 text-xs text-on-surface border border-surface-variant hover:border-primary transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                <div className="flex flex-col">
                  <span className="font-semibold truncate max-w-[180px]">{p.name}</span>
                  <span className="text-[10px] font-mono text-outline">
                    {p.plate} • {p.model.slice(0, 16)}...
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields: Client & Vehicle Details */}
        <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
          <span className="font-headline font-bold text-sm text-primary uppercase">
            01. Datos del Cliente & Flota
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Razón Social / Nombre Completo *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Distribuciones Rápidas Lima S.A.C."
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">RUC / DNI *</label>
              <input
                type="text"
                required
                value={clientRuc}
                onChange={(e) => setClientRuc(e.target.value)}
                placeholder="20601928411"
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <span className="font-headline font-bold text-sm text-primary uppercase pt-2 border-t border-surface-variant/30">
            02. Datos Técnicos de la Unidad
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Modelo de Vehículo *</label>
              <input
                type="text"
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Super Soco CPx (L3e)"
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Placa de Rodaje</label>
              <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="4812-3B o EN TRÁMITE"
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Número de Chasis (VIN) *</label>
              <input
                type="text"
                required
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="L5YTE18C9NA004128"
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-mono uppercase border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-on-surface-variant">Odómetro (km)</label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-mono border border-surface-variant focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-on-surface-variant">SOC Batería (%)</label>
                <input
                  type="number"
                  value={batterySoc}
                  onChange={(e) => setBatterySoc(e.target.value)}
                  className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-mono border border-surface-variant focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <label className="text-xs font-mono text-on-surface-variant">
              Motivo de Ingreso / Reporte de Falla
            </label>
            <textarea
              rows={2}
              value={faultReport}
              onChange={(e) => setFaultReport(e.target.value)}
              placeholder="Describa el comportamiento reportado por el conductor..."
              className="w-full bg-surface-container-high text-on-surface p-2.5 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Bahía Asignada</label>
              <select
                value={bayId}
                onChange={(e) => setBayId(e.target.value)}
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-mono border border-surface-variant focus:border-primary focus:outline-none"
              >
                <option value="Bahía 01">Bahía 01 - Diagnóstico Rápido</option>
                <option value="Bahía 02">Bahía 02 - Línea de Ensamblaje</option>
                <option value="Bahía 03">Bahía 03 - Alta Tensión & FOC</option>
                <option value="Bahía 04">Bahía 04 - Banco Dinamométrica</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-on-surface-variant">Técnico Responsable</label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                className="w-full h-10 bg-surface-container-high text-on-surface px-3 rounded-lg text-sm font-body border border-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full h-14 rounded-2xl bg-primary-container text-on-primary font-headline font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-primary-container/20 active:scale-[0.98] transition-transform"
        >
          <span>CONTINUAR A {workflowType === 'assembly' ? 'ENSAMBLAJE SERIAL' : 'INSPECCIÓN & FOTO EVIDENCIA'}</span>
          <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
        </button>
      </form>
    </div>
  );
};
