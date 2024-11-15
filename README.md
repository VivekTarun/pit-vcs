# Pit - A Lightweight Version Control System 🚀
**Pit** is a simple version control system inspired by Git. It lets you track changes, commit updates, and view the history of your project. Perfect for learning how version control works or managing simple projects without the complexity of Git.

---

## ✨ Features
- 🏁 **Initialize a Repository**: Create a `.pit` directory to track files.
- 📂 **Staging Area**: Add files to a staging area before committing.
- 💾 **Commit Changes**: Save the state of your files with a message.
- 📜 **View History**: View a log of all commits.
- 🔍 **Show Differences**: View file changes between commits.

---

## 🔧 Installation

### Using npm (Recommended)
Install **Pit** globally using npm:

```bash
npm install -g pit
```

### Clone from GitHub
Alternatively, clone the repository and link it globally:

```bash
git clone https://github.com/your-username/pit.git
cd pit
npm install
npm link
```

---

## 🚀 Usage

**Pit** provides a set of commands to manage your repository:

### 1. **Initialize a Repository**
Create a `.pit` directory in your project:

```bash
pit init
```

### 2. **Add Files to Staging**
Add files to the staging area:

```bash
pit add <file>
```

Example:
```bash
pit add sample.txt
```

### 3. **Commit Changes**
Save the state of your files with a message:

```bash
pit commit "<message>"
```

Example:
```bash
pit commit "Initial commit"
```

### 4. **View Commit History**
Display the log of all commits:

```bash
pit log
```

### 5. **Show Differences**
View file changes in a specific commit:

```bash
pit show <commitHash>
```

---

## 📖 Example Workflow

```bash
# Initialize a repository
pit init

# Add a file
pit add file.txt

# Commit changes
pit commit "Add file.txt"

# View commit history
pit log

# Show changes in a commit
pit show <commitHash>
```

---

## ⚙️ How It Works
- **.pit Directory**: All tracked files, commits, and metadata are stored in a `.pit` directory at the project root.
- **Staging Area**: Changes are staged in an `index` file within `.pit` before committing.
- **Commits**: Each commit is stored as a file in `.pit/objects` with metadata, a message, and file contents.

---

## 🛠 Development

### Prerequisites
- [Node.js](https://nodejs.org) (v16+ recommended)

### Install Dependencies
Run the following to install dependencies:

```bash
npm install
```

### Run Locally
Test commands directly using:

```bash
node index.js <command>
```

---

## 🤝 Contributing
Contributions are welcome! Follow these steps to contribute:

1. Fork this repository.
2. Create a branch (\`git checkout -b feature/my-feature\`).
3. Commit your changes (\`git commit -m "Add feature"\`).
4. Push to your branch (\`git push origin feature/my-feature\`).
5. Create a Pull Request.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements
- Inspired by Git.
- Uses helpful packages like:
  - [\`chalk\`](https://www.npmjs.com/package/chalk)
  - [\`commander\`](https://www.npmjs.com/package/commander)
  - [\`diff\`](https://www.npmjs.com/package/diff)

---

## 📞 Contact
For questions or support, feel free to reach out:

- **Name**: Vivek Tarun
- **Email**: vivektarun1234@gmail.com
- **GitHub**: [Vivek Tarun](https://github.com/vivektarun1234)
EOF
