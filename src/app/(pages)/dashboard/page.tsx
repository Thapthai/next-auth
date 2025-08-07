'use client';

import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Download, FileSpreadsheet, Users, Building, Package, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";
import { ClientExcelService } from "@/lib/excel-client";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast";

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
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
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

  // Excel Export Functions
  const handleQuickExport = async (type: string) => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/excel/export/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          filters: {},
          includeRelations: false,
          filename: `${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`,
          templateStyle: 'modern'
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export Successful',
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClientSideExport = async () => {
    setIsExporting(true);
    try {
      // Sample data สำหรับ demo
      const sampleData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', total: 1200.50 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', total: 850.25 },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', total: 2100.75 },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active', total: 950.00 },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Inactive', total: 1500.30 }
      ];

      await ClientExcelService.exportJsonToExcel(sampleData, {
        filename: `dashboard_sample_data_${new Date().toISOString().split('T')[0]}.xlsx`,
        title: 'Dashboard Sample Data Export',
        templateStyle: 'modern',
        includeTimestamp: true,
        author: 'POSE System',
        company: 'POSE Company'
      });

      toast({
        title: 'Export Successful',
        description: 'Sample data exported successfully from client-side',
      });
    } catch (error) {
      console.error('Client-side export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data from client-side.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { type: 'users', name: 'Users', icon: Users, description: 'Export user data' },
    { type: 'departments', name: 'Departments', icon: Building, description: 'Export department data' },
    { type: 'materials', name: 'Materials', icon: Package, description: 'Export material data' },
    { type: 'factories', name: 'Factories', icon: Factory, description: 'Export factory data' }
  ];
  
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

            {/* Excel Export Section */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  <span>Excel Export</span>
                </CardTitle>
                <CardDescription>
                  Export data to Excel files with advanced formatting and styling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quick Export Buttons */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Quick Export</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {exportOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <Button
                            key={option.type}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickExport(option.type)}
                            disabled={isExporting}
                            className="flex flex-col h-auto p-3 space-y-2"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="text-xs">{option.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-3 border-t">
                    <Button 
                      onClick={handleClientSideExport}
                      disabled={isExporting}
                      className="flex-1 min-w-[200px]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isExporting ? 'Exporting...' : 'Export Sample Data'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => window.open('/excel-demo', '_blank')}
                      className="flex-1 min-w-[200px]"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Advanced Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}
