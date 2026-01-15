'use client';

import { useEffect } from 'react';

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  dataAdLayout?: string;
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  dataAdLayout,
}: AdBannerProps) => {
  useEffect(() => {
    try {
      // Pushes the ad to Google's queue to be rendered
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err: any) {
      // Prevent the "Ads already loaded" error from clogging the console
      const errorMessage = err.message || err.toString();
      if (
        errorMessage.includes('already have ads') || 
        errorMessage.includes('adsbygoogle.push() error')
      ) {
        return;
      }
      
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="my-8 mx-auto text-center overflow-hidden w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-6954056820104129" 
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        {...(dataAdLayout ? { 'data-ad-layout': dataAdLayout } : {})}
      />
    </div>
  );
};

export default AdBanner;