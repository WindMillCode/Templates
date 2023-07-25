package main


import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

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


func main() {
	scriptLocation := os.Args[1]
	workspaceRoot := os.Args[2]
	settings, err := GetSettingsJSON(workspaceRoot)
	if err != nil {
		return
	}
	gaePath := filepath.Join(scriptLocation, "default-gae.json")


	fmt.Println(fmt.Sprintf(`
	FLASK_BACKEND_ENV=DEV,
	EVENTBRITE_OAUTH_TOKEN=[ENTER TOKEN HERE],
	SQLALCHEMY_POSTGRESSQL_0_CONN_STRING=postgresql://mypostgresadmin:mysecretpassword@localhost:5432/postgres-database-0,
	SQLALCHEMY_MYSQL_0_CONN_STRING=mysql+pymysql://mysqladmin:my-secret-pw@localhost:3306/mysql_database_0,
	RESTDBIO_SERVER_API_KEY_0="",
	SQUARE_SANDBOX_ACCESS_TOKEN_0=[ENTER ACCESS TOKEN HERE],
	GCLOUD_PROJECT=[ENTER GOOGLE CREDENTIALS HERE OR REMOVE AC NECESSARY],
	STORAGE_EMULATOR_HOST=http://localhost:9199,
	AUTH_EMULATOR_HOST=http://localhost:9099,
	FIREBASE_AUTH_EMULATOR_HOST=localhost:9099,
	GOOGLE_APPLICATION_CREDENTIALS=%s,
	OPENAI_API_KEY_0=%s
	`,gaePath,settings.ExtensionPack.OpenAIAPIKey0))




}
