package drive

import (
	"fmt"

	"github.com/drive/pkg/models"
	"github.com/google/uuid"
)

var root = models.Root{
	Folders: []*models.Folder{
		{
			ID:   uuid.New().String(),
			Name: "Folder #1",
			Files: []*models.File{
				{
					ID:      uuid.New().String(),
					Name:    "File #1",
					Content: "Test File 1",
				},
			},
		},
		{
			ID:   uuid.New().String(),
			Name: "Folder #2",
			Files: []*models.File{
				{
					ID:      uuid.New().String(),
					Name:    "File #2",
					Content: "Test FIle 2",
				},
			},
		},
		{
			ID:   uuid.New().String(),
			Name: "Folder #3",
			Files: []*models.File{
				{
					ID:      uuid.New().String(),
					Name:    "File #3",
					Content: "Test File 3",
				},
			},
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
	for _, folder := range root.Folders {
		for _, f := range folder.Files {
			if f.ID == id {
				f.Content = content
				select {
				case fileChannels[id] <- f:
				default:
				}
				return f, nil
			}
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
	for _, folder := range root.Folders {
		for i, f := range folder.Files {
			if f.ID == id {
				folder.Files = append(folder.Files[:i], folder.Files[i+1:]...)

				select {
				case rootChan <- &root:
				default:
				}
				delete(fileChannels, id)
				return new(bool), nil
			}
		}
	}
	return nil, fmt.Errorf("file with id " + id + " not found")
}

// func for moving file to folder
func MoveFile(id, folderID string) (bool, error) {
	for i, f := range root.Files {
		if f.ID == id {
			for _, folder := range root.Folders {
				if folder.ID == folderID {
					folder.Files = append(folder.Files, f)
					root.Files = append(root.Files[:i], root.Files[i+1:]...)
					select {
					case rootChan <- &root:
					default:
					}
					return true, nil
				}
			}
			return false, fmt.Errorf("folder with id " + folderID + " not found")
		}
	}
	return false, fmt.Errorf("file with id " + id + " not found")
}

func MoveFileToRoot(id string) (bool, error) {
	for _, folder := range root.Folders {
		for i, f := range folder.Files {
			if f.ID == id {
				root.Files = append(root.Files, f)
				folder.Files = append(folder.Files[:i], folder.Files[i+1:]...)
				select {
				case rootChan <- &root:
				default:
				}
				return true, nil
			}
		}
	}
	return false, fmt.Errorf("file with id " + id + " not found")
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
