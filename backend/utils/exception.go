package utils

import (
	"github.com/gofiber/fiber/v2"
)

func ThrowException(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(fiber.Map{
		"statusCode": status,
		"message":    message,
	})
}
