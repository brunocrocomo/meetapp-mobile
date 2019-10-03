import Snackbar from 'react-native-snackbar';

export function showSuccessSnackbar(message) {
    Snackbar.show({
        title: message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#309500',
        color: '#fff',
    });
}

export function showErrorSnackbar(message) {
    Snackbar.show({
        title: message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#f1002e',
        color: '#fff',
    });
}
