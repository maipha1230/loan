package middleware

import (
	"example/loan/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware(ctx *fiber.Ctx) error {
	authHeader := ctx.Get("Authorization")
	if authHeader == "" {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Unauthorized")
	}

	tokenString := strings.Split(authHeader, " ")[1]
	token, err := utils.ValidateJWT(tokenString)
	if err != nil {
		return utils.ThrowException(ctx, fiber.StatusUnauthorized, "Unauthorized")
	}

	claims := token.Claims.(jwt.MapClaims)
	ctx.Locals("user", claims)

	return ctx.Next()
}
