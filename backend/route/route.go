package route

import (
	"example/loan/controller"
	"example/loan/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin,Authorization",
		AllowOrigins:     "http://localhost:3000",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))
	authGroup := app.Group("/auth")
	authGroup.Post("/register", controller.RegisterUser)
	authGroup.Post("/login", controller.LoginUser)

	customerGroup := app.Group("/customer")
	customerGroup.Use(middleware.AuthMiddleware)
	customerGroup.Get("/get-list", controller.CustomerList)
	customerGroup.Get("/get-information/:id", controller.CustomerInformation)
	customerGroup.Post("/create", controller.CreateCustomer)
	customerGroup.Post("/update/:id", controller.UpdateCustomer)
	customerGroup.Post("/delete/:id", controller.DeleteCustomer)

	loanGroup := app.Group("/loan")
	loanGroup.Use(middleware.AuthMiddleware)
	loanGroup.Get("/get-list", controller.LoanList)
	loanGroup.Get("/get-information/:id", controller.LoanInformation)
	loanGroup.Post("/create", controller.CreateLoan)
	loanGroup.Post("/update/:id", controller.UpdateLoan)
	loanGroup.Post("/delete/:id", controller.DeleteLoan)
	loanGroup.Post("/contract/list", controller.ContractList)
	loanGroup.Get("/contract/information/:id", controller.ContractInformation)
	loanGroup.Post("/contract/create", controller.CreateContract)
	loanGroup.Post("/contract/update/:id", controller.UpdateContract)
	loanGroup.Post("/contract/cancel/:id", controller.CancelContract)
}
