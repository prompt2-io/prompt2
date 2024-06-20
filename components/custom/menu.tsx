"use client"; // This is a client-side component, use this directive to avoid SSR errors like "(0 , react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function"
import React, { useState, useEffect } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu"

import Link from "next/link";
import Image from 'next/image';
import { cn } from "@/lib/utils"
import { logout } from "@/components/custom/actions";

const components: { title: string; href: string; description: string  }[] = [
    {
      title: "BPMN2 workflows",
      href: "/showcases/bpmn2",
      description:
        "User made prompt2 workflows converted to BPMN2.",
    },
    {
      title: "Forms",
      href: "/showcases/forms",
      description:
        "User made forms, surveys, and quizzes.",
    },
    {
      title: "DMN",
      href: "/showcases/dmn",
      description:
        "User made prompt2 workflows converted to DMN decision tables and rules.",
    },
  ];

export const Menu = ({session}:any) => {
  

  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    const run = async () => {
      const s = session;
      if (s === undefined || s === null) {
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
    };
    run();
  }, [session]);

  return (
      <>
        <div className="flex w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <Image src="/logo.svg" alt="P2?" width={40} height={40} />
                <span className="sr-only">P2?</span>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <Image
                                src="/logo.svg"
                                alt="P2?"
                                width={120}
                                height={120}
                              />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                business
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Create workflows, automate tasks, and build integrations,
                                forms, surveys, and quizzes. Collect responses in a
                                database. Send automated emails. Create a chatbot.
                                And so much more....
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/bpmn" title="BPMN2">
                          Create BPMN2 workflows.
                        </ListItem>
                        <ListItem href="/docs/installation" title="Forms">
                          Create forms, surveys, and quizzes.
                        </ListItem>
                        <ListItem href="/docs/primitives/typography" title="DMN">
                          Convert prompt to DMN decision tables and rules.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Showcases</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <h3 className="text-lg font-medium p-4">Public domain</h3>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {components.map((component) => (
                          <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/docs" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Documentation
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              {isLogged==true ? (
                <form action={logout}>
                  <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <div className="md:block">Sign Out</div>
                  </button>
                </form>
              ) : (
                <Link href="/login" legacyBehavior passHref>
                  <a className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <div className="md:block">Sign In</div>
                  </a>
                </Link>
              )}
            </nav>
          </header>
        </div>
      </>
    );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Menu;