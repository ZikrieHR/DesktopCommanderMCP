## 2025-09-13 - Avoid Eager Async Background Tasks on MCP Startup

**Learning:** Eager background tasks triggered during MCP server startup (`oninitialized`), such as checking or downloading Chrome/browser binaries or fetching network flags without `--no-onboarding`, can consume network bandwidth, delay protocol handshake completion, or cause timeouts in stdio client tests.
**Action:** Keep MCP server startup lightweight and strictly lazy-load heavy background tasks (like browser downloads/checks) until the specific tool requiring them (e.g., `write_pdf` / `parseMarkdownToPdf`) is invoked.
