import React from 'react';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Kursy Walut',
  description: 'Sprawdzaj aktualne kursy walut',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-md lg:max-w-3/4 xl:max-w-1/2 mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative flex flex-col">
              
              
              <main className="flex-1 flex flex-col px-6 py-8">
                {children}
                <div className="pt-6 text-center text-xs text-stone-400">
                Dane dostarcza NBP
              </div>
              </main>
              
              
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}