package entity

import (
	"time"
)

type Customer struct {
	Id        uint       `gorm:"primarykey" json:"id"`
	Phone     string     `gorm:"column:phone;not null;uniqueIndex" json:"phone" validate:"required,numeric,gte=10"`
	Email     string     `gorm:"column:email;not null;uniqueIndex" json:"email" validate:"required,email,lte=255"`
	FirstName string     `gorm:"column:firstname;not null;" json:"firstname" validate:"required,lte=255"`
	LastName  string     `gorm:"column:lastname;not null;" json:"lastname" validate:"required,lte=255"`
	Address   string     `gorm:"column:address;" json:"address"`
	CreatedAt *time.Time `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}
