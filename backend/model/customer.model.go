package model

type CustomerRequestBody struct {
	Phone     string `json:"phone" validate:"required,numeric,gte=10"`
	Email     string `json:"email" validate:"required,email,lte=255"`
	FirstName string `json:"firstname" validate:"required,lte=255"`
	LastName  string `json:"lastname" validate:"required,lte=255"`
	Address   string `json:"address"`
}
