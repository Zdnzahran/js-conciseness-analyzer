function traverseAST(node, visitor) {

    if (!node || typeof node !== "object") return;

    visitor(node);

    for (let key in node) {

        const child = node[key];

        if (Array.isArray(child)) {

            child.forEach(n => traverseAST(n, visitor));

        } else if (child && typeof child.type === "string") {

            traverseAST(child, visitor);

        }

    }
}

module.exports = {
    traverseAST
};