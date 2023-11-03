
const ExcelJS = require('exceljs');

async function readExcelData(filePath, columns) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet('Sheet1');

    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        const rowData = {};

        
        columns.forEach((column, index) => {
          rowData[column] = row.getCell(index + 1).value; 
        });

        data.push(rowData);
      }
    });

    return data;
  } catch (error) {
    throw new Error(`Error reading Excel file: ${error.message}`);
  }
}

module.exports = { readExcelData };
