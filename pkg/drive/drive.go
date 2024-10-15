package drive

import (
	"fmt"

	"github.com/drive/pkg/models"
	"github.com/google/uuid"
)

var root = models.Root{
	Folders: []*models.Folder{
		{
			ID:    uuid.New().String(),
			Name:  "Folder #1",
			Files: []*models.File{},
		},
	},
	Files: []*models.File{},
}
var rootChan = make(chan *models.Root, 1)
var fileChannels = make(map[string]chan *models.File)

func isFolderUnique(name string) bool {
	for _, f := range root.Folders {
		if f.Name == name {
			return true
		}
	}
	return false
}

func isFileUnique(name string) bool {
	for _, f := range root.Files {
		if f.Name == name {
			return true
		}
	}
	return false
}

func NewFolder(name string) (*models.Folder, error) {
	if isFolderUnique(name) {
		return nil, fmt.Errorf("folder with name " + name + " already exists")
	}
	f := &models.Folder{
		ID:    uuid.New().String(),
		Name:  name,
		Files: []*models.File{},
	}
	root.Folders = append(root.Folders, f)
	select {
	case rootChan <- &root:
		// Notification envoyée avec succès
	default:
		// Aucun client abonné, on ignore l'envoi
	}
	return f, nil
}

func DeleteFolder(id string) (*bool, error) {
	for i, f := range root.Folders {
		if f.ID == id {
			root.Folders = append(root.Folders[:i], root.Folders[i+1:]...)
			select {
			case rootChan <- &root:
			default:
			}

			//delete all file channels
			for _, file := range f.Files {
				delete(fileChannels, file.ID)
			}

			return new(bool), nil
		}
	}
	return nil, fmt.Errorf("folder with id " + id + " not found")
}

func NewFile(name, content string) (*models.File, error) {
	if isFileUnique(name) {
		return nil, fmt.Errorf("file with name " + name + " already exists")
	}
	f := &models.File{
		ID:      uuid.New().String(),
		Name:    name,
		Content: content,
	}
	root.Files = append(root.Files, f)
	fileChannels[f.ID] = make(chan *models.File)
	select {
	case rootChan <- &root:
		// Notification envoyée avec succès
	default:
		// Aucun client abonné, on ignore l'envoi
	}
	return f, nil
}

func UpdateFileContent(id, content string) (*models.File, error) {
	for _, f := range root.Files {
		if f.ID == id {
			f.Content = content
			select {
			case fileChannels[id] <- f:
			default:
			}
			return f, nil
		}
	}
	return nil, fmt.Errorf("file with id " + id + " not found")
}

func DeleteFile(id string) (*bool, error) {
	for i, f := range root.Files {
		if f.ID == id {
			root.Files = append(root.Files[:i], root.Files[i+1:]...)
			select {
			case rootChan <- &root:
			default:
			}
			delete(fileChannels, id)
			return new(bool), nil
		}
	}
	return nil, fmt.Errorf("file with id " + id + " not found")
}

func GetRoot() *models.Root {
	return &root
}
func SubscribeRoot() chan *models.Root {
	return rootChan
}

func SubscribeFile(id string) (<-chan *models.File, error) {
	if _, ok := fileChannels[id]; !ok {
		return nil, fmt.Errorf("file with id " + id + " not found")
	}
	return fileChannels[id], nil
}
