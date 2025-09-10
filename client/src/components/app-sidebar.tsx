import { BarChart3, BookOpen, Home, Target, Trophy, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Results',
    url: '/results',
    icon: BarChart3,
  },
  {
    title: 'Bilets',
    url: '/bilets',
    icon: BookOpen,
  },
  {
    title: 'Test by Topics',
    url: '/topics',
    icon: Target,
  },
  {
    title: 'Real Test',
    url: '/real-test',
    icon: Trophy,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar data-testid="sidebar-navigation">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Test Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}