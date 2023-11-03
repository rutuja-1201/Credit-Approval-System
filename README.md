# Credit-Approval-System
Credit approval  system based on past data as well as future transactions
This is a credit approval system built using Node.js and Express.js for the backend, MySQL for the database, and Docker for containerization.

# Project Overview
The Credit Approval System is designed to assess and approve credit for customers based on various criteria, including credit score, loan eligibility, loan approval, loan repayment, and more.

# Setup and Initialization
 Database Configuration
 Choose either MySQL as your database system.
 Configure the database connection in the db/connection.js file.
 Use the provided Excel files (customer_data.xlsx and loan_data.xlsx) to ingest initial data into the system.
 Use background tasks, such as cron jobs, to periodically update the data from these files.

# API Endpoints
The system provides several API endpoints for various operations:
/register: Add a new customer to the system.
/check-eligibility: Check loan eligibility and approve loans based on credit score.
/create-loan: Process a new loan based on eligibility.
/view-loan/loan_id: View loan and customer details.
/make-payment/customer_id/loan_id: Allow customers to make EMI payments.
/view-statement/customer_id/loan_id: View the statement of a particular loan taken by the customer.

The credit score is calculated based on various factors, including past loans paid on time, the number of loans taken, loan activity in the current year, loan approved volume, and the comparison of current loan EMIs with the approved limit.
Loan approval criteria are determined based on the calculated credit score. Loans are approved according to specified rules, and interest rates may be corrected based on credit scores.

