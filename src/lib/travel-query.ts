import { queryOptions } from '@tanstack/react-query';
import { panelData, publicCatalog } from './travel.functions';
export const catalogOptions = queryOptions({ queryKey: ['catalog'], queryFn: () => publicCatalog(), staleTime: 30000 });
export const panelOptions = queryOptions({ queryKey: ['panel'], queryFn: () => panelData() });