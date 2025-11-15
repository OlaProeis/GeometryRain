# Contributing to GeometryRain

Thank you for your interest in contributing to GeometryRain! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- **Report Bugs**: Open an issue with a clear description and reproduction steps
- **Suggest Features**: Share ideas for new shapes, effects, or improvements
- **Submit Pull Requests**: Add features, fix bugs, or improve documentation
- **Improve Documentation**: Help make the docs clearer and more comprehensive
- **Share Configurations**: Post your custom configurations in Discussions

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Exact steps to trigger the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Operating system
   - Screen resolution (if relevant)
6. **Configuration**: Your `canvas-config.js` settings (if modified)
7. **Screenshots/Videos**: If applicable

## 💡 Suggesting Features

Feature requests are welcome! Please include:

1. **Use Case**: Why this feature would be useful
2. **Description**: Clear explanation of the feature
3. **Examples**: Similar implementations or mockups if available
4. **Configuration**: How it would fit into the existing config structure

## 🔧 Development Setup

1. **Fork the Repository**
```bash
git clone https://github.com/OlaProeis/GeometryRain.git
cd GeometryRain
```

2. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

3. **Make Your Changes**
   - Keep changes focused and atomic
   - Test thoroughly in multiple browsers
   - Follow the existing code style

4. **Test Your Changes**
```bash
# Start a local server
python -m http.server 8000
# or
npx http-server
```

5. **Commit Your Changes**
```bash
git add .
git commit -m "feat: add new spiral shape variation"
# or
git commit -m "fix: particle collision detection"
```

## 📝 Commit Message Guidelines

Use conventional commit format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add pentagon shape to formation types
fix: prevent particles from escaping canvas bounds
docs: update configuration examples in README
perf: optimize connection line calculations for 500+ particles
```

## 🎨 Code Style Guidelines

### JavaScript
- Use ES6+ features where appropriate
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add comments for complex logic
- Keep functions focused and single-purpose
- Maintain consistent indentation (4 spaces)

### CSS
- Use CSS custom properties (variables) for colors and values
- Keep selectors specific but not overly nested
- Group related properties
- Use meaningful class names
- Maintain consistent formatting

### Configuration
- Document all new config options
- Provide sensible defaults
- Use descriptive property names
- Group related settings

## 🧪 Testing

Before submitting, please test:

1. **Browser Compatibility**
   - Chrome/Edge (latest)
   - Firefox (latest)
   - Safari (if possible)

2. **Responsive Design**
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024)
   - Mobile (375x667, 414x896)

3. **Performance**
   - Monitor FPS with DevTools
   - Test with various particle counts
   - Check memory usage over time

4. **Feature Interactions**
   - Test new features with existing ones
   - Verify configuration changes work as expected
   - Ensure no console errors

## 📤 Pull Request Process

1. **Update Documentation**
   - Update README.md if adding features
   - Add JSDoc comments for new functions
   - Update canvas-config.js with new options

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe changes made
   - Include screenshots/videos for visual changes
   - List any breaking changes

3. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots or GIFs

## Related Issues
Closes #123
```

4. **Review Process**
   - Maintainers will review within a few days
   - Address any requested changes
   - Once approved, changes will be merged

## 🎯 Areas for Contribution

Looking for ideas? Here are some areas that need work:

### High Priority
- [ ] Mobile touch event support
- [ ] Additional shape types (octagon, flower, etc.)
- [ ] Performance optimizations for 1000+ particles
- [ ] Particle collision physics

### Medium Priority
- [ ] Color theme presets
- [ ] Sound effects (optional)
- [ ] Export animation as video
- [ ] Save/load configuration presets

### Documentation
- [ ] Video tutorials
- [ ] More configuration examples
- [ ] Code architecture explanation
- [ ] Performance optimization guide

### Nice to Have
- [ ] TypeScript definitions
- [ ] React/Vue component wrappers
- [ ] Alternative rendering (WebGL)
- [ ] Particle trail customization

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that could be considered unprofessional

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- **Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For private inquiries (if you set one up)

Thank you for contributing to GeometryRain! ✨

