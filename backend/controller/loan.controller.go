package controller

import (
	"example/loan/entity"
	"example/loan/model"
	"example/loan/repository"
	"example/loan/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

func LoanList(ctx *fiber.Ctx) error {
	loans := []entity.Loan{}

	result, err := repository.FindLoans()
	if result != nil && err == nil {
		loans = result
	}
	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", &loans)
}

func LoanByCustomer(ctx *fiber.Ctx) error {
	customerId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}
	existCustomer, err := repository.FindCustomerById(uint(customerId))
	if err != nil && existCustomer == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "customer.not_found")
	}

	result, err := repository.FindByCustomer(uint(customerId))
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "internal_server_error")
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", result)

}

func LoanInformation(ctx *fiber.Ctx) error {
	loanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	existLoan, err := repository.FindLoanById(uint(loanId))
	if err != nil && existLoan == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "loan.not_found")
	}
	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", existLoan)
}

func CreateLoan(ctx *fiber.Ctx) error {
	body := model.LoanRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	Loan := entity.Loan{
		LoanName:  body.LoanName,
		MinAmount: body.MinAmount,
		MaxAmount: body.MaxAmount,
		MinRange:  body.MinRange,
		MaxRange:  body.MaxRange,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	createdLoan, err := repository.CreateLoan(&Loan)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "loan.create.success", &createdLoan)

}

func UpdateLoan(ctx *fiber.Ctx) error {
	loanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	body := model.LoanRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	existLoan, err := repository.FindLoanById(uint(loanId))
	if err != nil && existLoan == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "loan.not_found")
	}

	Loan := entity.Loan{
		Id:        uint(loanId),
		LoanName:  body.LoanName,
		MinAmount: body.MinAmount,
		MaxAmount: body.MaxAmount,
		MinRange:  body.MinRange,
		MaxRange:  body.MaxRange,
		CreatedAt: existLoan.CreatedAt,
		UpdatedAt: time.Now(),
	}
	err = repository.UpdateLoan(&Loan)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "loan.update.success", nil)
}

func DeleteLoan(ctx *fiber.Ctx) error {
	loanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	existLoan, err := repository.FindLoanById(uint(loanId))
	if err != nil && existLoan == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "loan.not_found")
	}

	err = repository.DeleteLoan(existLoan)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "loan.delete.success", nil)
}

func CreateContract(ctx *fiber.Ctx) error {
	body := model.ContractRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	LoanExist, err := repository.FindLoanById(body.LoanId)
	if err != nil && LoanExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "loan.not_found")
	}

	CustomerExist, err := repository.FindCustomerById(body.CustomerId)
	if err != nil && CustomerExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "customer.not_found")
	}

	Contract := entity.CustomerLoan{
		LoanId:      body.LoanId,
		CustomerId:  body.CustomerId,
		StartDate:   body.StartDate,
		EndDate:     body.EndDate,
		Rate:        body.Rate,
		TotalAmount: body.TotalAmount,
		Status:      "ACTIVE",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	createdContract, err := repository.UpdateCustomerLoan(&Contract)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "contract.create.success", &createdContract)

}

func UpdateContract(ctx *fiber.Ctx) error {
	CustomerLoanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	body := model.ContractRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	LoanExist, err := repository.FindLoanById(body.LoanId)
	if err != nil && LoanExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "loan.not_found")
	}

	CustomerExist, err := repository.FindCustomerById(body.CustomerId)
	if err != nil && CustomerExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "customer.not_found")
	}

	ContractExist, err := repository.FindCustomerLoanById(uint(CustomerLoanId))
	if err != nil && ContractExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "contract.not_found")
	}

	Contract := entity.CustomerLoan{
		Id:          ContractExist.Id,
		LoanId:      body.LoanId,
		CustomerId:  body.CustomerId,
		StartDate:   body.StartDate,
		EndDate:     body.EndDate,
		Rate:        body.Rate,
		TotalAmount: body.TotalAmount,
		Status:      ContractExist.Status,
		CreatedAt:   ContractExist.CreatedAt,
		UpdatedAt:   time.Now(),
	}

	updatedContract, err := repository.UpdateCustomerLoan(&Contract)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "contract.update.success", &updatedContract)
}

func CancelContract(ctx *fiber.Ctx) error {
	CustomerLoanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	ContractExist, err := repository.FindCustomerLoanById(uint(CustomerLoanId))
	if err != nil && ContractExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "contract.not_found")
	}

	Contract := entity.CustomerLoan{
		Id:          ContractExist.Id,
		LoanId:      ContractExist.LoanId,
		CustomerId:  ContractExist.CustomerId,
		StartDate:   ContractExist.StartDate,
		EndDate:     ContractExist.EndDate,
		Rate:        ContractExist.Rate,
		TotalAmount: ContractExist.TotalAmount,
		Status:      "CANCEL",
		CreatedAt:   ContractExist.CreatedAt,
		UpdatedAt:   time.Now(),
	}

	updatedContract, err := repository.UpdateCustomerLoan(&Contract)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "contract.update.success", &updatedContract)
}

func ContractInformation(ctx *fiber.Ctx) error {
	CustomerLoanId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	ContractExist, err := repository.FindCustomerLoanById(uint(CustomerLoanId))
	if err != nil && ContractExist == nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, "contract.not_found")
	}
	return utils.BaseResponse(ctx, int(fiber.StatusOK), "success", &ContractExist)
}

func ContractList(ctx *fiber.Ctx) error {
	body := model.ContractSearchBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	result, err := repository.FindCustomerLoanList(body)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, "contract.not_found")
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", &result)
}
