import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileTypeLabel(type: string): string {
  if (type.includes('pdf')) return 'Traveler PDF';
  if (type.includes('image')) return 'Product Image';
  if (type.includes('sheet') || type.includes('excel')) return 'BOM Excel';
  return 'Unknown';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pass':
    case 'completed':
    case 'success':
      return 'text-success-600 bg-success-100';
    case 'warning':
    case 'processing':
      return 'text-warning-600 bg-warning-100';
    case 'fail':
    case 'failed':
    case 'error':
      return 'text-danger-600 bg-danger-100';
    case 'pending':
    case 'uploading':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
