import { Project, Node, ParameterDeclaration } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false
});

project.addSourceFilesAtPaths([
  "app/**/*.ts",
  "app/**/*.tsx",
  "app/src/**/*.ts",
  "app/src/**/*.tsx",
  "app/server/**/*.ts",
  "app/client/**/*.ts",
  "app/client/**/*.tsx"
]);

function renameParamIfUnused(p: ParameterDeclaration) {
  const nameNode = p.getNameNode();
  if (!Node.isIdentifier(nameNode)) return;
  const name = nameNode.getText();

  // already ignored?
  if (name.startsWith("_")) return;

  // Heuristic: if param has no references other than its declaration, prefix "_"
  const refs = nameNode.findReferencesAsNodes();
  const uses = refs.filter(r => r.getPos() !== nameNode.getPos());
  if (uses.length === 0) {
    p.rename(`_${name}`);
  }
}

for (const sf of project.getSourceFiles()) {
  sf.forEachDescendant(node => {
    if (
      Node.isFunctionDeclaration(node) ||
      Node.isFunctionExpression(node) ||
      Node.isArrowFunction(node) ||
      Node.isMethodDeclaration(node)
    ) {
      node.getParameters().forEach(renameParamIfUnused);
    }
  });
}

project.save().then(() => {

  console.info("✅ unused-params codemod complete.");
});
