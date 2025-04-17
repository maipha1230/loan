package entity

import (
	"time"
)

type Loan struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	LoanName  string    `gorm:"column:loan_name;not null;" json:"loanName" validate:"required"`
	MinAmount float64   `gorm:"column:min_amount;" json:"minAmount" validate:"numeric"`
	MaxAmount float64   `gorm:"column:max_amount;" json:"maxAmount" validate:"numeric"`
	MinRange  int16     `gorm:"column:min_range;" json:"minRange" validate:"numeric"`
	MaxRange  int16     `gorm:"column:max_range;" json:"maxRange" validate:"numeric"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
