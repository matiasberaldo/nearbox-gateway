import { useEffect } from 'react';

import { MetaTags } from '@/components/MetaTags';
import { PolygonZkEVM } from '@/components/polygon';
import { useDefaultLayout } from '@/hooks/useLayout';
import { useAuthStore } from '@/stores/auth';
import { useCurrentComponentStore } from '@/stores/current-component';
import type { NextPageWithLayout } from '@/utils/types';

const HomePage: NextPageWithLayout = () => {
  const signedIn = useAuthStore((store) => store.signedIn);
  const setComponentSrc = useCurrentComponentStore((store) => store.setSrc);

  useEffect(() => {
    if (!signedIn) {
      setComponentSrc(null);
    }
  }, [signedIn, setComponentSrc]);


  return (
    <>
      <MetaTags
        title={`nearbox - Decentralized emails on NEAR`}
        description={`"nearbox allows NEAR users to send emails leveraging MailChain"`}
      />
      <PolygonZkEVM />
    </>
  );
};

HomePage.getLayout = useDefaultLayout;

export default HomePage;
