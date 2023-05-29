package dao

import (
	"boilerplate/models"

	"gorm.io/gorm"
)

type IUser interface {
	Insert(user *models.User) *gorm.DB
	List() []models.User
	Get(nric string) models.User
}

type connection struct {
	db *gorm.DB
}

func NewUser(db *gorm.DB) connection {
	conn := connection{
		db: db,
	}
	return conn
}

func (conn connection) Insert(user *models.User) *gorm.DB {
	resp := conn.db.Create(user)

	return resp
}

func (conn connection) List() []models.User {
	var users []models.User
	conn.db.Find(&users)

	return users
}

func (conn connection) Get(nric string) models.User {
	var user models.User
	conn.db.Where("nric = ?", nric).First(&user)

	return user
}
