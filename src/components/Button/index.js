import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { Container, Text } from './styles';

export default function Button({ children, loading, fontSize, ...rest }) {
    return (
        <Container {...rest}>
            {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
            ) : (
                <Text fontSize={fontSize}>{children}</Text>
            )}
        </Container>
    );
}

Button.propTypes = {
    children: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    fontSize: PropTypes.number,
};

Button.defaultProps = {
    loading: false,
    fontSize: 18,
};
