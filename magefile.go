//go:build mage

package main

import (
	"github.com/magefile/mage/sh"
)

// Generate types and resolvers from schema.graphql
func Gen() error {
	return sh.Run("go", "run", "github.com/99designs/gqlgen", "generate")
}

// Run the server
func Run() error {
	return sh.Run("go", "run", "server.go")
}

// Build the server
func Build() error {
	return sh.Run("go", "build", "-o", "server", "server.go")
}
