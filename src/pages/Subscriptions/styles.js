import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    margin-top: 20px;
`;

export const SubscriptionList = styled.FlatList.attrs({
    showsVerticalScrollIndicator: false,
})``;

export const Spinner = styled.ActivityIndicator.attrs({
    color: '#FFF',
    size: 50,
})`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const EmptyListContainer = styled.View`
    align-items: center;
    opacity: 0.6;
`;

export const EmptyListIcon = styled(Icon).attrs({
    name: 'local-offer',
    size: 50,
    color: '#FFF',
})``;

export const EmptyListText = styled.Text`
    text-align: center;
    margin: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`;
