'use client';

import React from 'react';
import ClientsSection from './ClientsSection';

export default function GreenWebhookTab() {
  return <ClientsSection clients={[]} selectedClientId={null} onSelectClient={() => {}} onAddClient={() => {}} onUpdateClient={() => {}} initialSubTab="green" />;
}
