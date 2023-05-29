package models

// User model
type Error struct {
	Success bool   `json:"success"`
	Reason  string `json:"reason"`
}
