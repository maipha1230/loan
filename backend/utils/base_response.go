package utils

import (
	"github.com/gofiber/fiber/v2"
)

func BaseResponse(ctx *fiber.Ctx, status int, message string, data any) error {
	return ctx.Status(status).JSON(fiber.Map{
		"statusCode": status,
		"message":    message,
		"data":       data,
	})
}
