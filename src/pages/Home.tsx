import { FormWizard } from '../components/FormWizard';

export function Home() {
  return (
    <>
      <h1 className="main-title">Should I Bike Tomorrow?</h1>
      <p className="subtitle">Location-based Weather & Air Quality Check</p>

      <FormWizard />
    </>
  );
}
