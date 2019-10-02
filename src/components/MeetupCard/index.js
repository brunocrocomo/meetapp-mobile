import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import {
    Container,
    Image,
    Content,
    Title,
    IconLabel,
    Label,
    SubscribeButton,
} from './styles';

export default function MeetupCard({ data, buttonLabel, onButtonPress }) {
    let fileUrl = data.file.url;
    if (__DEV__) {
        fileUrl = data.file.url.replace('localhost', '10.0.2.2');
    }

    return (
        <Container past={data.past}>
            {
                <Image
                    source={{
                        uri: fileUrl,
                    }}
                    resizeMode="cover"
                />
            }
            <Content>
                <Title>{data.title}</Title>
                <IconLabel>
                    <Icon name="event" size={14} color="#999" />
                    <Label>{data.date}</Label>
                </IconLabel>
                <IconLabel>
                    <Icon name="place" size={14} color="#999" />
                    <Label>{data.location}</Label>
                </IconLabel>
                <IconLabel>
                    <Icon name="person" size={14} color="#999" />
                    <Label>Organizador: {data.User.name}</Label>
                </IconLabel>
                <SubscribeButton onPress={onButtonPress}>
                    {buttonLabel}
                </SubscribeButton>
            </Content>
        </Container>
    );
}

MeetupCard.propTypes = {
    data: PropTypes.shape({
        past: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        User: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }),
        file: PropTypes.shape({
            url: PropTypes.string.isRequired,
        }),
    }).isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onButtonPress: PropTypes.func,
};

MeetupCard.defaultProps = {
    onButtonPress: null,
};
