package entity

import (
	"time"
)

type LoanStatus string

const (
	LoanStatusActive LoanStatus = "ACTIVE"
	LoanStatusCancel LoanStatus = "CANCEL"
)

type CustomerLoan struct {
	Id          uint       `gorm:"primarykey" json:"id"`
	TotalAmount float64    `gorm:"column:total_amount;not null;" json:"totalAmount" validate:"required,numeric"`
	Rate        uint       `gorm:"column:rate;not null;" json:"rate" validate:"required,numeric"`
	StartDate   time.Time  `gorm:"column:start_date;not null;" json:"startDate" validate:"required"`
	EndDate     time.Time  `gorm:"column:end_date;not null;" json:"endDate" validate:"required"`
	Status      LoanStatus `gorm:"column:status;not null;" json:"status" validate:"required,oneof=ACTIVE CANCEl"`

	LoanId uint `gorm:"column:loan_id; not null;index" json:"loanId" validate:"required,numeric"`
	Loan   Loan `gorm:"foreignKey:LoanId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CustomerId uint     `gorm:"column:customer_id; not null;index" json:"customerId" validate:"required,numeric"`
	Customer   Customer `gorm:"foreignKey:CustomerId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
