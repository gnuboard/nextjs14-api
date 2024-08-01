// src/app/(home)/page.js

import React from 'react';
import Latest from '@/components/Latest';
import LatestGallery from '@/components/LatestGallery';
import LatestGallerySlide from '@/components/LatestGallerySlide';
import CookieConsentPopup from '@/components/CookieConcentPopup';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Latest bo_table="free" view_type="write" rows={5} />
        </div>
        <div>
          <Latest bo_table="notice" view_type="write" rows={5} />
        </div>
      </div>
      <div className="mt-6">
        <LatestGallerySlide bo_table="gallery" view_type="write" rows={4} />
      </div>
      <div className="mt-6">
        <LatestGallery bo_table="gallery" view_type="write" rows={4} />
      </div>
      <CookieConsentPopup />
    </div>
  );
};

export default Home;
