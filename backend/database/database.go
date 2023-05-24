package database

import (
	"boilerplate/models"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	db.Set("gorm:table_options", "ENGINE=InnoDB CHARSET=utf8 COLLATE=utf8_bin")
	if err != nil {
		return nil, err
	}

	return db, nil
}

// Initialize the database
func Initialize() error {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	// defer db.Close()

	err = createSchema(db)
	if err != nil {
		return err
	}

	fmt.Println("Database has been initialized.")

	return nil
}

// createSchema creates database schema for User and Story models.
func createSchema(db *gorm.DB) error {
	models := []interface{}{
		(*models.User)(nil),
	}

	for _, model := range models {
		err := db.AutoMigrate(model)
		if err != nil {
			return err
		}
	}

	return nil
}
