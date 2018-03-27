
import * as styledComponents from 'styled-components'



export interface IThemeInterface {
  primaryColor: string
}

export const theme = {
  primaryColor: '#e9e9eb'
}
// withProps comes from:
// https://github.com/styled-components/styled-components/issues/630 from atfzl
type StyledFunction<T> = styledComponents.ThemedStyledFunction<T, IThemeInterface>;

function withProps<T, U extends HTMLElement = HTMLElement>(
  styledFunction: StyledFunction<React.HTMLProps<U>>,
): StyledFunction<T & React.HTMLProps<U>> {
  return styledFunction;
}
const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>


export default styled
export { css, injectGlobal, keyframes, ThemeProvider, withProps }