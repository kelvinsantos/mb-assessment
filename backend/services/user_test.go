package services_test

import (
	"boilerplate/models"
	"boilerplate/services"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestCreateUser(t *testing.T) {
	mockDb, _, _ := sqlmock.New()

	dialector := postgres.New(postgres.Config{
		Conn:       mockDb,
		DriverName: "postgres",
	})

	db, _ := gorm.Open(dialector, &gorm.Config{})

	services.CreateUser(db, &models.User{
		Nric:          "1234",
		WalletAddress: "wallet-1234",
		EncRD:         "encrd",
	})
}

func TestListUser(t *testing.T) {
	mockDb, mock, _ := sqlmock.New()

	dialector := postgres.New(postgres.Config{
		Conn:       mockDb,
		DriverName: "postgres",
	})

	db, _ := gorm.Open(dialector, &gorm.Config{})

	mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "users"`)).
		WillReturnRows(sqlmock.NewRows([]string{"id", "nric", "wallet_address", "enc_rd", "created_at", "updated_at"}).
			AddRow(1, "1234", "wallet-1234", "enc-1234", time.Now(), "1685349266"))

	res, _ := services.ListUser(db)

	require.NotNil(t, res["users"], "The response > user object should not get nil value")
}

func TestGetUser(t *testing.T) {
	mockDb, mock, _ := sqlmock.New()

	dialector := postgres.New(postgres.Config{
		Conn:       mockDb,
		DriverName: "postgres",
	})

	db, _ := gorm.Open(dialector, &gorm.Config{})

	mock.ExpectQuery(regexp.QuoteMeta(
		`SELECT * FROM "users" WHERE nric = $1 ORDER BY "users"."wallet_address" LIMIT 1`)).
		WithArgs("1234").
		WillReturnRows(sqlmock.NewRows([]string{"id", "nric", "wallet_address", "enc_rd", "created_at", "updated_at"}).
			AddRow(1, "1234", "wallet-1234", "enc-1234", time.Now(), "1685349266"))

	res, _ := services.GetUser(db, "1234")

	require.NotNil(t, res["user"], "The response > user object should not get nil value")
}
