package model

import "time"

type ContractRequestBody struct {
	LoanId      uint      `json:"loanId" validate:"required,numeric"`
	CustomerId  uint      `json:"customerId" validate:"required,numeric"`
	TotalAmount float64   `json:"totalAmount" validate:"required,numeric"`
	Rate        uint      `json:"rate" validate:"required,numeric"`
	StartDate   time.Time `json:"startDate" validate:"required"`
	EndDate     time.Time `json:"endDate" validate:"required"`
}

type ContractSearchBody struct {
	Amount     *float64   `json:"totalAmount" validate:"omitempty,numeric"`
	StartDate  *time.Time `json:"startDate" validate:"omitempty"`
	EndDate    *time.Time `json:"endDate" validate:"omitempty"`
	SearchText *string    `json:"searchText" validate:"omitempty"`
}
