package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"

	"github.com/windmillcode/go_scripts/utils"
)

func main() {

	dockerImgPath := utils.GetInputFromStdin(
		utils.GetInputFromStdinStruct{
			Prompt:  []string{"Please enter a path for the docker image backup"},
			Default: filepath.Join("E:\\docker-images"),
		},
	)
	dockerImgPath = filepath.Join(dockerImgPath)

	dockerContainerPath := utils.GetInputFromStdin(
		utils.GetInputFromStdinStruct{
			Prompt:  []string{"Please enter a path for the docker container backup"},
			Default: filepath.Join("E:\\docker-containers"),
		},
	)
	dockerContainerPath = filepath.Join(dockerContainerPath)
	folders := []string{dockerImgPath, dockerContainerPath}
	for _, folder := range folders {
		exists := utils.FolderExists(folder)
		if !exists {
			os.Mkdir(folder, 0755)
		}
	}

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		backupImages(dockerImgPath)
		// fmt.Println(dockerImgPath)
	}()
	wg.Add(1)
	go func() {
		defer wg.Done()
		backupContainers(dockerContainerPath)
	}()
	wg.Wait()
}

func backupContainers(targetPath string) {

	dockerContainers := utils.RunCommandAndGetOutput("docker", []string{"ps", "--format", "'{{.ID}}---{{.Names}}'", "-a"})

	dockerContainersArray := strings.Split(dockerContainers, "\n")
	var wg sync.WaitGroup
	for _, containerInfo := range dockerContainersArray {
		containerInfoWOQuotes := strings.Replace(containerInfo, "'", "", -1)
		containerInfoArray := strings.Split(containerInfoWOQuotes, "---")
		if len(containerInfoArray) == 2 {
			ctnrId :=   strings.TrimSpace(containerInfoArray[0])
			ctrnName := strings.TrimSpace(containerInfoArray[1])

			wg.Add(1)
			go func() {
				defer wg.Done()

				utils.RunCommandInSpecificDirectory("docker", []string{"commit", "-p", ctnrId, ctrnName}, targetPath)
				utils.RunCommandInSpecificDirectory("docker", []string{"save", "-o", fmt.Sprintf("%s.tar", ctrnName), ctrnName}, targetPath)
			}()
		}

	}
	wg.Wait()

}

func backupImages(targetPath string) {
	dockerImages := utils.RunCommandAndGetOutput("docker", []string{"images", "--format", "'{{.Repository}}:{{.Tag}}'", "-a"})
	dockerImagesArray := strings.Split(dockerImages, "\n")

	var wg sync.WaitGroup
	for _, repoTag := range dockerImagesArray {
		if !strings.Contains(repoTag, "<none>") {
			wg.Add(1)
			fmt.Println(repoTag)
			repoTagWithoutQuotes := strings.Replace(repoTag, "'", "", -1)
			regex0 := regexp.MustCompile(`[^a-zA-Z0-9|\.]`)
			tarImageName := regex0.ReplaceAllString(repoTagWithoutQuotes, "_")
			fmt.Println(tarImageName)
			go func() {
				defer wg.Done()
				utils.RunCommandInSpecificDirectory(
					"docker",
					[]string{"save", "-o", fmt.Sprintf("%s.tar", tarImageName), repoTagWithoutQuotes},
					targetPath,
				)
			}()
		}
	}
	wg.Wait()
}
