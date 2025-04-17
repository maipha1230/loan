package repository

import (
	"example/loan/database"
	"example/loan/entity"
)

func CreateLoan(loan *entity.Loan) (*entity.Loan, error) {
	if err := database.DB.Create(loan).Error; err != nil {
		return nil, err
	}
	return loan, nil
}

func FindLoans() ([]entity.Loan, error) {
	loans := []entity.Loan{}
	err := database.DB.Order("created_at ASC").Find(&loans).Error
	return loans, err
}

func UpdateLoan(loan *entity.Loan) error {
	return database.DB.Save(loan).Error
}

func DeleteLoan(Loan *entity.Loan) error {
	return database.DB.Delete(Loan).Error
}

func FindLoanById(loanId uint) (*entity.Loan, error) {
	loan := entity.Loan{}
	result := database.DB.Where("id = ? ", loanId).First(&loan)
	if result.Error != nil {
		return nil, result.Error
	}
	return &loan, nil
}
