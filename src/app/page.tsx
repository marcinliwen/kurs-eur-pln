'use client'
import React from 'react';
import CurrencyCard from '../components/CurrencyCard';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6">
      <CurrencyCard />
    </div>
  );
}