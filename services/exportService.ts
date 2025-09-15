
import { InventoryTransaction } from '../types';

// These are globals provided by the scripts in index.html
declare const jsPDF: any;
declare const XLSX: any;

const formatDate = (dateString: string) => {
    try {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    } catch {
        return dateString;
    }
}

export const exportToExcel = (data: InventoryTransaction[], fileName: string) => {
  const worksheetData = data.map((item) => ({
    'Tipo': item.type === 'entrada' ? 'Entrada' : 'Saída',
    'Produto': item.productName,
    'Local': item.location,
    'Categoria': item.category,
    'Quantidade': item.quantity,
    'Data': formatDate(item.date),
    'Observações': item.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque');

  // Adjust column widths
  const columnWidths = [
    { wch: 10 }, // Tipo
    { wch: 30 }, // Produto
    { wch: 20 }, // Local
    { wch: 20 }, // Categoria
    { wch: 15 }, // Quantidade
    { wch: 15 }, // Data
    { wch: 50 }, // Observações
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPdf = (data: InventoryTransaction[], fileName:string) => {
  const doc = new jsPDF.default();
  
  doc.text("Relatório de Movimentação de Estoque", 14, 16);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);

  const tableColumn = ["Tipo", "Produto", "Local", "Categoria", "Qtd.", "Data", "Observações"];
  const tableRows: (string | number)[][] = [];

  data.forEach(item => {
    const itemData = [
      item.type === 'entrada' ? 'Entrada' : 'Saída',
      item.productName,
      item.location,
      item.category,
      item.quantity,
      formatDate(item.date),
      item.notes || '-',
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    columnStyles: {
        6: { cellWidth: 50 }
    }
  });

  doc.save(`${fileName}.pdf`);
};
