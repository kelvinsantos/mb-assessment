package handlers

import (
	"boilerplate/dao"
	"boilerplate/database"
	"boilerplate/helpers"
	"boilerplate/models"
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// CreateUser registers a user
func CreateUser(c *fiber.Ctx) error {
	db, err := database.Connect()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	requestData := &models.User{}
	if err := c.BodyParser(&requestData); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}
	marshalRD, _ := json.Marshal(requestData)

	encRD, err := helpers.GetAESEncrypted(string(marshalRD))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	var user dao.IUser = dao.NewUser(db)
	resp := user.Insert(&models.User{
		Nric:          requestData.Nric,
		WalletAddress: requestData.WalletAddress,
		EncRD:         encRD,
	})
	if resp.Error != nil {
		if strings.Contains(resp.Error.Error(), "users_pkey") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"reason":  "Wallet address can only be associated with 1 NRIC",
			})
		} else if strings.Contains(resp.Error.Error(), "users_nric_key") {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"reason":  "NRIC already exists",
			})
		} else {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"reason":  "Internal Server Error",
			})
		}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"receipt": encRD,
	})
}

// ListUser returns a list of users
func ListUser(c *fiber.Ctx) error {
	db, err := database.Connect()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	var user dao.IUser = dao.NewUser(db)
	result := user.List()

	return c.JSON(fiber.Map{
		"success": true,
		"users":   result,
	})
}

// GetUser returns a list of users
func GetUser(c *fiber.Ctx) error {
	db, err := database.Connect()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	var user dao.IUser = dao.NewUser(db)
	result := user.Get(c.FormValue("nric"))

	return c.JSON(fiber.Map{
		"success": true,
		"user":    result,
	})
}

func DecryptReceipt(c *fiber.Ctx) error {
	requestData := &models.Receipt{}
	if err := c.BodyParser(requestData); err != nil {
		return err
	}

	decRD, err := helpers.GetAESDecrypted(requestData.Receipt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"reason":  "Internal Server Error",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"user":    string(decRD),
	})
}

// NotFound returns custom 404 page
func NotFound(c *fiber.Ctx) error {
	return c.Status(404).SendFile("./static/private/404.html")
}
