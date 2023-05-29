package controllers

import (
	"boilerplate/models"
	"boilerplate/services"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type IUserController interface {
	CreateUser(c *fiber.Ctx) error
	ListUser(c *fiber.Ctx) error
	GetUser(c *fiber.Ctx) error
	DecryptReceipt(c *fiber.Ctx) error
}

func NewUserController(db *gorm.DB) IUserContext {
	context := IUserContext{
		DB: db,
	}
	return context
}

type IUserContext struct {
	DB *gorm.DB
}

func (ctx IUserContext) CreateUser(c *fiber.Ctx) error {
	requestData := &models.User{}
	if err := c.BodyParser(&requestData); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	data, err := services.CreateUser(ctx.DB, requestData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": err.Success,
			"reason":  err.Reason,
		})
	}

	return c.JSON(data)
}

func (ctx IUserContext) ListUser(c *fiber.Ctx) error {
	data, err := services.ListUser(ctx.DB)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": err.Success,
			"reason":  err.Reason,
		})
	}

	return c.JSON(data)
}

func (ctx IUserContext) GetUser(c *fiber.Ctx) error {
	requestData := &models.User{}
	if err := c.BodyParser(&requestData); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	data, err := services.GetUser(ctx.DB, requestData.Nric)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": err.Success,
			"reason":  err.Reason,
		})
	}

	return c.JSON(data)
}

func (ctx IUserContext) DecryptReceipt(c *fiber.Ctx) error {
	requestData := &models.Receipt{}
	if err := c.BodyParser(&requestData); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	data, err := services.DecryptReceipt(requestData.Receipt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": err.Success,
			"reason":  err.Reason,
		})
	}

	return c.JSON(data)
}
