package services

import (
	"boilerplate/dao"
	"boilerplate/helpers"
	"boilerplate/models"
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// CreateUser registers a user
func CreateUser(db *gorm.DB, requestData *models.User) (map[string]interface{}, *models.Error) {
	marshalRD, _ := json.Marshal(requestData)

	encRD, err := helpers.GetAESEncrypted(string(marshalRD))
	if err != nil {
		return nil, &models.Error{
			Success: false,
			Reason:  "Internal Server Error",
		}
	}

	var user dao.IUser = dao.NewUser(db)
	resp := user.Insert(&models.User{
		Nric:          requestData.Nric,
		WalletAddress: requestData.WalletAddress,
		EncRD:         encRD,
	})
	if resp.Error != nil {
		if strings.Contains(resp.Error.Error(), "users_pkey") {
			return nil, &models.Error{
				Success: false,
				Reason:  "Wallet address can only be associated with 1 NRIC",
			}
		} else if strings.Contains(resp.Error.Error(), "users_nric_key") {
			return nil, &models.Error{
				Success: false,
				Reason:  "NRIC already exists",
			}
		} else {
			return nil, &models.Error{
				Success: false,
				Reason:  "Internal Server Error",
			}
		}
	}

	return fiber.Map{
		"success": true,
		"receipt": encRD,
	}, nil
}

// ListUser returns a list of users
func ListUser(db *gorm.DB) (map[string]interface{}, *models.Error) {
	var user dao.IUser = dao.NewUser(db)
	result := user.List()

	return fiber.Map{
		"success": true,
		"users":   result,
	}, nil
}

// GetUser returns a list of users
func GetUser(db *gorm.DB, nric string) (map[string]interface{}, *models.Error) {
	var user dao.IUser = dao.NewUser(db)
	result := user.Get(nric)

	return fiber.Map{
		"success": true,
		"user":    result,
	}, nil
}

func DecryptReceipt(receipt string) (map[string]interface{}, *models.Error) {
	decRD, err := helpers.GetAESDecrypted(receipt)
	if err != nil {
		return nil, &models.Error{
			Success: false,
			Reason:  "Internal Server Error",
		}
	}

	return fiber.Map{
		"success": true,
		"user":    string(decRD),
	}, nil
}
