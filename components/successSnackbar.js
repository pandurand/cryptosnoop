import MuiAlert from '@mui/material/Alert';
import { Snackbar } from '@mui/material'
import { forwardRef } from 'react'

const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
Alert.displayName = "Alert";

export default function SuccessSnackBar({ open, onClose, message }) {
    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={onClose}
            autoHideDuration={5000}
        ><Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}