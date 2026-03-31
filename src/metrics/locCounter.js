function countLOC(code) {

    const lines = code.split("\n");

    let count = 0;
    let insideBlockComment = false;

    for (let line of lines) {

        line = line.trim();

        if (line === "") continue;

        if (insideBlockComment) {

            if (line.includes("*/")) {
                insideBlockComment = false;
            }

            continue;
        }

        if (line.startsWith("/*")) {

            insideBlockComment = true;

            if (line.includes("*/")) {
                insideBlockComment = false;
            }

            continue;
        }

        if (line.startsWith("//")) continue;

        count++;

    }

    return count;
}

module.exports = {
    countLOC
};