// © Edmund Wallner
import { useImportStore } from '../../store/importStore';
import { UploadStep } from './UploadStep';
import { MappingStep } from './MappingStep';
import { PreviewStep } from './PreviewStep';
import { ResultStep } from './ResultStep';

export function ImportPage() {
  const step = useImportStore((s) => s.step);

  return (
    <>
      <div className="page-header">
        <div className="page-header__left">
          <h2>Import</h2>
          <p>Bulk onboard people and assignments from CSV</p>
        </div>
      </div>
      <WizardSteps currentStep={step} />
      <div className="wizard-content">
        {step === 1 && <UploadStep />}
        {step === 2 && <MappingStep />}
        {step === 3 && <PreviewStep />}
        {step === 4 && <ResultStep />}
      </div>
    </>
  );
}

function WizardSteps({ currentStep }: { currentStep: number }) {
  const steps = ['Upload', 'Map Columns', 'Preview', 'Result'];
  return (
    <div className="wizard-steps">
      {steps.map((label, i) => {
        const num = i + 1;
        const cls = num === currentStep ? ' active' : num < currentStep ? ' done' : '';
        return (
          <div key={num}>
            {i > 0 && <div className="wizard-connector" />}
            <div className={`wizard-step${cls}`} data-step={num}>
              <div className="wizard-step__num">{num}</div>{label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
