import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an Ethereum address for display
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Format a number with proper decimal places
 */
export function formatNumber(
  value: number | string | bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  
  if (typeof value === 'bigint') {
    value = Number(value);
  }
  
  const formatted = value / Math.pow(10, decimals);
  return formatted.toFixed(displayDecimals);
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate token amount (positive number)
 */
export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

/**
 * Parse recipients from text input (one per line)
 */
export function parseRecipients(input: string): string[] {
  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && isValidAddress(line));
}

/**
 * Parse amounts from text input (one per line)
 */
export function parseAmounts(input: string): string[] {
  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && isValidAmount(line));
}

/**
 * Convert string to BigInt with proper decimal handling
 */
export function stringToBigInt(value: string, decimals: number = 18): bigint {
  const [whole, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Convert BigInt to string with proper decimal formatting
 */
export function bigIntToString(value: bigint, decimals: number = 18): string {
  const valueStr = value.toString();
  if (valueStr.length <= decimals) {
    return `0.${valueStr.padStart(decimals, '0')}`;
  }
  
  const whole = valueStr.slice(0, -decimals);
  const fraction = valueStr.slice(-decimals);
  return `${whole}.${fraction}`;
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Generate a random ID for UI elements
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unexpected error occurred';
}

/**
 * Parse CSV content and extract addresses and amounts
 */
export function parseCSV(csvContent: string): { addresses: string[], amounts?: string[] } {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return { addresses: [] };
  }

  // Check if first line contains headers
  const firstLine = lines[0].toLowerCase();
  const hasHeaders = firstLine.includes('address') || firstLine.includes('amount') || firstLine.includes('wallet');
  
  const dataLines = hasHeaders ? lines.slice(1) : lines;
  
  const addresses: string[] = [];
  const amounts: string[] = [];
  
  dataLines.forEach(line => {
    const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
    
    if (columns.length >= 1) {
      const address = columns[0];
      if (isValidAddress(address)) {
        addresses.push(address);
        
        // If there's a second column and it looks like an amount
        if (columns.length >= 2) {
          const amount = columns[1];
          if (isValidAmount(amount)) {
            amounts.push(amount);
          } else {
            amounts.push('');
          }
        }
      }
    }
  });
  
  return {
    addresses,
    amounts: amounts.length > 0 ? amounts : undefined
  };
}

/**
 * Validate CSV file format
 */
export function validateCSVFile(file: File): { isValid: boolean; error?: string } {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { isValid: false, error: 'Please select a CSV file' };
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  return { isValid: true };
}

/**
 * Convert addresses array to CSV format
 */
export function addressesToCSV(addresses: string[], amounts?: string[]): string {
  const lines = ['address'];
  
  if (amounts && amounts.length > 0) {
    lines[0] += ',amount';
  }
  
  addresses.forEach((address, index) => {
    if (amounts && amounts[index]) {
      lines.push(`${address},${amounts[index]}`);
    } else {
      lines.push(address);
    }
  });
  
  return lines.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string = 'recipients.csv'): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 