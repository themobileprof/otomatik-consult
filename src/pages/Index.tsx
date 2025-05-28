
import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Services from '@/components/Services';
import Booking from '@/components/Booking';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Hero />
      <HowItWorks />
      <Services />
      <Booking />
      {/* <Testimonials /> */}
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
