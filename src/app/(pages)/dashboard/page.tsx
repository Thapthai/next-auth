'use client';

import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Grapes", value: "grapes" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
];

export default function Select2LikeCombobox() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const t = useTranslations('DashboardPage');

  const tabItems = [
    { value: 'tab1', label: t('tab1') },
    { value: 'tab2', label: t('tab2') },
    { value: 'tab3', label: t('tab3') },
    { value: 'tab4', label: t('tab4') },
    { value: 'tab5', label: t('tab5') },
    { value: 'tab6', label: t('tab6') },

  ];

  const [selectedTab, setSelectedTab] = useState(tabItems[0].value);
  return (
    <div>
      <SiteHeader headerTopic={t('headerTopic')} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

            {/* Combobox */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                  {selected ? options.find(opt => opt.value === selected)?.label : "Select fruit"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search fruits..." />
                  <CommandList>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          setSelected(option.value)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selected === option.value ? "opacity-100" : "opacity-0")}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Tabs
              value={selectedTab}
              onValueChange={(val) => setSelectedTab(val)}
              className="w-full"
            >
              {/* Mobile dropdown */}
              <div className="sm:hidden mb-4">
                <label htmlFor="tabs-select" className="sr-only">Select Tab</label>
                <select
                  id="tabs-select"
                  className="block w-full rounded border border-gray-300 bg-white p-2 text-gray-900
            dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={selectedTab}
                  onChange={(e) => setSelectedTab(e.target.value)}
                >
                  {tabItems.map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Tabs */}
              <TabsList className="hidden sm:flex border-b border-gray-200 dark:border-gray-700 w-full">
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="tab1" className="mt-4">
                Content for Tab 1
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                Content for Tab 2
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                Content for Tab 3
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>
    </div>


  )
}
