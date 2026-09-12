import React, { useState } from 'react';
import { Expediente, EvidencePhoto } from './types';
import { INITIAL_EXPEDIENTES } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { RuggedCameraModal } from './components/RuggedCameraModal';
import { DashboardView } from './components/views/DashboardView';
import { NewExpedienteFlow } from './components/views/NewExpedienteFlow';
import { ReceptionInspectionView } from './components/views/ReceptionInspectionView';
import { ActiveExpedienteView } from './components/views/ActiveExpedienteView';
import { AssemblyFlowView } from './components/views/AssemblyFlowView';
import { ReleaseCertificationView } from './components/views/ReleaseCertificationView';
import { CertificateA4View } from './components/views/CertificateA4View';
import { AuditRepositoryView } from './components/views/AuditRepositoryView';
import { BatteryTelemetryView } from './components/views/BatteryTelemetryView';

export default function App() {
  const [expedientes, setExpedientes] = useState<Expediente[]>(INITIAL_EXPEDIENTES);
  const [activeExpedienteId, setActiveExpedienteId] = useState<string>('vd-004');
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');
  const [isNewExpedienteOpen, setIsNewExpedienteOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraSubsystem, setCameraSubsystem] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [safetyAlertsOpen, setSafetyAlertsOpen] = useState<boolean>(false);

  const activeExpediente =
    expedientes.find((e) => e.id === activeExpedienteId) || expedientes[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateExpediente = (updated: Expediente) => {
    setExpedientes((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  const handleCreateNewExpediente = (newExp: Expediente) => {
    setExpedientes((prev) => [newExp, ...prev]);
    setActiveExpedienteId(newExp.id);
    setIsNewExpedienteOpen(false);
    if (newExp.type === 'assembly') {
      setCurrentTab('ensamblaje');
    } else {
      setCurrentTab('recepcion');
    }
    showToast(`Nuevo expediente ${newExp.folio} creado exitosamente.`);
  };

  const handleSelectExpedienteFromList = (exp: Expediente) => {
    setActiveExpedienteId(exp.id);
    if (exp.type === 'assembly') {
      setCurrentTab('ensamblaje');
    } else if (exp.status === 'recepcion') {
      setCurrentTab('recepcion');
    } else if (exp.status === 'liberado' || exp.status === 'homologado') {
      setCurrentTab('certificado');
    } else {
      setCurrentTab('expediente');
    }
  };

  const handleTriggerCamera = (subsystemName?: string) => {
    setCameraSubsystem(subsystemName);
    setIsCameraOpen(true);
  };

  const handleSaveEvidenceFromCamera = (evidence: EvidencePhoto) => {
    if (!activeExpediente) return;

    // Link evidence to expediente and update photo count in subsystem
    const updatedEvidences = [evidence, ...(activeExpediente.evidences || [])];

    const updatedSubsystems = activeExpediente.subsystems?.map((sub) => {
      if (sub.name.toLowerCase().includes(evidence.subsystemTag.toLowerCase()) ||
          evidence.subsystemTag.toLowerCase().includes(sub.name.toLowerCase())) {
        return {
          ...sub,
          photoCount: sub.photoCount + 1,
          observationNote: evidence.observation,
        };
      }
      return sub;
    });

    const updatedExp: Expediente = {
      ...activeExpediente,
      evidences: updatedEvidences,
      subsystems: updatedSubsystems || activeExpediente.subsystems,
    };

    handleUpdateExpediente(updatedExp);
    showToast(`Evidencia fotográfica vinculada con observación técnica.`);
  };

  // Section titles for Header
  const getSectionTitle = () => {
    if (isNewExpedienteOpen) return 'Nuevo Registro // Flujo';
    switch (currentTab) {
      case 'inicio':
        return 'Tablero de Bahías // Bahía 03';
      case 'recepcion':
        return 'Fase 1: Recepción & Inspección Asistida';
      case 'expediente':
        return 'Fase 2: Diagnóstico Trifásico & OTs';
      case 'ensamblaje':
        return 'Flujo Ensamblaje 0km // Trazabilidad & Banco';
      case 'bateria':
        return 'Telemetría Smart BMS // Pack 72V HV';
      case 'certificado':
        return 'Visor Previo Acta Pericial A4';
      case 'auditoria':
        return 'Auditoría Unificada & Repositorio';
      default:
        return 'Taller EV';
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-body selection:bg-primary-container selection:text-on-primary">
      {/* Top Header with Brand, Folio, Safety status */}
      <Header
        currentSectionTitle={getSectionTitle()}
        activeFolio={activeExpediente?.folio}
        isHvSafe={!activeExpediente?.highVoltageLive}
        showBack={currentTab !== 'inicio' || isNewExpedienteOpen}
        onBack={() => {
          if (isNewExpedienteOpen) {
            setIsNewExpedienteOpen(false);
          } else {
            setCurrentTab('inicio');
          }
        }}
        onOpenSearch={() => setSearchOpen(!searchOpen)}
        onOpenNotifications={() => setSafetyAlertsOpen(!safetyAlertsOpen)}
        unreadCount={activeExpediente?.isolationResistanceMOhm < 1 ? 2 : 1}
      />

      {/* Safety Alerts Overlay Popover */}
      {safetyAlertsOpen && (
        <div className="fixed top-18 right-4 z-50 bg-surface-container rounded-2xl p-4 border border-error/50 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
            <span className="font-headline font-bold text-xs text-error uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Protocolos de Seguridad HV
            </span>
            <button
              onClick={() => setSafetyAlertsOpen(false)}
              className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-error-container/20 border border-error/40 text-on-surface">
              <strong className="text-error block uppercase">Regla de Evidencia 100%:</strong>
              Todo lo que se ve o se inspecciona se evidencia obligatoriamente con una imagen y observación técnica.
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low border border-surface-variant/40 text-on-surface">
              <strong className="text-primary block uppercase">EPP Clase 0 (1000V):</strong>
              Uso de guantes dieléctricos verificado para Bahía 03.
            </div>
          </div>
        </div>
      )}

      {/* Search Bar Popover */}
      {searchOpen && (
        <div className="fixed top-18 inset-x-4 max-w-xl mx-auto z-50 bg-surface-container p-3 rounded-2xl border border-primary/40 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">search</span>
            <input
              type="text"
              autoFocus
              placeholder="Buscar vehículo, placa, VIN o folio..."
              className="flex-1 bg-transparent text-sm text-on-surface focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCurrentTab('auditoria');
                  setSearchOpen(false);
                }
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs font-mono text-outline hover:text-on-surface"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {isNewExpedienteOpen ? (
          <NewExpedienteFlow
            onCancel={() => setIsNewExpedienteOpen(false)}
            onCreateExpediente={handleCreateNewExpediente}
          />
        ) : (
          <>
            {currentTab === 'inicio' && (
              <DashboardView
                expedientes={expedientes}
                onSelectExpediente={handleSelectExpedienteFromList}
                onNewExpediente={() => setIsNewExpedienteOpen(true)}
                onOpenAudit={() => setCurrentTab('auditoria')}
              />
            )}

            {currentTab === 'recepcion' && (
              <ReceptionInspectionView
                expediente={activeExpediente}
                onUpdateExpediente={handleUpdateExpediente}
                onOpenLiveCamera={handleTriggerCamera}
                onAdvanceToDiagnosis={() => setCurrentTab('expediente')}
              />
            )}

            {currentTab === 'expediente' && (
              <ActiveExpedienteView
                expediente={activeExpediente}
                onUpdateExpediente={handleUpdateExpediente}
                onOpenLiveCamera={handleTriggerCamera}
                onAdvanceToCertification={() => setCurrentTab('certificado')}
              />
            )}

            {currentTab === 'ensamblaje' && (
              <AssemblyFlowView
                expediente={activeExpediente}
                onUpdateExpediente={handleUpdateExpediente}
                onOpenLiveCamera={handleTriggerCamera}
                onFinishAssembly={() => setCurrentTab('certificado')}
              />
            )}

            {currentTab === 'bateria' && (
              <BatteryTelemetryView
                expediente={activeExpediente}
                onOpenLiveCamera={handleTriggerCamera}
              />
            )}

            {currentTab === 'certificado' && (
              <CertificateA4View
                expediente={activeExpediente}
                onBack={() => setCurrentTab('expediente')}
              />
            )}

            {currentTab === 'auditoria' && (
              <AuditRepositoryView
                expedientes={expedientes}
                onSelectExpediente={handleSelectExpedienteFromList}
                onNewExpediente={() => setIsNewExpedienteOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 max-w-md mx-auto z-50 bg-primary-container text-on-primary font-mono text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-on-primary/80 hover:text-on-primary">
            ✕
          </button>
        </div>
      )}

      {/* Rugged Camera Modal with Mandatory Observation & Watermark */}
      <RuggedCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onSaveEvidence={handleSaveEvidenceFromCamera}
        folio={activeExpediente?.folio || 'VD-20260702-004'}
        vin={activeExpediente?.vin || 'VIN-PENDING'}
        defaultSubsystem={cameraSubsystem}
        technicianName={activeExpediente?.technicianName || 'Roberto Soto'}
      />

      {/* Persistent Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsNewExpedienteOpen(false);
          setCurrentTab(tab);
        }}
        onTriggerCamera={() => handleTriggerCamera()}
        activeFolio={activeExpediente?.folio}
      />
    </div>
  );
}
