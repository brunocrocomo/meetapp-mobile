import React, { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import logo from '~/assets/logo.png';

import Background from '~/components/Background';
import { signInRequest } from '~/store/modules/auth/actions';

import {
    Container,
    Form,
    FormInput,
    SubmitButton,
    SignLink,
    SignLinkText,
} from './styles';

export default function SignIn({ navigation }) {
    const dispatch = useDispatch();
    const passwordRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loading = useSelector(state => state.auth.loading);

    function handleSubmit() {
        dispatch(signInRequest(email, password));
    }

    return (
        <Background>
            <Container>
                <Image source={logo} />
                <Form>
                    <FormInput
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Type your e-mail"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()}
                        blurOnSubmit={false}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <FormInput
                        secureTextEntry
                        placeholder="Type your password"
                        ref={passwordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <SubmitButton loading={loading} onPress={handleSubmit}>
                        Login
                    </SubmitButton>
                </Form>

                <SignLink
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}
                >
                    <SignLinkText>Create a free account</SignLinkText>
                </SignLink>
            </Container>
        </Background>
    );
}
