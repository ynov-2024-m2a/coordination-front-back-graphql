package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.55

import (
	"context"
	"log/slog"

	"github.com/drive/pkg/drive"
	"github.com/drive/pkg/models"
)

// CreateFile is the resolver for the createFile field.
func (r *mutationResolver) CreateFile(ctx context.Context, name string, content string) (*models.File, error) {
	slog.Info("Creating file", "name", name, "content", content)
	return drive.NewFile(name, content)
}

// UpdateFileContent is the resolver for the updateFileContent field.
func (r *mutationResolver) UpdateFileContent(ctx context.Context, id string, content string) (*models.File, error) {
	return drive.UpdateFileContent(id, content)
}

// DeleteFile is the resolver for the deleteFile field.
func (r *mutationResolver) DeleteFile(ctx context.Context, id string) (*bool, error) {
	return drive.DeleteFile(id)
}

// CreateFolder is the resolver for the createFolder field.
func (r *mutationResolver) CreateFolder(ctx context.Context, name string) (*models.Folder, error) {
	return drive.NewFolder(name)
}

// DeleteFolder is the resolver for the deleteFolder field.
func (r *mutationResolver) DeleteFolder(ctx context.Context, id string) (*bool, error) {
	return drive.DeleteFolder(id)
}

// Root is the resolver for the root field.
func (r *queryResolver) Root(ctx context.Context) (*models.Root, error) {
	return drive.GetRoot(), nil
}

// Root is the resolver for the root field.
func (r *subscriptionResolver) Root(ctx context.Context) (<-chan *models.Root, error) {
	return drive.SubscribeRoot(), nil
}

// File is the resolver for the file field.
func (r *subscriptionResolver) File(ctx context.Context, id string) (<-chan *models.File, error) {
	return drive.SubscribeFile(id)
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Subscription returns SubscriptionResolver implementation.
func (r *Resolver) Subscription() SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
