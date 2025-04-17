package repository

import (
	"example/loan/database"
	"example/loan/entity"
	"example/loan/model"
)

func FindByCustomer(customerId uint) (any, error) {
	customerLoan := []entity.CustomerLoan{}
	result := database.DB.
		Preload("Customer").
		Preload("Loan").
		Where("customer_id = ?", customerId).
		Find(&customerLoan)

	if result.Error != nil {
		return nil, result.Error
	}
	return customerLoan, nil
}

func CreateCustomerLoan(customerLoan *entity.CustomerLoan) (*entity.CustomerLoan, error) {
	if err := database.DB.Create(customerLoan).Error; err != nil {
		return nil, err
	}
	return customerLoan, nil
}

func UpdateCustomerLoan(customerLoan *entity.CustomerLoan) (*entity.CustomerLoan, error) {
	if err := database.DB.Save(customerLoan).Error; err != nil {
		return nil, err
	}
	return customerLoan, nil
}

func FindCustomerLoanById(CustomerLoanId uint) (*entity.CustomerLoan, error) {
	contract := entity.CustomerLoan{}
	result := database.DB.
		Preload("Loan").
		Preload("Customer").
		Where("id = ?", CustomerLoanId).
		First(&contract)
	if result.Error != nil {
		return nil, result.Error
	}
	return &contract, nil
}

func FindCustomerLoanList(body model.ContractSearchBody) ([]entity.CustomerLoan, error) {
	var list []entity.CustomerLoan

	db := database.DB.Model(&entity.CustomerLoan{}).
		Preload("Customer").
		Preload("Loan")

	// Apply filters only if the fields are not nil
	if body.Amount != nil {
		db = db.Where("total_amount = ?", *body.Amount)
	}
	if body.StartDate != nil {
		db = db.Where("start_date >= ?", *body.StartDate)
	}
	if body.EndDate != nil {
		db = db.Where("end_date <= ?", *body.EndDate)
	}
	if body.SearchText != nil && *body.SearchText != "" {
		// Example: search by customer name or loan title
		search := "%" + *body.SearchText + "%"
		db = db.Joins("LEFT JOIN customers ON customers.id = customer_loans.customer_id").
			Joins("LEFT JOIN loans ON loans.id = customer_loans.loan_id").
			Where("customers.name ILIKE ? OR loans.title ILIKE ?", search, search)
	}

	// Execute query
	if err := db.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}
