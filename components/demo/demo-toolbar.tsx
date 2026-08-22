import { isPrefetchEnabled, isScriptsEnabled } from '@/components/demo/demo-queries';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { EnableScriptsForm } from '@/components/demo/enable-scripts-form';
import { DemoToolbarClient } from './demo-toolbar-client';

export async function DemoToolbar() {
  const [prefetchEnabled, slowEnabled, scriptsEnabled] = await Promise.all([
    isPrefetchEnabled(),
    isSlowEnabled(),
    isScriptsEnabled(),
  ]);

  if (!scriptsEnabled) {
    return <EnableScriptsForm />;
  }

  return (
    <DemoToolbarClient prefetchEnabled={prefetchEnabled} slowEnabled={slowEnabled} scriptsEnabled />
  );
}
