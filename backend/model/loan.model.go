package model

type LoanRequestBody struct {
	LoanName  string  `json:"loanName" validate:"required"`
	MinAmount float64 `json:"minAmount" validate:"numeric"`
	MaxAmount float64 `json:"maxAmount" validate:"numeric"`
	MinRange  int16   `json:"minRange" validate:"numeric"`
	MaxRange  int16   `json:"maxRange" validate:"numeric"`
}
