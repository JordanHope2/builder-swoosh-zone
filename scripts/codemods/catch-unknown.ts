import { Project, SyntaxKind, Node, QuoteKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false
});

// where to run
project.addSourceFilesAtPaths([
  "app/**/*.ts",
  "app/**/*.tsx",
  "app/src/**/*.ts",
  "app/src/**/*.tsx",
  "app/server/**/*.ts",
  "app/client/**/*.ts",
  "app/client/**/*.tsx"
]);

const ERROR_HELPER_PATH = "app/client/lib/errors";

for (const sf of project.getSourceFiles()) {
  let needsErrorHelper = false;

  // 1) Ensure catch variables are typed 'unknown'
  sf.forEachDescendant(node => {
    if (Node.isCatchClause(node)) {
      const v = node.getVariableDeclaration();
      if (v) {
        const typeNode = v.getTypeNode();
        if (!typeNode || typeNode.getText().trim() !== "unknown") {
          v.setType("unknown");
        }
      }
    }
  });

  // 2) Replace `.message` access on catch vars with errorMessage()
  sf.forEachDescendant(node => {
    if (
      Node.isPropertyAccessExpression(node) &&
      node.getName() === "message"
    ) {
      const expr = node.getExpression();
      // Only transform obvious catch vars or identifiers
      if (Node.isIdentifier(expr)) {
        const identName = expr.getText();
        // Heuristic: if identifier is a catch var in this scope, rewrite
        const catchClause = node.getFirstAncestorByKind(SyntaxKind.CatchClause);
        if (catchClause) {
          const v = catchClause.getVariableDeclaration();
          const catchName = v?.getName();
          if (catchName && catchName === identName) {
            node.replaceWithText(`errorMessage(${identName})`);
            needsErrorHelper = true;
          }
        }
      }
    }
  });

  // 3) Import errorMessage if we used it and it's not imported yet
  if (needsErrorHelper) {
    const hasImport = sf.getImportDeclarations().some(d => {
      return (
        d.getModuleSpecifierValue().includes("/lib/errors") &&
        d.getNamedImports().some(n => n.getName() === "errorMessage")
      );
    });

    if (!hasImport) {
      sf.addImportDeclaration({
        namedImports: [{ name: "errorMessage" }],
        moduleSpecifier: ERROR_HELPER_PATH,
        quoteKind: QuoteKind.Single
      });
    }
  }
}

project.save().then(() => {

  console.info("✅ catch-unknown codemod complete.");
});
