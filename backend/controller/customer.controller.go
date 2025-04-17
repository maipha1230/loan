package controller

import (
	"example/loan/entity"
	"example/loan/model"
	"example/loan/repository"
	"example/loan/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CustomerList(ctx *fiber.Ctx) error {
	customers := []entity.Customer{}

	result, err := repository.FindCustomers()
	if result != nil && err == nil {
		customers = result
	}
	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", customers)
}

func CustomerInformation(ctx *fiber.Ctx) error {
	customerId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	existCustomer, err := repository.FindCustomerById(uint(customerId))
	if err != nil && existCustomer == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "customer.not_found")
	}
	return utils.BaseResponse(ctx, int(fiber.StatusOK), "Success", existCustomer)
}

func CreateCustomer(ctx *fiber.Ctx) error {
	body := model.CustomerRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	phoneInUse, err := repository.FindCustomerByPhone(body.Phone)
	if phoneInUse != nil && err == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "phone.aleady_in_use")
	}

	emailInUse, err := repository.FindCustomerByEmail(body.Email)
	if emailInUse != nil && err == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "email.aleady_in_use")
	}

	now := time.Now()

	customer := entity.Customer{
		FirstName: body.FirstName,
		LastName:  body.LastName,
		Phone:     body.Phone,
		Email:     body.Email,
		Address:   body.Address,
		CreatedAt: &now,
		UpdatedAt: &now,
	}

	createdCustomer, err := repository.CreateCustomer(&customer)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "customer.create.success", &createdCustomer)

}

func UpdateCustomer(ctx *fiber.Ctx) error {
	customerId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	body := model.CustomerRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	existCustomer, err := repository.FindCustomerById(uint(customerId))
	if err != nil && existCustomer == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "customer.not_found")
	}

	phoneInUse, err := repository.FindCustomerByPhone(body.Phone)
	if phoneInUse != nil && err != nil && phoneInUse.Id != uint(customerId) {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "phone.aleady_in_use")
	}

	emailInUse, err := repository.FindCustomerByEmail(body.Email)
	if emailInUse != nil && err != nil && emailInUse.Id != uint(customerId) {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "email.aleady_in_use")
	}

	now := time.Now()

	customer := entity.Customer{
		FirstName: body.FirstName,
		LastName:  body.LastName,
		Phone:     body.Phone,
		Email:     body.Email,
		Address:   body.Address,
		CreatedAt: existCustomer.CreatedAt,
		UpdatedAt: &now,
	}
	customer.Id = uint(customerId)
	err = repository.UpdateCustomer(&customer)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "customer.update.success", nil)
}

func DeleteCustomer(ctx *fiber.Ctx) error {
	customerId, err := ctx.ParamsInt("id")
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}

	existCustomer, err := repository.FindCustomerById(uint(customerId))
	if err != nil && existCustomer == nil {
		return utils.ThrowException(ctx, fiber.StatusNotFound, "customer.not_found")
	}

	err = repository.DeleteCustomer(existCustomer)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, int(fiber.StatusOK), "customer.delete.success", nil)
}
