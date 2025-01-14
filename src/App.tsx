import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Sheet } from 'lucide-react';
import { DataTable } from './components/DataTable';
import type { SheetRow } from './types';

function App() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SHEET_ID = '158k5FiC2mQpH4bjN2QVVzt3uSDfH19fjREVUXq4BPTQ';
  const API_KEY = 'AIzaSyBGHDERZHIA0Yit9dqo0abPri_RO57Kq3c';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
        );

        const rows = response.data.values.slice(1).map((row: string[]) => ({
          Assigned: row[0] || '',
          MSISDN: row[1] || '',
          Category: row[2] || '',
          Status: row[3] || '',
          'In Process Date': row[4] || '',
          'Activation Date': row[5] || '',
          Remove: row[6] || '',
          '@dropdown': row[7] || '',
        }));

        setData(rows);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch data from Google Sheets');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center space-x-3 mb-8">
            <Sheet className="w-10 h-10 text-white" strokeWidth={1.5} />
            <h1 className="text-4xl font-bold rainbow-text">
              Google Sheets Data Viewer
            </h1>
          </div>
          
          <div className="glass-darker rounded-2xl overflow-hidden shadow-xl">
            <DataTable data={data} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
