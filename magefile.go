//go:build mage

package main

import (
	"github.com/magefile/mage/sh"
)

// Runs go run github.com/99designs/gqlgen generate
func Gen() error {
	return sh.Run("go", "run", "github.com/99designs/gqlgen", "generate")
}
