package models

import "time"

// User model
type User struct {
	ID            uint      `json:"id"`
	Nric          string    `json:"nric" gorm:"unique"`
	WalletAddress string    `json:"wallet_address" gorm:"primaryKey"`
	EncRD         string    `json:"enc_rd"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     int       `json:"updated_at" gorm:"autoCreateTime"`
}

type Receipt struct {
	Receipt string `json:"receipt"`
}
