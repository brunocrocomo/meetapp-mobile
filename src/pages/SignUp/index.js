import React, { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Background from '~/components/Background';
import { showErrorSnackbar } from '~/utils/Snackbar';
import logo from '~/assets/logo.png';

import { signUpRequest } from '~/store/modules/auth/actions';

import {
    Container,
    Form,
    FormInput,
    SubmitButton,
    SignLink,
    SignLinkText,
} from './styles';

const schema = Yup.object().shape({
    name: Yup.string().required('The name field is required.'),
    email: Yup.string()
        .email('Type a valid e-mail.')
        .required('The e-mail field is required.'),
    password: Yup.string()
        .min(6, 'Your password should have at least 6 characters.')
        .required('The password field is required.'),
});

export default function SignUp({ navigation }) {
    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loading = useSelector(state => state.auth.loading);

    async function handleSubmit() {
        try {
            await schema.validate({ name, email, password });

            dispatch(signUpRequest(name, email, password));
        } catch (err) {
            let errorMessage =
                'It was not possible to complete your request. Please, try again.';
            if (err.message) {
                errorMessage = err.message;
            }
            showErrorSnackbar(errorMessage);
        }
    }

    return (
        <Background>
            <Container>
                <Image source={logo} />
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
                        onSubmitEditing={() => passwordRef.current.focus()}
                        blurOnSubmit={false}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Type your password"
                        ref={passwordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <SubmitButton loading={loading} onPress={handleSubmit}>
                        Create account
                    </SubmitButton>
                </Form>

                <SignLink
                    onPress={() => {
                        navigation.navigate('SignIn');
                    }}
                >
                    <SignLinkText>I already have an account</SignLinkText>
                </SignLink>
            </Container>
        </Background>
    );
}
