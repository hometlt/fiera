
import fs from "fs";
import {join} from "path";

function readEmojisData(){
    let data3 = JSON.parse(fs.readFileSync("emojis-data.json"))
    let quialities = {
        4: "component",
        3: "fully-qualified",
        2: "minimally-qualified",
        1: "unqualified"
    }

    let emojisArray = data3.reduce((acc, curr) => {
        let emojis = curr.subgroups.reduce((acc2, curr2) => {
            return acc2.concat(curr2.emojis)
        },[])
        return acc.concat(emojis)

    },[])
    let emojisArray2 = emojisArray.filter(item => {
        if(item.code.includes(" FE0F")){
            let newCode = item.code.replace(" FE0F","")
            if(!emojisArray.find(item => item.code === newCode)){
                console.log("replacement for " + item.code + " was not found")
            }
            return false;
        }
        return true;
    })
    let emojisArray2emojis = emojisArray2.map(item => item.emoji)
    let mappingsString = "export default \"" + emojisArray2emojis.join(",") + "\"";
    fs.writeFileSync('emojis-mappings.js', mappingsString);
}
readEmojisData()

function __removeFEOFFromEmojiFilenames() {
    let [dir, search, replace] = process.argv.slice(1);
    dir = dir.substr(0, dir.lastIndexOf("\\"))
    const match = RegExp(/\*.png/, 'g');
    let files = fs.readdirSync(dir);
    files = files.filter(file => (/\.(svg|gif|jpe?g|tiff|png|webp|bmp)$/i).test(file))
    let array = {};
    files.forEach(file => {
        const filePath = join(dir, file);
        const name = file.split(".")[0];
        if(name.includes("-fe0f")){
            let newName = `${ name.replace(/-fe0f/gi,"")}.${file.split(".")[1]}`
            const newFilePath = join(dir, newName);
            console.log(newFilePath);
            fs.renameSync(filePath, newFilePath);
        }
    })
}

// emoji txt ehere: https://unicode.org/Public/emoji/4.0/emoji-test.txt
// (.*?(?=\s{2}))\s+; ([a-z-]+)\s+# ([^\s]+)\sE([0-9.]+) ([^\n]*)
// {"code": "$1", status": "$2", "emoji": "$3", "unicode": "$4", "description": "$5"}
