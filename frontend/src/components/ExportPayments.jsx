import React from 'react';

function ExportPayments({ payments }) {
  const exportToCSV = () => {
    if (!payments || payments.length === 0) {
      alert('No payments to export');
      return;
    }

    const headers = ['ID', 'Employee Name', 'Amount', 'Date', 'Status', 'Notes'];
    const rows = payments.map(p => [
      p.id,
      p.employee_name,
      p.amount,
      p.date,
      p.status,
      p.notes ? p.notes.replace(/\\n/g, ' ') : '',
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\\n';
    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'payments_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      Export Payments CSV
    </button>
  );
}

export default ExportPayments;
