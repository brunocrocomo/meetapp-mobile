import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';
import Header from '~/components/Header';
import { showErrorSnackbar } from '~/utils/Snackbar';

import { signOut } from '~/store/modules/auth/actions';
import { updateProfileRequest } from '~/store/modules/user/actions';

import {
    Container,
    Separator,
    Form,
    FormInput,
    SubmitButton,
    LogoutButton,
} from './styles';

const schema = Yup.object().shape({
    name: Yup.string().required('The name field is required.'),
    email: Yup.string()
        .email('Type a valid e-mail.')
        .required('The e-mail field is required.'),
    oldPassword: Yup.string(),
    password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword
            ? field.required(
                  'The new password field is required for changing password.'
              )
            : field
    ),
    confirmPassword: Yup.string().when('password', (password, field) =>
        password
            ? field
                  .required(
                      'The confirm new password field is required for changing password.'
                  )
                  .oneOf(
                      [Yup.ref('password')],
                      'The new password does not match.'
                  )
            : field
    ),
});

export default function Profile() {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.user.profile);

    const emailRef = useRef();
    const oldPasswordRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
    }, [profile]);

    async function handleSubmit() {
        const profileData = {
            name,
            email,
            oldPassword,
            password,
            confirmPassword,
        };

        try {
            await schema.validate(profileData);

            dispatch(updateProfileRequest(profileData));
        } catch (err) {
            let errorMessage =
                'It was not possible to complete your request. Please, try again.';
            if (err.message) {
                errorMessage = err.message;
            }
            showErrorSnackbar(errorMessage);
        }
    }

    function handleLogout() {
        dispatch(signOut());
    }

    return (
        <Background>
            <Header />
            <Container>
                <Form>
                    <FormInput
                        icon="person-outline"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Type your full name"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus()}
                        blurOnSubmit={false}
                        value={name}
                        onChangeText={setName}
                    />
                    <FormInput
                        icon="mail-outline"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Type your e-mail"
                        ref={emailRef}
                        returnKeyType="next"
                        onSubmitEditing={() => oldPasswordRef.current.focus()}
                        blurOnSubmit={false}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Separator />
                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Current password"
                        ref={oldPasswordRef}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()}
                        blurOnSubmit={false}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="New password"
                        ref={passwordRef}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                            confirmPasswordRef.current.focus()
                        }
                        blurOnSubmit={false}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Confirm new password"
                        ref={confirmPasswordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <SubmitButton onPress={handleSubmit}>
                        Save Profile
                    </SubmitButton>
                    <LogoutButton onPress={handleLogout}>Logout</LogoutButton>
                </Form>
            </Container>
        </Background>
    );
}

Profile.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={20} color={tintColor} />
    ),
};
