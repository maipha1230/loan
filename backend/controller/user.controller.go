package controller

import (
	"example/loan/entity"
	"example/loan/model"
	"example/loan/repository"
	"example/loan/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

func RegisterUser(ctx *fiber.Ctx) error {
	body := model.UserRegisterRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}
	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}
	hashedPassword := utils.GeneratePassword(body.Password)
	user := entity.User{
		Username:  body.Username,
		Role:      body.Role,
		Password:  hashedPassword,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result, err := repository.UserRegister(&user)
	if result == nil && err != nil {
		return utils.ThrowException(ctx, fiber.StatusInternalServerError, err.Error())
	}

	return utils.BaseResponse(ctx, fiber.StatusOK, "Register User Success", nil)
}

func LoginUser(ctx *fiber.Ctx) error {
	body := model.UserLoginRequestBody{}
	if err := ctx.BodyParser(&body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, err.Error())
	}
	validate := utils.NewValidator()
	if err := validate.Struct(body); err != nil {
		return utils.ThrowException(ctx, fiber.StatusBadRequest, utils.ValidatorErrors(err))
	}

	existUser, err := repository.UserFindByUsername(body.Username)
	if existUser == nil && err != nil {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Incorrect Username Or Password")
	}

	isEqual := utils.ComparePasswords(existUser.Password, body.Password)
	if !isEqual {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Incorrect Username Or Password")
	}

	accessTokenMap := make(map[string]any)
	accessTokenMap["username"] = existUser.Username
	accessTokenMap["role"] = existUser.Role
	accessTokenMap["exp"] = time.Now().Add(time.Hour * 1).Unix()

	accessToken, err := utils.GenerateJWT(accessTokenMap)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Generate Token Fail")
	}

	refreshTokenMap := make(map[string]any)
	refreshTokenMap["username"] = existUser.Username
	refreshTokenMap["role"] = existUser.Role
	refreshTokenMap["exp"] = time.Now().Add(time.Hour * 24).Unix()

	refreshToken, err := utils.GenerateJWT(refreshTokenMap)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Generate Token Fail")
	}

	return utils.BaseResponse(ctx, fiber.StatusOK, "Login User Success", fiber.Map{
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
	})
}
