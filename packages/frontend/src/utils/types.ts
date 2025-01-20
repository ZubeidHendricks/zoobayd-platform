export function exportToCSV<T extends Record<string, unknown>>(
  items: T[],
  filename: string,
  columns?: (keyof T)[]
) {
  const csvContent = [
    columns ? columns.join(',') : Object.keys(items[0] || {}).join(','),
    ...items.map(item =>
      columns
        ? columns.map(col => String(item[col])).join(',')
        : Object.entries(item).map(([_, value]) => String(value)).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ActionType<T extends string, P = undefined> = P extends undefined
  ? { type: T }
  : { type: T; payload: P };

export type ValueOf<T> = T[keyof T];