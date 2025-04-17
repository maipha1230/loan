package main

import (
	"example/loan/database"
	"example/loan/route"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/health", HealthCheck)

	database.ConnectDB()

	route.SetupRoutes(app)
	app.Listen(":8080")
}

func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "OK"})
}
