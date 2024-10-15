package drive

import "github.com/drive/pkg/models"

var root = models.Root{
	Folders: []*models.Folder{},
	Files:   []*models.File{},
}

func NewFolder(id, name string) *models.Folder {
	return &models.Folder{
		ID:    id,
		Name:  name,
		Files: []*models.File{},
	}
}

func EditFolder(folder *models.Folder, id, name string) {
	folder.ID = id
	folder.Name = name
}

func NewFile(name, content string) *models.File {
	return &models.File{
		ID:      "0",
		Name:    name,
		Content: content,
	}
}

func EditFile(file *models.File, id, name, content string) {
	file.ID = id
	file.Name = name
	file.Content = content
}

func GetRoot() *models.Root {
	return &root
}
