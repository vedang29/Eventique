const fs = require("fs");

try {
    // Read all lines from validator_tokens.txt
    const lines = fs
        .readFileSync("validator_tokens.txt", "utf8")
        .split("\\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    // Save as JSON array
    fs.writeFileSync("tokens.json", JSON.stringify(lines, null, 2));

    console.log(`Converted ${lines.length} tokens into tokens.json`);
} catch (error) {
    console.error("Failed to convert tokens:", error.message);
}