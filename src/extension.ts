import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface UnityMethod {
  description: string;
  category: string;
  example: string;
  url: string;
}

let unityMethods: Record<string, UnityMethod> = {};
let diagnosticsCollection: vscode.DiagnosticCollection;

/** Returns a themed icon based on the category */
function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'MonoBehaviour': return '🔄';
    case 'physics': return '⚙️';
    case 'animation': return '🎞️';
    case 'ui': return '🖥️';
    case 'audio': return '🔊';
    case 'ai': return '🧠';
    default: return '📦';
  }
}
export function activate(context: vscode.ExtensionContext) {
  console.log("✅ Unity Method Helper Extension Activated");
  const methodsPath = path.join(context.extensionPath, 'methods.json');
  if (fs.existsSync(methodsPath)) {
    unityMethods = JSON.parse(fs.readFileSync(methodsPath, 'utf-8'));
  }

  const config = vscode.workspace.getConfiguration('unityMethodHelper');
  diagnosticsCollection = vscode.languages.createDiagnosticCollection('unityMethods');
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'csharp',
    {
      provideCompletionItems() {
        return Object.entries(unityMethods).map(([name, method]) => {
          const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Method);
          item.detail = `Unity ${method.category}`;
          item.insertText = new vscode.SnippetString(method.example);
          item.documentation = new vscode.MarkdownString(`${method.description}\n\n[🔗 Docs](${method.url})`);
          return item;
        });
      }
    },
    '.' // Trigger
  );
  const hoverProvider = vscode.languages.registerHoverProvider('csharp', {
    provideHover(document, position) {
      const word = document.getText(document.getWordRangeAtPosition(position));
      const method = unityMethods[word];
      if (!method) {
        return;
      }

      return new vscode.Hover([
        `**${getCategoryIcon(method.category)} ${word}** (${method.category})`,
        '',
        method.description,
        '```csharp\n' + method.example + '\n```',
        `[🔗 Open Docs](${method.url})`
      ]);
    }
  });
  const showAllCommand = vscode.commands.registerCommand('unityMethods.showAll', async () => {
    const items = Object.entries(unityMethods).map(([name, method]) => ({
      label: `${getCategoryIcon(method.category)} ${name}`,
      description: method.description,
      detail: `Category: ${method.category}`,
      methodData: method
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a Unity method to open documentation'
    });

    if (selected) {
      vscode.env.openExternal(vscode.Uri.parse(selected.methodData.url));
    }
  });
  const snippetInsertCommand = vscode.commands.registerCommand('unityMethods.insertSnippet', async () => {
    const categories = [...new Set(Object.values(unityMethods).map(m => m.category))];

    const selectedCategory = await vscode.window.showQuickPick(categories, {
      placeHolder: 'Select a Unity method category'
    });
    if (!selectedCategory) {
      return;
    }

    const methods = Object.entries(unityMethods)
      .filter(([, m]) => m.category === selectedCategory)
      .map(([name, m]) => ({
        label: `${getCategoryIcon(m.category)} ${name}`,
        description: m.description,
        method: m
      }));

    const selectedMethod = await vscode.window.showQuickPick(methods, {
      placeHolder: `Choose a ${selectedCategory} method`
    });

    if (selectedMethod && vscode.window.activeTextEditor) {
      vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(selectedMethod.method.example));
    }
  });
  const validateUnityData = vscode.commands.registerCommand('unityMethods.validateUnityData', () => {
    const problems: string[] = [];

    for (const [name, method] of Object.entries(unityMethods)) {
      if (!method.description) {problems.push(`${name} is missing description`);}
      if (!method.example) {problems.push(`${name} is missing example`);}
      if (!method.category) {problems.push(`${name} is missing category`);}
    }

    if (problems.length === 0) {
      vscode.window.showInformationMessage("✅ All Unity methods are valid!");
    } else {
      vscode.window.showErrorMessage(`❌ Found ${problems.length} problems:\n${problems.join('\n')}`);
    }
  });
  const generateMethodSnippet = vscode.commands.registerCommand('unityMethods.generateMethodSnippet', async () => {
    const name = await vscode.window.showInputBox({
      placeHolder: 'Enter your method name (e.g. CustomLogic)',
      validateInput: (text) => !text.match(/^[A-Za-z_][A-Za-z0-9_]*$/) ? 'Invalid method name' : null
    });
    if (!name) {return;}

    const body = await vscode.window.showInputBox({
      placeHolder: 'Enter method body (e.g. Debug.Log("Run");)',
    });
    if (body === undefined) {return;}

    const snippet = `void ${name}() {\n    ${body}\n}`;

    if (vscode.window.activeTextEditor) {
      vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString(snippet));
    }

    vscode.window.showInformationMessage(`✅ Inserted method snippet: ${name}()`);
  });
  const treeProvider: vscode.TreeDataProvider<vscode.TreeItem> = {
    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
      if (!element) {
        // Top-level categories
        const categories = [...new Set(Object.values(unityMethods).map(m => m.category))];
        return categories.map(category => {
          return new vscode.TreeItem(`${getCategoryIcon(category)} ${category}`, vscode.TreeItemCollapsibleState.Collapsed);
        });
      } else {
        const categoryName = element.label!.toString().replace(/^.*?\s/, '');
        const methods = Object.entries(unityMethods).filter(([, m]) => m.category === categoryName);

        return methods.map(([name, method]) => {
          const item = new vscode.TreeItem(`${name}`, vscode.TreeItemCollapsibleState.None);
          item.tooltip = method.description;
          item.command = {
            command: 'unityMethods.insertSnippetFromTree',
            title: 'Insert Method',
            arguments: [method]
          };
          return item;
        });
      }
    },
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
      return element;
    }
  };

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('unityMethodTree', treeProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('unityMethods.insertSnippetFromTree', (method: UnityMethod) => {
      vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(method.example));
    })
  );
  const exportToBoilerplate = vscode.commands.registerCommand('unityMethods.exportToBoilerplate', async () => {
    const selectedMethods = await vscode.window.showQuickPick(
      Object.entries(unityMethods).map(([name, method]) => ({
        label: name,
        description: method.description,
        method
      })),
      {
        canPickMany: true,
        placeHolder: 'Select methods to export to a .cs file'
      }
    );

    if (!selectedMethods || selectedMethods.length === 0) {return;}

    const fileContent = `
using UnityEngine;

public class UnityBoilerplate : MonoBehaviour
{
${selectedMethods.map(sel => `    ${sel.method.example.replace(/\n/g, '\n    ')}`).join('\n\n')}
}
    `.trim();

    const uri = await vscode.window.showSaveDialog({
      filters: { 'C# Files': ['cs'] },
      defaultUri: vscode.Uri.file('UnityBoilerplate.cs')
    });

    if (uri) {
      fs.writeFileSync(uri.fsPath, fileContent, 'utf8');
      vscode.window.showInformationMessage(`Exported ${selectedMethods.length} method(s) to ${uri.fsPath}`);
    }
  });
  vscode.workspace.onDidChangeTextDocument(event => {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = event.document.getText();

    for (const [methodName, method] of Object.entries(unityMethods)) {
      const regex = new RegExp(`\\b${methodName}\\b`, 'g');
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const pos = event.document.positionAt(match.index);
        diagnostics.push(new vscode.Diagnostic(
          new vscode.Range(pos, pos.translate(0, methodName.length)),
          `Unity method: ${methodName} (${method.category})`,
          vscode.DiagnosticSeverity.Hint
        ));
      }
    }

    diagnosticsCollection.set(event.document.uri, diagnostics);
  });

  // Register all top-level commands/providers
  context.subscriptions.push(
    completionProvider,
    hoverProvider,
    showAllCommand,
    snippetInsertCommand,
    validateUnityData,
    generateMethodSnippet,
    exportToBoilerplate,
    diagnosticsCollection
  );
}

export function deactivate() {
  diagnosticsCollection?.dispose();
}
