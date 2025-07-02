# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## 🔧 Mock Data for Development

This project includes comprehensive mock data functionality for local development and testing without needing to connect to the real API.

### Automatic Mock Mode

By default, the application runs in mock mode when:

- `NODE_ENV=development` (automatically enabled with `yarn start`)
- `REACT_APP_USE_MOCK_DATA=true` is set in environment variables

### Mock Data Features

- **Realistic Data**: Mock data includes classes for the next 7 days with varied schedules
- **Network Simulation**: API calls include realistic delays (300-1000ms)
- **Complete Coverage**: All API endpoints are mocked:
  - `/availability/classes` - Yoga and meditation classes
  - `/calendars` - Teacher information
  - `/appointment-types` - Class types and scheduling

### Development Tools

In development mode, the following utilities are available in the browser console:

```javascript
// Check current API mode
window.getMockStatus()

// Toggle between mock and live API (requires page refresh)
window.toggleMockMode()
```

### Environment Configuration

Create a `.env` file in the project root to control mock mode:

```env
# Enable mock data (optional, defaults to true in development)
REACT_APP_USE_MOCK_DATA=true
```

### Mock Data Structure

Mock data includes:

- **8 different class types**: Morning Meditation, Hatha Yoga for Beginners, Vinyasa Flow, Evening Meditation, Pranayama, Power Yoga, Yoga Nidra, and Yin Yoga
- **3 teachers**: Anna, Sarah, and Olga Stas-Belovidova
- **3 appointment types**: Meditation, Yoga, and Breathing Practices
- **Dynamic scheduling**: Different schedules for weekdays and weekends

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
