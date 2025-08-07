import { Metadata } from 'next';
import ExcelExport from '@/components/excel/excel-export';

export const metadata: Metadata = {
  title: 'Excel Export Demo',
  description: 'Test the advanced Excel export functionality',
};

export default function ExcelDemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Excel Export Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test the advanced Excel export functionality with multiple data types and templates
          </p>
        </div>
        
        <ExcelExport />
      </div>
    </div>
  );
}