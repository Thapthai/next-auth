'use client';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ClientExcelColumn {
  header: string;
  key: string;
  width?: number;
  type?: 'text' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => any;
}

export interface ClientExcelOptions {
  filename: string;
  worksheetName?: string;
  title?: string;
  includeTimestamp?: boolean;
  author?: string;
  company?: string;
  templateStyle?: 'modern' | 'classic' | 'minimal';
}

/**
 * Client-side Excel utility สำหรับการสร้าง Excel ใน browser
 * ใช้เมื่อต้องการประมวลผลข้อมูลใน client-side
 */
export class ClientExcelService {
  /**
   * สร้าง Excel file จากข้อมูลใน client-side
   */
  static async createExcel(
    data: any[],
    columns: ClientExcelColumn[],
    options: ClientExcelOptions
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    
    // ตั้งค่า metadata
    workbook.creator = options.author || 'POSE System';
    workbook.lastModifiedBy = options.author || 'POSE System';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    if (options.company) workbook.company = options.company;

    const worksheet = workbook.addWorksheet(options.worksheetName || 'Data');
    
    let currentRow = 1;

    // เพิ่ม title หากมี
    if (options.title) {
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = options.title;
      titleCell.font = { size: 16, bold: true, color: { argb: 'FF2F5496' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      
      // Merge cells
      worksheet.mergeCells(`A${currentRow}:${this.getColumnLetter(columns.length)}${currentRow}`);
      currentRow += 2;
    }

    // เพิ่ม timestamp หากต้องการ
    if (options.includeTimestamp) {
      const timestampCell = worksheet.getCell(`A${currentRow}`);
      timestampCell.value = `Generated on: ${new Date().toLocaleString('th-TH')}`;
      timestampCell.font = { italic: true, color: { argb: 'FF666666' } };
      currentRow += 2;
    }

    // ตั้งค่า columns
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width || 15
    }));

    // Style header row
    const headerRow = worksheet.getRow(currentRow);
    this.styleHeaderRow(headerRow, options.templateStyle || 'modern');
    currentRow++;

    // เพิ่มข้อมูล
    for (const item of data) {
      const processedItem: any = {};
      
      // Process data based on column configuration
      for (const col of columns) {
        let value = item[col.key];
        
        // Apply formatter if exists
        if (col.formatter) {
          value = col.formatter(value);
        } else {
          // Auto-format based on type
          switch (col.type) {
            case 'date':
              if (value) value = new Date(value);
              break;
            case 'number':
              if (value !== null && value !== undefined) value = Number(value);
              break;
            case 'boolean':
              value = Boolean(value);
              break;
          }
        }
        
        processedItem[col.key] = value;
      }
      
      const row = worksheet.addRow(processedItem);
      this.styleDataRow(row, options.templateStyle || 'modern');
    }

    // เพิ่ม auto filter
    if (data.length > 0) {
      worksheet.autoFilter = {
        from: { row: currentRow - data.length - 1, column: 1 },
        to: { row: currentRow - 1, column: columns.length }
      };
    }

    // เพิ่ม conditional formatting
    this.addConditionalFormatting(worksheet, columns, currentRow - data.length - 1, currentRow - 1);

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: currentRow - data.length - 1 }];

    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    saveAs(blob, options.filename);
  }

  /**
   * สร้าง Excel จากตาราง HTML
   */
  static async exportTableToExcel(
    tableElement: HTMLTableElement,
    options: ClientExcelOptions
  ): Promise<void> {
    const data: any[] = [];
    const columns: ClientExcelColumn[] = [];
    
    // Extract headers
    const headerRow = tableElement.querySelector('thead tr, tr:first-child') as HTMLTableRowElement;
    if (headerRow) {
      const headers = Array.from(headerRow.cells);
      headers.forEach((cell, index) => {
        columns.push({
          header: cell.textContent?.trim() || `Column ${index + 1}`,
          key: `col_${index}`,
          width: 15
        });
      });
    }

    // Extract data
    const rows = tableElement.querySelectorAll('tbody tr, tr:not(:first-child)');
    rows.forEach(row => {
      const rowData: any = {};
      Array.from((row as HTMLTableRowElement).cells).forEach((cell: HTMLTableCellElement, index) => {
        const key = `col_${index}`;
        let value = cell.textContent?.trim() || '';
        
        // Try to convert to number if possible
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && isFinite(numValue)) {
          rowData[key] = numValue;
        } else {
          rowData[key] = value;
        }
      });
      data.push(rowData);
    });

    await this.createExcel(data, columns, options);
  }

  /**
   * สร้าง Excel จาก JSON data พร้อม auto-detect columns
   */
  static async exportJsonToExcel(
    jsonData: any[],
    options: ClientExcelOptions
  ): Promise<void> {
    if (!jsonData || jsonData.length === 0) {
      throw new Error('No data provided for export');
    }

    // Auto-generate columns from first object
    const firstItem = jsonData[0];
    const columns: ClientExcelColumn[] = Object.keys(firstItem).map(key => {
      const value = firstItem[key];
      let type: 'text' | 'number' | 'date' | 'boolean' = 'text';
      
      // Auto-detect type
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
        type = 'date';
      }

      return {
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        key,
        width: type === 'date' ? 20 : 15,
        type
      };
    });

    await this.createExcel(jsonData, columns, options);
  }

  /**
   * สร้าง Multi-sheet Excel
   */
  static async createMultiSheetExcel(
    sheets: Array<{
      name: string;
      data: any[];
      columns: ClientExcelColumn[];
      title?: string;
    }>,
    options: ClientExcelOptions
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    
    // ตั้งค่า metadata
    workbook.creator = options.author || 'POSE System';
    workbook.lastModifiedBy = options.author || 'POSE System';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    if (options.company) workbook.company = options.company;

    for (const sheetConfig of sheets) {
      const worksheet = workbook.addWorksheet(sheetConfig.name);
      let currentRow = 1;

      // เพิ่ม title หากมี
      if (sheetConfig.title) {
        const titleCell = worksheet.getCell(`A${currentRow}`);
        titleCell.value = sheetConfig.title;
        titleCell.font = { size: 16, bold: true, color: { argb: 'FF2F5496' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        
        worksheet.mergeCells(`A${currentRow}:${this.getColumnLetter(sheetConfig.columns.length)}${currentRow}`);
        currentRow += 2;
      }

      // ตั้งค่า columns
      worksheet.columns = sheetConfig.columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 15
      }));

      // Style header
      const headerRow = worksheet.getRow(currentRow);
      this.styleHeaderRow(headerRow, options.templateStyle || 'modern');
      currentRow++;

      // เพิ่มข้อมูล
      for (const item of sheetConfig.data) {
        const row = worksheet.addRow(item);
        this.styleDataRow(row, options.templateStyle || 'modern');
      }

      // เพิ่ม auto filter
      if (sheetConfig.data.length > 0) {
        worksheet.autoFilter = {
          from: { row: currentRow - sheetConfig.data.length - 1, column: 1 },
          to: { row: currentRow - 1, column: sheetConfig.columns.length }
        };
      }
    }

    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    saveAs(blob, options.filename);
  }

  /**
   * Style header row
   */
  private static styleHeaderRow(row: ExcelJS.Row, style: string): void {
    const styleConfig = {
      modern: {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5496' } },
        font: { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 },
        alignment: { horizontal: 'center', vertical: 'middle' } as const
      },
      classic: {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } },
        font: { color: { argb: 'FFFFFFFF' }, bold: true, size: 10 },
        alignment: { horizontal: 'center', vertical: 'middle' } as const
      },
      minimal: {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } },
        font: { color: { argb: 'FF495057' }, bold: true, size: 10 },
        alignment: { horizontal: 'left', vertical: 'middle' } as const
      }
    };

    const config = styleConfig[style as keyof typeof styleConfig];
    
    row.eachCell((cell) => {
      cell.fill = config.fill as any;
      cell.font = config.font;
      cell.alignment = config.alignment;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    row.height = 25;
  }

  /**
   * Style data rows
   */
  private static styleDataRow(row: ExcelJS.Row, style: string): void {
    row.eachCell((cell) => {
      const isEvenRow = row.number % 2 === 0;
      
      if (style === 'modern' && isEvenRow) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
      }
      
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE1E5E9' } },
        left: { style: 'thin', color: { argb: 'FFE1E5E9' } },
        bottom: { style: 'thin', color: { argb: 'FFE1E5E9' } },
        right: { style: 'thin', color: { argb: 'FFE1E5E9' } }
      };
      
      cell.alignment = { vertical: 'middle' };
      
      // Auto-format numbers
      if (typeof cell.value === 'number' && cell.value % 1 !== 0) {
        cell.numFmt = '#,##0.00';
      } else if (typeof cell.value === 'number') {
        cell.numFmt = '#,##0';
      }
    });
    
    row.height = 20;
  }

  /**
   * เพิ่ม conditional formatting
   */
  private static addConditionalFormatting(
    worksheet: ExcelJS.Worksheet,
    columns: ClientExcelColumn[],
    startRow: number,
    endRow: number
  ): void {
    columns.forEach((col, index) => {
      const columnLetter = this.getColumnLetter(index + 1);
      
      // Highlight negative numbers for amount/price columns
      if (col.key.includes('amount') || col.key.includes('price') || col.key.includes('total')) {
        worksheet.addConditionalFormatting({
          ref: `${columnLetter}${startRow + 1}:${columnLetter}${endRow}`,
          rules: [
            {
              type: 'cellIs',
              operator: 'lessThan',
              priority: 1,
              formulae: [0],
              style: {
                fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFC7CE' } },
                font: { color: { argb: 'FF9C0006' } }
              }
            }
          ]
        });
      }
    });
  }

  /**
   * Get column letter (A, B, C, ..., AA, AB, ...)
   */
  private static getColumnLetter(colNumber: number): string {
    let letter = '';
    while (colNumber > 0) {
      const remainder = (colNumber - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      colNumber = Math.floor((colNumber - 1) / 26);
    }
    return letter;
  }

  /**
   * Read Excel file และแปลงเป็น JSON
   */
  static async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);
          
          const worksheet = workbook.getWorksheet(1); // Get first worksheet
          if (!worksheet) {
            reject(new Error('No worksheet found'));
            return;
          }

          const data: any[] = [];
          const headers: string[] = [];
          
          // Get headers from first row
          const firstRow = worksheet.getRow(1);
          firstRow.eachCell((cell, colNumber) => {
            headers[colNumber - 1] = cell.text || `Column ${colNumber}`;
          });

          // Get data from remaining rows
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
              const rowData: any = {};
              row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                  rowData[header] = cell.value;
                }
              });
              data.push(rowData);
            }
          });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }
}