import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

export default styled(LinearGradient).attrs({
    // @TODO: check why the gradient is not rendering correctly
    colors: ['#22202C', '#402845'],
    // colors: ['#7159c1', '#ab59c1'],
})`
    flex: 1;
`;
