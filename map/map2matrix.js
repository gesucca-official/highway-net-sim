const fs = require('fs');
fs.unlinkSync("src/maps/map0.ts");
const text = fs.readFileSync("map/map0.txt", "utf8");
const map = [];
text.split("\n").forEach(line => {
    const mappedLine = [];
    line.split("").forEach(char => {
        mappedLine.push(char);
    })
    map.push(mappedLine);
});
fs.writeFileSync('src/maps/map0.ts', "export const map0 = " + JSON.stringify(map))
