"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { menuConfig } from "@/config/menu";

export function NavBar() {
  return (
    <div className="px-2">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {menuConfig.map((menu) => (
            <NavigationMenuItem key={menu.label}>
              {menu.href && !menu.children && (
                <NavigationMenuLink asChild>
                  <Link
                    href={menu.href}
                    className="px-3 py-2 rounded-md hover:bg-accent"
                  >
                    {menu.label}
                  </Link>
                </NavigationMenuLink>
              )}

              {menu.children && (
                <>
                  <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>

                  <NavigationMenuContent className="p-2 grid gap-1">
                    {menu.children.map((child) => (
                      <NavigationMenuLink asChild key={child.label}>
                        <Link
                          href={child.href}
                          className="block px-2 py-1 hover:bg-accent rounded-md"
                        >
                          {child.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
