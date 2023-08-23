package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

func RunCommand(command string,args []string) {

	fullCommand :=  fmt.Sprintf("Running command: %s %s", command,strings.Join(args," "))
	fmt.Println(fullCommand)
	cmd := exec.Command(command, args...)
	// cmd.Stdout = ShellCommandOutput{}
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {

		msg := fmt.Sprintf("Could not run command %s %s \n This was the err %s", command,strings.Join(args," "),err.Error())
		fmt.Println(msg)
	}
}

type GetInputFromStdinStruct struct{
	Prompt []string
	ErrMsg string
	Default string
}

func GetInputFromStdin(obj GetInputFromStdinStruct) string {
	if len(obj.Prompt) == 0 {
		obj.Prompt = []string{"Enter your input: "} // Default value
	} else  {
		obj.Prompt[0] += " "
	}
	// Create a new scanner to read from stdin
	scanner := bufio.NewScanner(os.Stdin)

	if obj.Default != "" {
		fmt.Print(fmt.Sprintf("%s (Default is %s) ",obj.Prompt[0] , obj.Default))
	} else {
		fmt.Print(fmt.Sprintf("%s",obj.Prompt[0]))
	}

	// Read the next line of input from stdin
	scanner.Scan()
	input := scanner.Text()
	if (input == "" && obj.Default != ""){
		input = obj.Default
	} else if(input == "" && obj.ErrMsg != ""){
		panic(obj.ErrMsg)
	}

	return input
}


type WindmillcodeExtensionPack struct {
	SQLDockerContainerName string   `json:"sqlDockerContainerName"`
	DatabaseName           string   `json:"databaseName"`
	DatabaseOptions        []string `json:"databaseOptions"`
	OpenAIAPIKey0          string   `json:"openAIAPIKey0"`
	LangCodes0	           string   `json:"langCodes0"`
}

type VSCodeSettings struct {
	ExtensionPack WindmillcodeExtensionPack `json:"windmillcode-extension-pack-0"`
}

func GetSettingsJSON (workSpaceFolder string) (VSCodeSettings,error){
	settingsJSONFilePath := filepath.Join(workSpaceFolder,"/.vscode/settings.json")
	var settings VSCodeSettings
	content, err := ioutil.ReadFile(settingsJSONFilePath)
	if err != nil {
		fmt.Println("Error reading file:", err.Error())
		return settings,err
	}
	err = json.Unmarshal(content, &settings)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err.Error())
		return settings,err
	}
	return settings,nil
}
func CDToLocation(location string){
	if err := os.Chdir(location); err != nil {
		panic(err)
	}
}

func main() {

	CDToLocation(os.Args[1])
	workspaceRoot, err := os.Getwd()
	if err != nil {
		return
	}
	settings, err := GetSettingsJSON(workspaceRoot)
	if err != nil {
		return
	}

	mySQLDatabaseport := GetInputFromStdin(
		GetInputFromStdinStruct{
			Prompt: []string{"the port to mysql on your local computer"},
			Default: "3306",
		},
	)
	dockerPort :=  mySQLDatabaseport+":3306"
	RunCommand("docker",[]string{"stop",settings.ExtensionPack.SQLDockerContainerName})
	RunCommand("docker",[]string{"rm",settings.ExtensionPack.SQLDockerContainerName})
	RunCommand("docker",[]string{ "run", "--name", settings.ExtensionPack.SQLDockerContainerName, "-e", "MYSQL_ROOT_PASSWORD=my-secret-pw", "-p", dockerPort, "-d", "mysql:latest"})
	RunCommand("docker",[]string{"cp","./ignore/Local/init_mysql_db_conn.sql", settings.ExtensionPack.SQLDockerContainerName+":/root/"})
	time.Sleep(20 * time.Second)
	RunCommand("docker", []string{"exec", "--workdir", "/root", settings.ExtensionPack.SQLDockerContainerName, "mysql", "--password=my-secret-pw", "-e", "source init_mysql_db_conn.sql"})


}
