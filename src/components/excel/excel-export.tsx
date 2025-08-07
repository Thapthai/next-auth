'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, Settings, Filter, Users, Building, Package, Trash2, Factory } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportConfig {
  type: string;
  includeRelations: boolean;
  filters: Record<string, any>;
  filename: string;
  templateStyle: 'modern' | 'classic' | 'minimal';
}

interface AvailableType {
  type: string;
  name: string;
  description: string;
  hasRelations: boolean;
  availableFilters: string[];
}

const AVAILABLE_TYPES: AvailableType[] = [
  {
    type: 'users',
    name: 'Users',
    description: 'Export user data with optional relations',
    hasRelations: true,
    availableFilters: ['id', 'name', 'email', 'permission_id', 'is_two_factor_enabled']
  },
  {
    type: 'departments',
    name: 'Departments',
    description: 'Export department data',
    hasRelations: true,
    availableFilters: ['id', 'department_code', 'sale_office_id', 'status']
  },
  {
    type: 'materials',
    name: 'Materials',
    description: 'Export material data',
    hasRelations: true,
    availableFilters: ['id', 'material_code', 'material_type_id', 'status']
  },
  {
    type: 'items',
    name: 'Items',
    description: 'Export item data',
    hasRelations: true,
    availableFilters: ['id', 'rfid_number', 'saleoffice_id', 'department_id', 'status']
  },
  {
    type: 'dirties',
    name: 'Dirties',
    description: 'Export dirty linen data',
    hasRelations: false,
    availableFilters: ['id', 'dirty_doc_no', 'sale_office_id', 'factory_id', 'status']
  },
  {
    type: 'factories',
    name: 'Factories',
    description: 'Export factory data',
    hasRelations: false,
    availableFilters: ['id', 'name_th', 'name_en', 'status']
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'users': return <Users className="w-4 h-4" />;
    case 'departments': return <Building className="w-4 h-4" />;
    case 'materials': return <Package className="w-4 h-4" />;
    case 'items': return <Package className="w-4 h-4" />;
    case 'dirties': return <Trash2 className="w-4 h-4" />;
    case 'factories': return <Factory className="w-4 h-4" />;
    default: return <FileSpreadsheet className="w-4 h-4" />;
  }
};

export default function ExcelExport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    type: 'users',
    includeRelations: false,
    filters: {},
    filename: '',
    templateStyle: 'modern'
  });
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});
  const [multiSheetConfig, setMultiSheetConfig] = useState<any[]>([]);

  const currentType = AVAILABLE_TYPES.find(t => t.type === config.type);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const filters: Record<string, any> = {};
      
      // Convert string filters to appropriate types
      Object.entries(customFilters).forEach(([key, value]) => {
        if (value.trim()) {
          if (key === 'id' || key.includes('_id')) {
            filters[key] = parseInt(value);
          } else if (key.includes('status') || key.includes('is_')) {
            filters[key] = value === 'true';
          } else {
            filters[key] = { contains: value };
          }
        }
      });

      const payload = {
        type: config.type,
        filters,
        includeRelations: config.includeRelations,
        filename: config.filename || `${config.type}_export_${new Date().toISOString().split('T')[0]}.xlsx`,
        templateStyle: config.templateStyle
      };

      const response = await fetch(`/api/excel/export/${config.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = payload.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export Successful',
        description: `${currentType?.name} data exported successfully`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickExport = async (type: string) => {
    setIsLoading(true);
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
        title: 'Quick Export Successful',
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      console.error('Quick export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiSheetExport = async () => {
    if (multiSheetConfig.length === 0) {
      toast({
        title: 'No Sheets Selected',
        description: 'Please add at least one sheet to export',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/excel/export/multi-sheet-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheets: multiSheetConfig,
          options: {
            filename: `multi_sheet_report_${new Date().toISOString().split('T')[0]}.xlsx`,
            templateStyle: config.templateStyle,
            title: 'Comprehensive Report'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Multi-sheet export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `multi_sheet_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Multi-Sheet Export Successful',
        description: 'Comprehensive report exported successfully',
      });
    } catch (error) {
      console.error('Multi-sheet export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export multi-sheet report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSheetToMulti = (type: string) => {
    const typeConfig = AVAILABLE_TYPES.find(t => t.type === type);
    if (!typeConfig) return;

    const newSheet = {
      type,
      name: typeConfig.name,
      title: `${typeConfig.name} Report`,
      filters: {},
      includeSummary: true
    };

    setMultiSheetConfig(prev => [...prev, newSheet]);
  };

  const removeSheetFromMulti = (index: number) => {
    setMultiSheetConfig(prev => prev.filter((_, i) => i !== index));
  };

  const downloadTemplate = async (type: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/excel/template/${type}`);
      
      if (!response.ok) {
        throw new Error('Template download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}_import_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Template Downloaded',
        description: `${type} import template downloaded successfully`,
      });
    } catch (error) {
      console.error('Template download error:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileSpreadsheet className="w-5 h-5" />
        <h2 className="text-2xl font-bold">Excel Export Manager</h2>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single">Single Export</TabsTrigger>
          <TabsTrigger value="multi">Multi-Sheet</TabsTrigger>
          <TabsTrigger value="quick">Quick Export</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Export Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your Excel export with advanced options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Data Type</Label>
                  <Select value={config.type} onValueChange={(value) => {
                    setConfig(prev => ({ ...prev, type: value }));
                    setCustomFilters({});
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TYPES.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(type.type)}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template Style</Label>
                  <Select value={config.templateStyle} onValueChange={(value: any) => 
                    setConfig(prev => ({ ...prev, templateStyle: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filename">Filename (optional)</Label>
                  <Input
                    id="filename"
                    value={config.filename}
                    onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value }))}
                    placeholder={`${config.type}_export_${new Date().toISOString().split('T')[0]}.xlsx`}
                  />
                </div>

                {currentType?.hasRelations && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="relations"
                      checked={config.includeRelations}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, includeRelations: !!checked }))
                      }
                    />
                    <Label htmlFor="relations">Include Related Data</Label>
                  </div>
                )}
              </div>

              {currentType && currentType.availableFilters.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentType.availableFilters.map((filter) => (
                      <div key={filter} className="space-y-1">
                        <Label htmlFor={filter} className="text-sm">{filter}</Label>
                        <Input
                          id={filter}
                          value={customFilters[filter] || ''}
                          onChange={(e) => setCustomFilters(prev => ({
                            ...prev,
                            [filter]: e.target.value
                          }))}
                          placeholder={`Filter by ${filter}`}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleExport} 
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? 'Exporting...' : 'Export to Excel'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Sheet Report</CardTitle>
              <CardDescription>
                Create a comprehensive Excel report with multiple data types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TYPES.map((type) => (
                  <Button
                    key={type.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addSheetToMulti(type.type)}
                    disabled={multiSheetConfig.some(s => s.type === type.type)}
                  >
                    {getTypeIcon(type.type)}
                    <span className="ml-2">Add {type.name}</span>
                  </Button>
                ))}
              </div>

              {multiSheetConfig.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Sheets</Label>
                  <div className="space-y-2">
                    {multiSheetConfig.map((sheet, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(sheet.type)}
                          <span>{sheet.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSheetFromMulti(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleMultiSheetExport} 
                disabled={isLoading || multiSheetConfig.length === 0}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating Report...' : 'Export Multi-Sheet Report'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_TYPES.map((type) => (
              <Card key={type.type} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    {getTypeIcon(type.type)}
                    <span>{type.name}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleQuickExport(type.type)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Quick Export
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Templates</CardTitle>
              <CardDescription>
                Download Excel templates for data import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_TYPES.filter(type => ['users', 'departments', 'materials'].includes(type.type)).map((type) => (
                  <Card key={type.type} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-base">
                        {getTypeIcon(type.type)}
                        <span>{type.name} Template</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => downloadTemplate(type.type)}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}