'use client';

import * as React from 'react';

import { Role } from '@prisma/client';
import { Accessibility, Car, Command, Gauge } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NavUser } from '~/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { useSession } from '~/context/session';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useSession();

  const pageRoutes: {
    href: string;
    text: string;
    icon: React.FC<{ className?: string }>;
    hidden?: boolean;
  }[] = [
    {
      href: '/',
      text: 'Dashboard',
      icon: Gauge,
    },
    {
      href: '/booking',
      text: 'Booking',
      icon: Car,
    },
    {
      href: '/driver',
      text: 'Driver',
      icon: Accessibility,
      hidden: user.role !== Role.ADMIN,
    },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {pageRoutes.map(
            (item) =>
              !item.hidden && (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton asChild isActive={item.href === router.pathname}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ),
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
