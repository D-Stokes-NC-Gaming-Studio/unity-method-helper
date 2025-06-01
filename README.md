# Unity Method Helper

**Unity Method Helper** is a powerful Visual Studio Code extension for Unity 6 C# developers.  
It provides smart auto-completion, hover documentation, snippet insertion, command palette tools, a categorized tree view, and export-to-file functionality — all tailored for Unity's MonoBehaviour lifecycle and physics methods.

![Unity Method Helper Banner](https://raw.githubusercontent.com/D-Stokes-NC-Gaming-Studio/unity-method-helper/main/media/unity-helper-banner.png)

---

## 🧰 Features

- 🧠 **Auto-completion** for Unity methods like `Start()`, `Update()`, `OnCollisionEnter()`, etc.
- 🔎 **Hover tooltips** with method description, examples, and official docs
- 🎛️ **Command Palette** tools for:
  - Inserting Unity methods by category
  - Generating custom method snippets
  - Validating method database
  - Exporting selected methods into `.cs` files
- 📂 **Sidebar View** for exploring Unity methods by category
- 🎨 **Category icons** for MonoBehaviour 🔄, Physics ⚙️, UI 🖥️, Audio 🔊, AI 🧠

---

## ⚙️ Requirements

- Visual Studio Code version `^1.100.0`
- Unity project using C#
- No additional dependencies

---

## 🚀 Getting Started

1. Install the extension from the VS Code Marketplace.
2. Open a Unity `.cs` script.
3. Use:
   - Autocomplete suggestions
   - `Ctrl+Alt+U` to open the snippet menu
   - Command Palette (`Ctrl+Shift+P`) to run Unity-specific tools
   - Sidebar panel to browse and insert methods

---

## 🎛️ Commands

You can run these via Command Palette or keybindings:

| Command | Description |
|--------|-------------|
| `Unity: Insert Snippet by Category` | Choose a method category and insert a predefined method |
| `Unity: Show All Methods` | View and open official documentation for all supported methods |
| `Unity: Validate Method Data` | Run checks on your methods.json file |
| `Unity: Create Custom Method Snippet` | Insert your own method name + body into the current file |
| `Unity: Export Selected Methods to .cs` | Export multiple Unity methods to a `UnityBoilerplate.cs` class file |

---

## 🧩 Sidebar View

Click the **Unity** icon in the activity bar to:

- Browse categorized Unity methods
- Click any method to instantly insert its code snippet

---

## 🧪 Extension Settings

This extension does not expose user-facing settings yet.

---

## 🐞 Known Issues

- The extension depends on a valid `methods.json` file located at the project root.
- Hover and autocomplete are limited to C# files (`.cs`) only.

---

## 📝 Release Notes

### v0.0.1

- Initial release
- Auto-completion, hover provider, command palette tools, and sidebar view
- Export-to-.cs and diagnostics functionality
- Icon and banner image added for branding

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 📚 Resources

- [Unity C# API Reference](https://docs.unity3d.com/ScriptReference/)
- [VS Code Extension Authoring Guide](https://code.visualstudio.com/api)

---

**Made with ❤️ by [D-Stokes NC Gaming Studio](https://github.com/D-Stokes-NC-Gaming-Studio)**