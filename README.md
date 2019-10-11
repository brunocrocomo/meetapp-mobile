# Meetapp Mobile

Mobile application (**Android** only, for now) of the project proposed as exercise on GoStack Bootcamp by [Rocketseat](https://rocketseat.com.br/).

Written in [React Native](https://facebook.github.io/react-native/).

### How to run?

_Make sure you have got the [backend](https://github.com/brunocrocomo/meetapp-backend) running before following the steps below!_

As prerequisite you need to have an Android mobile device connected to your computer or an Android emulator running (such as provided by AVD, Genymotion, etc.).

Also, you will need to follow the instructions of the official React Native docs to setup your environment to get started. The steps required are described at React Native CLI Quickstart section of [this page](https://facebook.github.io/react-native/docs/getting-started) - under your Development OS and Target OS setted as Android.

Once you're ready to go, you just need to:

1. Clone this repository:

```
$ git clone https://github.com/brunocrocomo/meetapp-mobile.git
```

2. Move into `meetapp-mobile` directory:

```
$ cd meetapp-mobile
```

3. Run `yarn` to install the dependencies

```
$ yarn
```

4. Move into `android/app` directory:

```
$ cd android/app
```

5. Generate the `debug.keystore` file running the following command (alternatively, you can download this file from [this link](https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore) and place inside this folder):

```
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

6. Move back to the `meetapp-mobile` directory:

```
$ cd ../..
```

7. Install the application on the device or emulator:

```
$ react-native run-android
```

If you got some build/install errors, it may be a good idea to clear the `gradle` cache running the command below before trying to install the application again:

```
$ cd android

$ ./gradlew clean
```

8. Once the application is installed and you want to run it again, you just need to run the following command:

```
$ react-native start
```

or, if you want to reset the application cache:

```
$ react-native start --reset-cache
```

### Production features

-   Screens navigation powered by [React Navigation](https://github.com/react-navigation/react-navigation).

-   Styled componentization supported by [styled-components](https://github.com/styled-components/styled-components) and [polished](https://github.com/styled-components/polished) libraries.

-   State management and side effects supported by [Redux](https://github.com/reduxjs/redux) and [Redux-Saga](https://github.com/redux-saga/redux-saga).

-   Persist of redux store with [Redux Persist](https://github.com/rt2zz/redux-persist).

-   HTTP requests with [Axios](https://github.com/axios/axios) client.

-   Stylish interfaces powered by [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) and [React Native Linear Gradient](https://github.com/react-native-community/react-native-linear-gradient).

-   Stylish notifications powered by [React Native Snackbar](https://github.com/cooperka/react-native-snackbar).

-   Object schema validation with [Yup](https://github.com/jquense/yup) library.

-   Date and time formatting and validation with [date-fns](https://github.com/date-fns/date-fns) library.

-   Creation of immutable state supported by [Immer](https://github.com/immerjs/immer).

### Development features

-   Code linting and formatting with [ESlint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier) and [EditorConfig](https://editorconfig.org/).

-   Root import supported by [babel-plugin-root-import](https://github.com/entwicklerstube/babel-plugin-root-import).

-   App inspecting powered by [Reactotron](https://github.com/infinitered/reactotron).
