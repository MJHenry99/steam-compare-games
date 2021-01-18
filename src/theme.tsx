import {createMuiTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#302e2e',
        },
        secondary: {
            main: '#6b6b6b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#646464',
        },
        text: {
            primary: "#ffffff",
            secondary: "#000000"
        }
    },
});

export default theme;
