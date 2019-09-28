import styled from 'styled-components/native';

import Button from '~/components/Button';

export const Container = styled.View`
    height: 345px;
    margin: 0 20px 20px 20px;
    border-radius: 4px;
    background: #fff;
`;

export const Image = styled.Image.attrs({
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
})`
    height: 150px;
`;

export const Content = styled.View`
    flex: 1;
    margin: 20px;
`;

export const Title = styled.Text.attrs({
    numberOfLines: 1,
})`
    margin-bottom: 7px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;

export const IconLabel = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

export const Label = styled.Text.attrs({
    numberOfLines: 1,
})`
    font-size: 13px;
    margin-left: 5px;
    color: #999;
`;

export const SubscribeButton = styled(Button)`
    height: 40px;
    margin-top: 5px;
`;
