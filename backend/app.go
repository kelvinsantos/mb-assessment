package main

import (
	"boilerplate/controllers"
	"boilerplate/database"

	"flag"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/spf13/viper"
)

var (
	port = flag.String("port", ":3000", "Port to listen on")
	prod = flag.Bool("prod", false, "Enable prefork in Production")
)

func main() {
	viper.SetConfigFile(".env")
	viper.ReadInConfig()

	// Parse command-line flags
	flag.Parse()

	// Connected with database
	err := database.Initialize()
	if err != nil {
		panic(err)
	}

	// Create fiber app
	app := fiber.New(fiber.Config{
		Prefork: *prod, // go run app.go -prod
	})

	// Initialize default config
	app.Use(cors.New())

	// Or extend your config for customization
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())

	// Create a /api/v1 endpoint
	v1 := app.Group("/api/v1")

	db, err := database.Connect()
	if err != nil {
		panic(err)
	}

	var userController controllers.IUserController = controllers.NewUserController(db)

	// Bind controllers
	v1.Post("/users", userController.CreateUser)
	v1.Get("/users", userController.ListUser)
	v1.Get("/users/:nric", userController.GetUser)
	v1.Post("/users/decrypt", userController.DecryptReceipt)

	// Setup static files
	app.Static("/", "./static/public")

	var errorController controllers.IErrorController = controllers.NewUserController(db)

	// Handle not founds
	app.Use(errorController.NotFound)

	// Listen on port 3000
	log.Fatal(app.Listen(*port)) // go run app.go -port=:3000
}
