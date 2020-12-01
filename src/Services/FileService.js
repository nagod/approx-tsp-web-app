// TODMake Singleton

class FileService{
    
    static readFileAsText(file) {
        const reader = new FileReader();
        return reader.readAsText(file)
    }

}