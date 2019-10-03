import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
    flex: 1;
    margin-top: 30px;
`;

export const DatePicker = styled.View`
    justify-content: center;
    align-items: center;

    flex-direction: row;

    margin-bottom: 30px;
`;

export const ChevronLeft = styled(Icon)`
    margin-right: 15px;
`;

export const ChevronRight = styled(Icon)`
    margin-left: 15px;
`;

export const ListContainer = styled.View`
    flex: 1;
    justify-content: center;
`;

export const MeetupList = styled.FlatList.attrs({
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

export const InfiniteLoaderSpinner = styled.ActivityIndicator.attrs({
    color: '#FFF',
    size: 'small',
})`
    margin-bottom: 20px;
`;

export const EmptyListContainer = styled.View`
    align-items: center;
    opacity: 0.6;
`;

export const EmptyListIcon = styled(Icon).attrs({
    name: 'format-list-bulleted',
    size: 50,
    color: '#FFF',
})``;

export const EmptyListText = styled.Text`
    text-align: center;
    margin: 0 20px 20px 20px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`;
