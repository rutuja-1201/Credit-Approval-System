const express = require('express');
const Customer = require('../models/customer');
const Loan = require('../models/loan');
const { calculateCreditScore, calculateMonthlyInstallment } = require('../services/credit-score');

const router = express.Router();
router.post('/register', async (req, res) => {
 const { first_name, last_name, age, monthly_income, phone_number } = req.body;
 const approved_limit = 36 * monthly_income;
 const customer = await Customer.create({
   first_name,
   last_name,
   age,
   monthly_income,
   phone_number,
   approved_limit,
 });

 res.json(customer);
});


router.post('/check-eligibility', async (req, res) => {
   const { customer_id, loan_amount, interest_rate, tenure } = req.body;
   try {
     
     const customer = await Customer.findByPk(customer_id);
 
     if (!customer) {
       return res.status(404).json({ error: 'Customer not found' });
     }
 
     const creditScore = calculateCreditScore(customer_id);
 
     
     let loanApproval = false;
     let correctedInterestRate = interest_rate; 
     if (creditScore > 50) {
       loanApproval = true;
     } else if (creditScore > 30) {
       if (interest_rate > 12) {
         loanApproval = true;
       } else {
         correctedInterestRate = 12; 
       }
     } else if (creditScore > 10) {
       if (interest_rate > 16) {
         loanApproval = true;
       } else {
         correctedInterestRate = 16; 
       }
     }
 
     
     const response = {
       customer_id,
       approval: loanApproval,
       interest_rate: interest_rate,
       correctedInterestRate: correctedInterestRate,
       tenure,
       monthly_installment: calculateMonthlyInstallment(loan_amount, correctedInterestRate, tenure),
     };
 
     res.json(response);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal server error' });
   }
});


router.post('/create-loan', async (req, res) => {
  
  const { customer_id, loan_amount, interest_rate, tenure } = req.body;

  try {
  
    const customer = await Customer.findByPk(customer_id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const creditScore = calculateCreditScore(customer);
    
    if (creditScore > 50 &&
        loan_amount <= customer.monthly_income * 2 && 
        !exceedsMonthlyEMILimit(customer, loan_amount) && 
        loan_amount >= 1000 && 
        passedLoanHistoryCheck(customer) 
      ) {
      
      const loan = await Loan.create({
        customer_id,
        loan_amount,
        interest_rate,
        tenure,
        
        emi: calculateMonthlyInstallment(loan_amount, interest_rate, tenure),
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + tenure)),
      });

      res.json(loan);
    } else {
      return res.status(400).json({ error: 'Loan not approved' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/view-loan/:loan_id', async (req, res) => {
  const loan_id = req.params.loan_id;

  try {
  
    const loan = await Loan.findByPk(loan_id, {
      include: [
        {
          model: Customer,
          attributes: ['id', 'first_name', 'last_name', 'phone_number', 'age'],
        },
      ],
    });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/make-payment/customer_id/loan_id', async (req, res) => {
  const { customer_id, loan_id } = req.params;
  const { payment_amount } = req.body;

  try {
    
    const loan = await Loan.findByPk(loan_id);
    const customer = await Customer.findByPk(customer_id);

    if (!loan || !customer) {
      return res.status(404).json({ error: 'Loan or customer not found' });
    }

    
    const remainingAmount = loan.loan_amount - loan.paid_amount;

    if (payment_amount <= remainingAmount) {
      
      loan.paid_amount += payment_amount;

      await loan.save();

      res.json({ message: 'Payment successful' });
    } else {
      return res.status(400).json({ error: 'Payment amount exceeds the remaining amount' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/view-statement/customer_id/loan_id', async (req, res) => {
  const { customer_id, loan_id } = req.params;

  try {
    
    const loan = await Loan.findByPk(loan_id);
    const customer = await Customer.findByPk(customer_id);

    if (!loan || !customer) {
      return res.status(404).json({ error: 'Loan or customer not found' });
    }

    
    const amountPaid = loan.paid_amount;
    const repaymentsLeft = Math.ceil((loan.loan_amount - amountPaid) / loan.emi);

    const statement = {
      customer_id: customer.id,
      loan_id: loan.id,
      principal: loan.loan_amount,
      interest_rate: loan.interest_rate,
      amount_paid: amountPaid,
      monthly_installment: loan.emi,
      repayments_left: repaymentsLeft,
    };

    res.json(statement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
