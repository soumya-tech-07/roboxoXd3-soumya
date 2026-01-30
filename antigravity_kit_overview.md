# Antigravity Kit Overview

## Introduction
Antigravity Kit (@vudovn/ag-kit) is a comprehensive toolkit designed to enhance your development workflow by providing AI Agent templates, Skills, and Workflows. It integrates seamlessly into your project by initializing an `.agent` directory containing all the necessary configurations.

## Installation
To install the kit in your project, you can use the following command:
```bash
npx @vudovn/ag-kit init
```

Alternatively, it can be installed globally:
```bash
npm install -g @vudovn/ag-kit
ag-kit init
```
This process creates an `.agent` folder in your project root, which houses all the templates.

## Core Features

### 1. Intelligent Agents
The system eliminates the need to explicitly mention agents. It acts as an intelligent orchestrator that:
- **Analyzes** your request silently.
- **Detects** the domain (e.g., Frontend, Backend, Security, Debugging).
- **Selects** the best specialist agent for the task.
- **Informs** you which expertise is being applied.

**Examples:**
- Prompt: "Add JWT authentication" -> Activates `@security-auditor` + `@backend-specialist`
- Prompt: "Fix the dark mode button" -> Activates `@frontend-specialist`
- Prompt: "Login returns 500 error" -> Activates `@debugger`

**Benefits:**
- ✅ **Zero Learning Curve**: Just describe what you need.
- ✅ **Expert Responses**: Always usage the right specialist.
- ✅ **Transparency**: You know exactly which agent is working.
- ✅ **flexibility**: You can still override by mentioning an agent explicitly.

### 2. Powerful Workflows
Workflows are pre-defined sequences of actions you can invoke using slash commands.
**Available Commands:**
- `/brainstorm`: Generate ideas for systems or features.
- `/create`: Generate code or content (e.g., specific pages).
- `/debug`: Systematically analyze and fix errors.
- `/deploy`: Handle deployment tasks.
- `/enhance`: Improve existing code or features.
- `/orchestrate`: Manage complex multi-step tasks.
- `/plan`: Create detailed implementation plans.
- `/preview`: Preview changes.
- `/status`: Check the status of current tasks.
- `/test`: Run or generate tests.
- `/ui-ux-pro-max`: Enhance UI/UX design.

### 3. Adaptive Skills
Skills are specialized knowledge bases that are loaded automatically based on the task context. The AI reads skill descriptions and applies relevant knowledge without manual intervention.

## CLI Tool Reference
The `ag-kit` CLI provides several commands and options to manage your agent configuration:

**Commands:**
- `ag-kit init`: Initialize the kit in the current directory.
- `ag-kit update`: Update the templates to the latest version.
- `ag-kit status`: Check the status of the installation.

**Options:**
- `--force`: Overwrite existing `.agent` folder.
- `--path ./myapp`: Install in a specific directory.
- `--branch dev`: Use a specific branch for templates.
- `--quiet`: Suppress output (useful for CI/CD).
- `--dry-run`: Preview actions without executing.

This kit effectively turns your AI assistant into a team of specialists with a rich set of tools and workflows, streamlining the development process significantly.
