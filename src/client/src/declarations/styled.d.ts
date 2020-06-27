import {} from 'styled-components';
import theme from '../theme';

// This allows us to keep our theme in a single file 
// by leveraging typescripts type inference 
// https://blog.agney.dev/styled-components-&-typescript/
declare module 'styled-components' {
  type Theme = typeof theme;
  export interface DefaultTheme extends Theme {}
}