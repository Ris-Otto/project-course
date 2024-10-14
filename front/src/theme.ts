/**
 * Global values for dark and light theme. The dark theme is not used in the application,
 * but it exists here if a light/dark mode functionality will be implemented later on
 */

import { DefaultTheme } from 'styled-components';

export class DarkTheme implements DefaultTheme {
    body: string = '#0D0C1D';
    text: string = '#FAFAFA';
    darkText: string = '#0D0C1D';
    toggleBorder: string = '#6B8096';
    background: string = '#0D0C1D';
    menuBackground: string = '#383D3D';
    yellow: string = '#FFED00';
    darkYellow: string = '#c7b900';
    error: string = '#FF0000';
    mobileS: string = '320px';
    mobileM: string = '375px';
    mobileL: string = '425px';
    tablet: string = '768px';
    laptop: string = '1024px';
    laptopL: string = '1440px';
    fourK: string = '2560px';
    hover: string = '#3175bd';
}