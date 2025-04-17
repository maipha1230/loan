package entity

import (
	"time"
)

type Payment struct {
	Id             uint         `gorm:"primarykey" json:"id"`
	CustomerLoanId uint         `gorm:"column:customer_loan_id; not null;" json:"customerLoanId" validate:"required,numeric"`
	CustomerLoan   CustomerLoan `gorm:"foreignKey:CustomerLoanId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Amount         float64      `gorm:"column:amount; not null;" json:"amount" validate:"required,numeric"`
	PaymentAt      time.Time    `gorm:"column:payment_at; not null;" json:"paymentAt" validate:"required"`
	CreatedAt      time.Time    `json:"createdAt"`
	UpdatedAt      time.Time    `json:"updatedAt"`
}
