function calculateCreditScore(customer, loans) {

  let creditScore = 100; 
 
  const pastLoans = loans.filter((loan) => loan.customer_id === customer.id);
  const paidOnTimeCount = pastLoans.filter((loan) => loan.emis_paid_on_time).length;
  const totalLoans = pastLoans.length;

  
  if (paidOnTimeCount < totalLoans) {
    const latePayments = totalLoans - paidOnTimeCount;
    const deduction = latePayments * 5; 
    creditScore -= deduction;
  }


  if (totalLoans > 5) {
    
    const excessLoans = totalLoans - 5;
    const deduction = excessLoans * 10; 
    creditScore -= deduction;
  }

  return creditScore;
}

function calculateMonthlyInstallment(loanAmount, interestRate, tenure) {

  const monthlyInterestRate = interestRate / 100 / 12;


  const totalInstallments = tenure;

 
  const emi =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalInstallments)) /
    (Math.pow(1 + monthlyInterestRate, totalInstallments) - 1);

  return emi;
} 

module.exports = { calculateCreditScore , calculateMonthlyInstallment};
