package controllers

import "github.com/gofiber/fiber/v2"

type IErrorController interface {
	NotFound(c *fiber.Ctx) error
}

func (ctx IUserContext) NotFound(c *fiber.Ctx) error {
	return c.Status(404).SendFile("./static/private/404.html")
}
