import { takeLatest, call, put, all } from 'redux-saga/effects';

import NavigationService from '~/services/navigation';
import api from '~/services/api';

import {
    showSuccessSnackbar,
    showErrorSnackbar,
} from '../../../utils/Snackbar';

import { signInSuccess, signUpSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
    try {
        const { email, password } = payload;

        const response = yield call(api.post, 'sessions', {
            email,
            password,
        });

        const { token, user } = response.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;

        yield put(signInSuccess(token, user));
    } catch (err) {
        let { error } = err.response.data;
        if (error.constructor !== String) {
            error =
                'It was not possible to complete your request. Please, try again.';
        }
        showErrorSnackbar(error);
        yield put(signFailure());
    }
}

export function* signUp({ payload }) {
    try {
        const { name, email, password } = payload;

        yield call(api.post, 'users', {
            name,
            email,
            password,
        });

        yield put(signUpSuccess());

        showSuccessSnackbar('Your account has been created successfully!');
        NavigationService.navigate('SignIn');
    } catch (err) {
        let { error } = err.response.data;
        console.tron.log(error.constructor);
        if (error.constructor !== String) {
            error =
                'It was not possible to complete your request. Please, try again.';
        }
        showErrorSnackbar(error);
        yield put(signFailure());
    }
}

export function setToken({ payload }) {
    if (!payload) return;

    const { token } = payload.auth;

    if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }
}

export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
