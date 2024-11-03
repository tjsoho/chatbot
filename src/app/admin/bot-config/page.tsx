'use client';

import BotConfiguration from '@/components/AdminDashboard/BotConfiguration';
import AdminAuthCheck from '@/components/AdminDashboard/AdminAuthCheck';

export default function BotConfigPage() {
  return (
    <AdminAuthCheck>
      <BotConfiguration />
    </AdminAuthCheck>
  );
} 