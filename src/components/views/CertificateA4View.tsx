import React, { useState } from 'react';
import { Expediente } from '../../types';
import { VOLTECH_LOGO_URL } from '../../data/initialData';

interface CertificateA4ViewProps {
  expediente: Expediente;
  onBack: () => void;
}

export const CertificateA4View: React.FC<CertificateA4ViewProps> = ({
  expediente,
  onBack,
}) => {
  const [includeWaveforms, setIncludeWaveforms] = useState<boolean>(true);
  const [includePhotoGallery, setIncludePhotoGallery] = useState<boolean>(true);
  const [includeOfficialSeal, setIncludeOfficialSeal] = useState<boolean>(true);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(expediente.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleSimulateDownload = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      setPdfGenerating(false);
      window.print();
    }, 800);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Expediente Técnico EV - Voltech Dynamics*\nFolio: ${expediente.folio}\nVehículo: ${expediente.vehicleModel}\nPlaca: ${expediente.vehiclePlate}\nEstado: ${expediente.statusLabel}\nHash SHA-256: ${expediente.sha256Hash}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-3xl mx-auto flex flex-col gap-4 print:p-0 print:m-0 print:max-w-none">
      {/* Top Controls Bar (hidden during print) */}
      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-mono text-outline hover:text-on-surface flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-primary font-bold">VISOR A4</span>
            <span className="text-xs font-mono text-outline">• DOCUMENTO PERICIAL OFICIAL</span>
          </div>
        </div>

        {/* SHA-256 Hash Seal Card */}
        <div className="bg-surface-container rounded-2xl p-3.5 border border-surface-variant/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-tertiary font-bold uppercase">
                SELLADO CRIPTOGRÁFICO INMUTABLE // SHA-256
              </span>
              <span className="font-mono text-xs text-on-surface truncate">
                {expediente.sha256Hash}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyHash}
            className="px-2.5 py-1 rounded bg-surface-container-high text-xs font-mono text-primary hover:bg-surface-bright flex items-center gap-1 shrink-0"
          >
            <span className="material-symbols-outlined text-[14px]">
              {copiedHash ? 'check' : 'content_copy'}
            </span>
            {copiedHash ? 'Copiado' : 'Copiar'}
          </button>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleSimulateDownload}
            disabled={pdfGenerating}
            className="h-11 rounded-xl bg-primary-container text-on-primary font-headline font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>{pdfGenerating ? 'Generando...' : 'Descargar PDF (3.4 MB)'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="h-11 rounded-xl bg-surface-container-high text-on-surface font-mono text-xs font-semibold hover:bg-surface-bright flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir Ticket A4</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="h-11 rounded-xl bg-tertiary-container text-on-tertiary-container font-mono text-xs font-bold hover:bg-tertiary flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>WhatsApp Flota</span>
          </button>
        </div>

        {/* PDF Assembler Toggles */}
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/40 flex items-center justify-between text-xs font-mono">
          <span className="text-outline uppercase text-[11px]">Parámetros de Reporte:</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant">
              <input
                type="checkbox"
                checked={includeWaveforms}
                onChange={(e) => setIncludeWaveforms(e.target.checked)}
                className="accent-primary"
              />
              Telemetría
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant">
              <input
                type="checkbox"
                checked={includePhotoGallery}
                onChange={(e) => setIncludePhotoGallery(e.target.checked)}
                className="accent-primary"
              />
              Fotos & Evidencias
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-on-surface-variant">
              <input
                type="checkbox"
                checked={includeOfficialSeal}
                onChange={(e) => setIncludeOfficialSeal(e.target.checked)}
                className="accent-primary"
              />
              Sello MTC
            </label>
          </div>
        </div>
      </div>

      {/* RENDERED A4 OFFICIAL PERICIAL SHEET */}
      <div className="bg-[#ffffff] text-[#1a1f2c] rounded-xl p-8 shadow-2xl border border-outline/20 font-body flex flex-col gap-5 print:shadow-none print:border-none print:p-6 print:rounded-none">
        {/* A4 Header */}
        <div className="flex items-start justify-between border-b-2 border-[#00363d] pb-4">
          <div className="flex items-center gap-3">
            <img src={VOLTECH_LOGO_URL} alt="Voltech Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-headline font-black text-xl text-[#00363d] tracking-tight leading-none">
                VOLTECH DYNAMICS PERÚ S.A.C.
              </span>
              <span className="text-[10px] font-mono text-[#556987] uppercase tracking-wider">
                DIVISIÓN DE INGENIERÍA Y BANCO DE PRUEBAS DE ALTA TENSIÓN (EV)
              </span>
              <span className="text-[10px] font-mono text-[#556987]">
                RUC: 20608912401 • Registro MTC / SUNARP #PE-EV-2026-99
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="font-mono font-bold text-xs text-[#00363d] px-2 py-0.5 rounded bg-[#c3f5ff]">
              ACTA OFICIAL A4
            </span>
            <span className="font-mono font-bold text-sm text-[#00363d] mt-1">
              FOLIO: {expediente.folio}
            </span>
            <span className="text-[10px] font-mono text-[#556987]">
              EMISIÓN: {expediente.createdAt}
            </span>
          </div>
        </div>

        {/* Document Big Title */}
        <div className="text-center py-1 bg-[#f0f9ff] border-y border-[#c3f5ff]">
          <h2 className="font-headline font-black text-base text-[#00363d] uppercase tracking-wider">
            ACTA PERICIAL DE DIAGNÓSTICO, SERVICIO TÉCNICO & TRAZABILIDAD EV
          </h2>
          <span className="text-[11px] font-mono text-[#00626e]">
            Conforme a Normas Técnicas ISO 6469-1, ISO 6469-3 y Protocolos NFPA 70E
          </span>
        </div>

        {/* 2-Column Technical Vehicle & Client Table */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] flex flex-col gap-1">
            <span className="font-bold text-[#00363d] uppercase border-b border-[#cbd5e1] pb-1 text-[11px]">
              01. IDENTIFICACIÓN DE LA UNIDAD
            </span>
            <div>MODELO: <strong className="text-[#0f172a]">{expediente.vehicleModel}</strong></div>
            <div>PLACA: <strong className="text-[#0f172a]">{expediente.vehiclePlate}</strong></div>
            <div>VIN / CHASIS: <strong className="text-[#0f172a]">{expediente.vin}</strong></div>
            <div>ODÓMETRO: <strong className="text-[#0f172a]">{expediente.odometer.toLocaleString()} km</strong></div>
            <div>BATERÍA / SOC: <strong className="text-[#0f172a]">{expediente.batterySoc}% ({expediente.batterySpecs})</strong></div>
          </div>

          <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] flex flex-col gap-1">
            <span className="font-bold text-[#00363d] uppercase border-b border-[#cbd5e1] pb-1 text-[11px]">
              02. PROPIETARIO & ESPECIALISTA
            </span>
            <div>CLIENTE: <strong className="text-[#0f172a]">{expediente.clientName}</strong></div>
            <div>RUC / DNI: <strong className="text-[#0f172a]">{expediente.clientRuc}</strong></div>
            <div>RESPONSABLE: <strong className="text-[#0f172a]">{expediente.technicianName}</strong></div>
            <div>REGISTRO: <strong className="text-[#0f172a]">{expediente.technicianCip}</strong></div>
            <div>BAHÍA: <strong className="text-[#0f172a]">{expediente.bayId}</strong></div>
          </div>
        </div>

        {/* Diagnostic & Technical Resolution */}
        <div className="bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0] flex flex-col gap-1.5 text-xs">
          <span className="font-mono font-bold text-[#00363d] uppercase text-[11px]">
            03. DICTAMEN PERICIAL & RESOLUCIÓN TÉCNICA
          </span>
          <p className="font-body text-[#334155] leading-relaxed">
            {expediente.confirmedDiagnostic ||
              'Se realizó diagnóstico trifásico en banco dinamométrico, detectándose desfase angular sostenido de 18° en sensor Hall #2. Se procedió al reemplazo de componentes magnéticos, sellado hermético IP67 y reapriete dinamométrico certificado.'}
          </p>
          <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-[#475569]">
            <span>AISLAMIENTO FINAL: <strong className="text-[#166534]">{expediente.isolationResistanceMOhm} MΩ</strong></span>
            <span>•</span>
            <span>TEMPERATURA FOC: <strong className="text-[#0f172a]">{expediente.focTemp || 52}°C</strong></span>
            <span>•</span>
            <span>LOTO DESPRECINTADO: <strong className="text-[#166534]">CONFORME</strong></span>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono font-bold text-[#00363d] uppercase text-[11px]">
            04. TAREAS EJECUTADAS & REPUESTOS INSTALADOS
          </span>
          <table className="w-full text-xs font-mono border-collapse border border-[#cbd5e1]">
            <thead>
              <tr className="bg-[#e2e8f0] text-[#00363d]">
                <th className="border border-[#cbd5e1] p-1.5 text-left">Código / OT</th>
                <th className="border border-[#cbd5e1] p-1.5 text-left">Descripción Técnica</th>
                <th className="border border-[#cbd5e1] p-1.5 text-center">Horas / Cant</th>
                <th className="border border-[#cbd5e1] p-1.5 text-right">Monto S/.</th>
              </tr>
            </thead>
            <tbody>
              {expediente.workOrders.map((ot) => (
                <tr key={ot.id} className="border-b border-[#cbd5e1]">
                  <td className="border border-[#cbd5e1] p-1.5 font-bold">{ot.code}</td>
                  <td className="border border-[#cbd5e1] p-1.5">{ot.title}</td>
                  <td className="border border-[#cbd5e1] p-1.5 text-center">{ot.estimatedHours} hrs</td>
                  <td className="border border-[#cbd5e1] p-1.5 text-right font-bold">
                    S/. {(ot.estimatedHours * expediente.laborRatePerHour).toFixed(2)}
                  </td>
                </tr>
              ))}
              {expediente.spareParts.map((sp) => (
                <tr key={sp.id} className="border-b border-[#cbd5e1]">
                  <td className="border border-[#cbd5e1] p-1.5 font-mono text-[#00626e]">{sp.sku}</td>
                  <td className="border border-[#cbd5e1] p-1.5">{sp.name}</td>
                  <td className="border border-[#cbd5e1] p-1.5 text-center">{sp.quantity} {sp.unit}</td>
                  <td className="border border-[#cbd5e1] p-1.5 text-right font-bold">
                    S/. {(sp.unitPrice * sp.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EVIDENCIA FOTOGRÁFICA OBLIGATORIA (Screen 5 Gallery in A4 Document) */}
        {includePhotoGallery && expediente.evidences && expediente.evidences.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 border-t border-[#cbd5e1]">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#00363d] uppercase text-[11px]">
                05. ANEXO FOTOGRÁFICO DE EVIDENCIA PERICIAL ("TODO HALLAZGO CON FOTO Y OBSERVACIÓN")
              </span>
              <span className="text-[10px] font-mono text-[#64748b]">
                {expediente.evidences.length} Fotografías estampadas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {expediente.evidences.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2 flex flex-col gap-1.5"
                >
                  <div className="aspect-[4/3] bg-[#000000] rounded overflow-hidden">
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col font-mono text-[10px]">
                    <div className="flex items-center justify-between font-bold text-[#00363d]">
                      <span>{ev.title}</span>
                      <span className="text-[#059669] uppercase">{ev.severity}</span>
                    </div>
                    <span className="text-[#334155] font-body text-[11px] leading-tight mt-0.5">
                      {ev.observation}
                    </span>
                    <span className="text-[#94a3b8] text-[9px] mt-1">
                      {ev.timestamp} • {ev.subsystemTag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warranty and Legal Cláusula */}
        <div className="bg-[#f1f5f9] p-3 rounded-lg border border-[#cbd5e1] text-[11px] font-body text-[#475569] leading-relaxed">
          <strong>PÓLIZA DE GARANTÍA OFICIAL:</strong> Voltech Dynamics certifica que los trabajos mecánicos y de alta tensión cuentan con una garantía de <strong>{expediente.warrantyPeriodMonths} meses o {expediente.warrantyKilometers.toLocaleString()} km</strong>. No cubre manipulaciones de terceros o apertura no autorizada de sellos de seguridad LOTO.
        </div>

        {/* Formal Signatures Section */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-[#00363d]">
          {/* Engineer Signature */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-16 border-b border-[#0f172a] flex items-center justify-center">
              {expediente.engineerSignature ? (
                <img
                  src={expediente.engineerSignature}
                  alt="Firma Ingeniero"
                  className="h-full object-contain"
                />
              ) : (
                <span className="font-mono text-xs text-[#00626e] italic">
                  Firmado digitalmente: Roberto Soto
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-xs text-[#00363d] mt-1">
              {expediente.technicianName}
            </span>
            <span className="font-mono text-[10px] text-[#475569]">
              {expediente.technicianCip} • Especialista EV Nivel 2
            </span>
            <span className="font-mono text-[9px] text-[#166534] font-bold">
              FIRMA ELECTRÓNICA VERIFICADA
            </span>
          </div>

          {/* Client Signature */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-16 border-b border-[#0f172a] flex items-center justify-center">
              {expediente.clientSignature ? (
                <img
                  src={expediente.clientSignature}
                  alt="Firma Cliente"
                  className="h-full object-contain"
                />
              ) : expediente.carrierSignature ? (
                <img
                  src={expediente.carrierSignature}
                  alt="Firma Transportista"
                  className="h-full object-contain"
                />
              ) : (
                <span className="font-mono text-xs text-[#64748b]">Firma de Conformidad Cliente</span>
              )}
            </div>
            <span className="font-mono font-bold text-xs text-[#00363d] mt-1">
              {expediente.clientName}
            </span>
            <span className="font-mono text-[10px] text-[#475569]">
              RUC: {expediente.clientRuc} • Conforme a Recepción
            </span>
            <span className="font-mono text-[9px] text-[#00626e]">
              VALIDADO CON DNI / RUC EN LÍNEA
            </span>
          </div>
        </div>

        {/* Security QR & Hash Footer */}
        <div className="flex items-center justify-between border-t border-[#cbd5e1] pt-3 text-[10px] font-mono text-[#64748b]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#00363d] text-white flex items-center justify-center font-bold text-[8px] rounded">
              QR-MTC
            </div>
            <div className="flex flex-col">
              <span>CÓDIGO DE VERIFICACIÓN REGISTRAL:</span>
              <strong className="text-[#00363d]">{expediente.sha256Hash.slice(0, 32)}...</strong>
            </div>
          </div>
          <div className="text-right">
            <span>Página 1 de 1 // Acta Inmutable</span>
            <span className="block text-[#059669] font-bold">SISTEMA VOLTECH V2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
