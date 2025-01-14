export interface SheetRow {
  Assigned: string;
  MSISDN: string;
  Category: string;
  Status: string;
  'In Process Date': string;
  'Activation Date': string;
  Remove: string;
  '@dropdown': string;
}

export interface TableColumn {
  header: string;
  accessorKey: keyof SheetRow;
}