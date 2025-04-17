package entity

import (
	"time"
)

type User struct {
	Id        uint      `gorm:"primarykey" json:"id"`
	Username  string    `gorm:"column:username;not null;uniqueIndex" json:"username" validate:"required"`
	Password  string    `gorm:"column:password;not null;" json:"password" validate:"required"`
	Role      string    `gorm:"column:role;not null;" json:"role" validate:"required"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
