# Matrix Alchemy - A Personal Tech Blog 🧪

> Where machine learning, app development, and the psychology of technology converge.

[![Built with Hugo](https://img.shields.io/badge/Built_with-Hugo-FF4088?logo=hugo)](https://gohugo.io/)
[![Theme - Blowfish](https://img.shields.io/badge/Theme-Blowfish-blue)](https://github.com/nunocoracao/blowfish)

A personal tech blog powered by Hugo and the Blowfish theme, focusing on machine learning, app development, and technical insights.

## Site Configuration

This site uses the Blowfish theme with custom configurations. Here's how to work with it:

### Theme Setup
```bash
# Add Blowfish theme as a submodule
git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
```

### Key Features
- Multi-language support (currently configured for English)
- Integrated Firebase analytics
- Custom color scheme: "ocean"
- Advanced article features including:
  - Reading time
  - Table of contents
  - Code copying
  - Search functionality

### Configuration Structure
```
config/_default/
├── config.toml      # Main Hugo configuration
├── languages.en.toml # Language-specific settings
├── markup.toml      # Markdown rendering settings
├── menus.en.toml    # Navigation menu structure
├── module.toml      # Hugo module configuration
└── params.toml      # Theme parameters
```

### Author Information
- **Name**: Benji Peng, Ph.D.
- **Specialty**: Physical Chemistry
- **Focus**: Data Science and Machine Learning
- **Contact**: benji@appcubic.com

### Social Links
- GitHub: [@benjipeng](https://github.com/benjipeng)
- LinkedIn: [benjiph](https://www.linkedin.com/in/benjiph 

## Working with Git Submodules

This project uses git submodules to manage the Blowfish theme. Below are detailed instructions on how to update and inspect the submodules.

### Inspecting Submodules

1. **Check the status of submodules**:
   ```bash
   git submodule status
   ```
   This command will show the current commit checked out for each submodule.

2. **View the remote URL of a submodule**:
   ```bash
   git config --get submodule.themes/blowfish.url
   ```
   This will display the URL of the remote repository for the Blowfish theme submodule.

3. **Check the branch being tracked**:
   ```bash
   git config --get submodule.themes/blowfish.branch
   ```
   This command will show which branch the submodule is tracking.

### Updating Submodules

1. **Update a specific submodule to the latest commit**:
   ```bash
   git submodule update --remote themes/blowfish
   ```
   This command fetches the latest changes from the remote repository and updates the submodule to the latest commit.

2. **Update all submodules to their latest commits**:
   ```bash
   git submodule update --remote
   ```
   This will update all submodules in the project to their latest commits.

3. **Pull the latest changes from the submodule's remote repository**:
   ```bash
   git submodule foreach git pull origin main
   ```
   This command will iterate through each submodule and pull the latest changes from the specified branch.

4. **Reinitialize and update all submodules recursively**:
   ```bash
   git submodule update --init --recursive
   ```
   This command initializes any uninitialized submodules and updates them to the latest commit.

### Syncing Submodules Without History

If you want to sync a submodule to the latest commit without retaining its history, follow these steps:

1. **Remove the existing submodule**:
   ```bash
   git config -f .gitmodules --remove-section submodule.themes/blowfish
   git config -f .git/config --remove-section submodule.themes/blowfish
   rm -rf themes/blowfish
   git rm --cached themes/blowfish
   ```

2. **Re-add the submodule**:
   ```bash
   git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
   ```

3. **Initialize and update the submodule**:
   ```bash
   git submodule update --init --recursive
   ```