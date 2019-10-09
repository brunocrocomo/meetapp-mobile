import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';

import { updateProfileSuccess, updateProfileFailure } from './actions';
import {
    showSuccessSnackbar,
    showErrorSnackbar,
} from '../../../utils/Snackbar';

export function* updateProfile({ payload }) {
    try {
        const { name, email, ...rest } = payload.data;

        const profile = {
            name,
            email,
            ...(rest.oldPassword ? rest : {}),
        };

        const response = yield call(api.put, 'users', profile);

        showSuccessSnackbar('Your account has been updated successfully!');

        yield put(updateProfileSuccess(response.data));
    } catch (err) {
        let errorMessage =
            'It was not possible to complete your request. Please, try again.';
        if (err.response) {
            const { error } = err.response.data;
            if (error.constructor === String) {
                errorMessage = error;
            }
        }
        showErrorSnackbar(errorMessage);
        yield put(updateProfileFailure());
    }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
