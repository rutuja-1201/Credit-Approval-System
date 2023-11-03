const cron = require('node-cron');
const Customer = require('./models/customer');
const Loan = require('./models/loan');
const { readExcelData } = require('./utils/excel');


cron.schedule('0 0 * * *', async () => {
  const customerData = readExcelData('customer_data.xlsx' ,['columnA', 'columnB', 'columnC', 'columnD', 'columnE', 'columnF', 'columnG']);
  const loanData = readExcelData('loan_data.xlsx' ,['columnA', 'columnB', 'columnC', 'columnD', 'columnE', 'columnF', 'columnG', 'columnH', 'columnI']);


  for (const data of customerData) {
  
    await Customer.create(data);
  }

  for (const data of loanData) {
    await Loan.create(data);
  }

  console.log('Data ingestion completed.');
});
