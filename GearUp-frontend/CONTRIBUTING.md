# Contributing to GearUp

Thank you for your interest in contributing to GearUp!

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/gearup-frontend.git
   cd gearup-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for type safety
- Follow existing naming conventions
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic

## Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests if applicable
   - Update documentation

3. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add your feature description"
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Format

We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

Before submitting:
- Run `npm run build` to ensure no build errors
- Test your changes manually
- Check for console errors
- Verify responsive design

## Pull Request Guidelines

- Describe what your PR does
- Link related issues
- Add screenshots for UI changes
- Ensure CI checks pass
- Request review from maintainers

## Questions?

Feel free to open an issue for questions or suggestions!