import type { User } from '@prisma/client';

import React from 'react';

import { DehydratedState } from '@tanstack/react-query';

import { AppSidebar } from '~/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { AppProvider } from '~/context/app/app-provider';
import { SessionProvider } from '~/context/session';

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  user?: User;
  dehydratedState?: DehydratedState;
}> = ({ children, user, dehydratedState }) => {
  return (
    <AppProvider dehydratedState={dehydratedState}>
      <SessionProvider user={user}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="p-4 pt-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </AppProvider>
  );
};
