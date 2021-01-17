import {createMuiTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7a7a7e',
        },
        secondary: {
            main: '#b1b1b1',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#302e2e',
        },
        text: {
            primary: "#ffffff",
            secondary: "#000000"
        }
    },
});

export default theme;
