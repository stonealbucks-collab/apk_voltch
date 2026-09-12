import React, { useState } from 'react';
import { Expediente } from '../../types';
import { SignaturePad } from '../SignaturePad';

interface ReleaseCertificationViewProps {
  expediente: Expediente;
  onUpdateExpediente: (updated: Expediente) => void;
  onViewOfficialCertificate: () => void;
}

export const ReleaseCertificationView: React.FC<ReleaseCertificationViewProps> = ({
  expediente,
  onUpdateExpediente,
  onViewOfficialCertificate,
}) => {
  const [securityChecks, setSecurityChecks] = useState({
    isolationOk: true,
    torquesOk: true,
    lotoDeprecintado: true,
    dynoRoadTestOk: true,
    extinguisherLabelOk: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleToggleCheck = (key: keyof typeof securityChecks) => {
    setSecurityChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksPassed = Object.values(securityChecks).every(Boolean);

  const handleConfirmRelease = () => {
    onUpdateExpediente({
      ...expediente,
      status: 'liberado',
      statusLabel: '06 Liberado / Despachado',
      stepProgress: '03 / 03 Completo',
    });
    setShowConfirmModal(false);
    onViewOfficialCertificate();
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto flex flex-col gap-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-tertiary font-bold">FASE 03 / 03</span>
          <span className="text-xs font-mono text-outline">• LIBERACIÓN TÉCNICA FINAL</span>
        </div>
        <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-surface-container text-primary font-semibold">
          {expediente.folio}
        </span>
      </div>

      {/* Release Hero Card */}
      <div className="bg-surface-container rounded-2xl p-4 border border-tertiary/40 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg text-on-surface">
              {expediente.vehicleModel}
            </span>
            <span className="text-xs font-mono text-outline">
              PLACA: <strong className="text-on-surface">{expediente.vehiclePlate}</strong> • VIN:{' '}
              <strong className="text-primary">{expediente.vin}</strong>
            </span>
          </div>
          <span className="px-3 py-1 rounded-lg bg-tertiary-container text-on-tertiary-container font-mono text-xs font-bold uppercase">
            CONTROL DE CALIDAD (QC)
          </span>
        </div>
      </div>

      {/* Checklist de Seguridad EV (5/5) (Screen 6) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
            <span className="font-headline font-bold text-sm text-on-surface uppercase">
              Checklist de Seguridad EV // Liberación a Ruta
            </span>
          </div>
          <span className="font-mono text-xs text-tertiary font-bold">
            {Object.values(securityChecks).filter(Boolean).length}/5 Aptos
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={securityChecks.isolationOk}
                onChange={() => handleToggleCheck('isolationOk')}
                className="w-4 h-4 accent-tertiary rounded"
              />
              <span className="text-xs font-mono text-on-surface">
                1. Aislamiento Dieléctrico {'>'} 500 kΩ (Medido: {expediente.isolationResistanceMOhm} MΩ)
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </label>

          <label className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={securityChecks.torquesOk}
                onChange={() => handleToggleCheck('torquesOk')}
                className="w-4 h-4 accent-tertiary rounded"
              />
              <span className="text-xs font-mono text-on-surface">
                2. Torques Críticos Marcados con Laca Testigo (Ejes y Calipers)
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </label>

          <label className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={securityChecks.lotoDeprecintado}
                onChange={() => handleToggleCheck('lotoDeprecintado')}
                className="w-4 h-4 accent-tertiary rounded"
              />
              <span className="text-xs font-mono text-on-surface">
                3. Candados LOTO Retirados y Fusible Cerámico 150A Armado
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </label>

          <label className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={securityChecks.dynoRoadTestOk}
                onChange={() => handleToggleCheck('dynoRoadTestOk')}
                className="w-4 h-4 accent-tertiary rounded"
              />
              <span className="text-xs font-mono text-on-surface">
                4. Prueba Dinamómetrica / Ruta de 3 km sin Errores OBD-II
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </label>

          <label className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={securityChecks.extinguisherLabelOk}
                onChange={() => handleToggleCheck('extinguisherLabelOk')}
                className="w-4 h-4 accent-tertiary rounded"
              />
              <span className="text-xs font-mono text-on-surface">
                5. Rotulado de Advertencia Alta Tensión & Sticker Voltech QC
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </label>
        </div>
      </div>

      {/* Warranty Policy (Screen 6) */}
      <div className="bg-surface-container rounded-2xl p-4 border border-surface-variant/40 flex flex-col gap-2">
        <span className="font-headline font-bold text-xs text-primary uppercase">
          Póliza de Garantía Oficial de Taller Voltech
        </span>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40">
            <span className="text-[10px] text-outline block uppercase">Cobertura Temporal</span>
            <span className="font-bold text-sm text-tertiary">
              {expediente.warrantyPeriodMonths} Meses
            </span>
            <span className="text-[10px] text-outline block">Mano de obra y partes</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/40">
            <span className="text-[10px] text-outline block uppercase">Cobertura Kilometraje</span>
            <span className="font-bold text-sm text-primary">
              {expediente.warrantyKilometers.toLocaleString()} km
            </span>
            <span className="text-[10px] text-outline block">Lo que ocurra primero</span>
          </div>
        </div>
      </div>

      {/* Engineer & Client Conformity Signatures (Screen 6) */}
      <div className="flex flex-col gap-3">
        <div className="bg-surface-container rounded-2xl p-3.5 border border-surface-variant/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-tertiary text-[24px]">verified_user</span>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xs text-on-surface uppercase">
                Ingeniero Responsable // {expediente.technicianName}
              </span>
              <span className="text-[11px] font-mono text-outline">
                {expediente.technicianCip} • Certificación Nivel 2 EV
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-tertiary font-bold px-2 py-0.5 rounded bg-tertiary-container/20">
            FIRMA DIGITAL ACTIVA
          </span>
        </div>

        <SignaturePad
          label="Firma de Conformidad y Recepción de Unidad (Cliente / Flota)"
          roleDescription="Certifica la conformidad del servicio realizado y recepción del vehículo operativo"
          savedSignature={expediente.clientSignature}
          onSaveSignature={(sig) => onUpdateExpediente({ ...expediente, clientSignature: sig })}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={!allChecksPassed}
          className={`w-full h-14 rounded-2xl font-headline font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
            allChecksPassed
              ? 'bg-tertiary-container text-on-tertiary-container shadow-tertiary-container/20 active:scale-[0.98]'
              : 'bg-surface-container-high text-outline cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">check_circle</span>
          <span>LIBERAR VEHÍCULO Y EMITIR CERTIFICADO OFICIAL A4</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={onViewOfficialCertificate}
          className="w-full h-11 rounded-xl bg-surface-container text-primary font-mono text-xs font-semibold hover:bg-surface-container-high flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span>Ver Borrador del Expediente A4 sin Cerrar Folio</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-2xl max-w-sm w-full p-5 border border-tertiary/40 flex flex-col gap-3 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/20 text-tertiary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface uppercase">
              ¿Confirmar Liberación de la Unidad?
            </h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Esta acción cerrará el folio <strong className="text-primary">{expediente.folio}</strong>,
              desprecintará el vehículo y generará el acta técnica con hash criptográfico SHA-256 para el cliente y SUNARP.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-11 rounded-xl bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
              >
                Revisar Más
              </button>
              <button
                onClick={handleConfirmRelease}
                className="flex-1 h-11 rounded-xl bg-tertiary-container text-on-tertiary-container font-headline font-bold text-xs uppercase"
              >
                Sí, Liberar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
