import styled from '@emotion/styled';

const Divider = styled('hr')`
  height: 1px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgContrastLower};
  width: 100%;
  margin-top: ${({ mt }) => mt};
  margin-bottom: ${({ mb }) => mb};
`;
export default Divider;
