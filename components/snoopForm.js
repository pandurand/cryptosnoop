import { useRef, useState } from 'react';
import { Grid, TextField, Button, Modal, Box, } from '@mui/material'
import { privy, FIELD_NAME_PREFIX, MAX_NUM_SNOOPS } from './helpers'

export default function SnoopForm({ userEmail, allSnoops, getAllSnoops }) {
    const nameRef = useRef(null);
    const [address, setAddress] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (!/^0x[a-fA-F0-9]{40}$/.test(address) || nameRef.current.value.length == 0) return;
        const emptyField = FIELD_NAME_PREFIX + allSnoops.findIndex((info) => !info || !info.text());
        await privy.client.put(userEmail, emptyField, JSON.stringify({ name: nameRef.current.value, address: address.toLowerCase() }))
        await fetch('/api/update-subscription', {
            method: 'POST',
            body: JSON.stringify(userEmail),
        })
        setModalOpen(false);
        getAllSnoops();
    }

    return (
        <>
            <div>Note: only a maximum of three snoop subscriptions may be added.</div>
            <br />

            <Button
                onClick={() => setModalOpen(true)}
                disabled={allSnoops.filter(info => info && info.text()).length === MAX_NUM_SNOOPS}
                variant="outlined">
                Add new snoop
            </Button>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <TextField
                                    id="name-input"
                                    name="name"
                                    label="Nickname"
                                    type="text"
                                    inputRef={nameRef}
                                    required
                                    placeholder='e.g. Vitalik'
                                    helperText='This will be used in email notifications'
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="address-input"
                                    name="address"
                                    label="Address"
                                    type="text"
                                    required
                                    onChange={(e) => setAddress(e.target.value)}
                                    error={address.length > 0 && !/^0x[a-fA-F0-9]{40}$/.test(address)}
                                    helperText="Must be a valid ethereum address starting with '0x'"
                                    placeholder='e.g. 0x12345678...'
                                />
                            </Grid>
                            <Grid item >
                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </Grid>

                        </Grid>
                    </form>

                </Box>

            </Modal >
        </>

    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};