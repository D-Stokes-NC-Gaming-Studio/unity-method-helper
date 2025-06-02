# Changelog

All notable changes to this project will be documented in this file.

---

## [0.0.4] – 2025-06-02

### Added
- Auto-sync system for fetching Unity API updates and scraping new methods
- MonoBehaviour class template generator (via Command Palette)
- Unity project detector with warning prompt if not in a Unity workspace
- New icon mapping system for categories (used in Tree View and method listings)

### Changed
- Refactored `methods.json` format to include detailed category strings
- Improved scraper reliability and fallback handling for Unity Docs parsing

---

## [0.0.1] – 2025-06-01

### Added
- Unity method auto-completion for MonoBehaviour lifecycle methods
- Hover tooltips with links to Unity documentation
- Sidebar view with method categories and snippets
- Command Palette commands:
  - Insert method by category
  - Validate method data
  - Export selected methods to `.cs`
  - Generate custom snippets
- Keyboard shortcut: `Ctrl+Alt+U`
- Real-time method detection using diagnostics
