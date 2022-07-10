import { useEffect, useState } from "react"
import SnoopForm from "./snoopForm";
import { Button, TableContainer, TableRow, TableCell, TableBody, Table, Paper, TableHead } from '@mui/material'
import { PrivyClient, CustomSession } from "@privy-io/privy-browser";
import { privy, MAX_NUM_SNOOPS, FIELD_NAME_PREFIX } from './helpers';
const SNOOP_FIELDS = Array.apply(null, Array(MAX_NUM_SNOOPS)).map((_, i) => `${FIELD_NAME_PREFIX}${i}`)



function ActiveSnoop({ userId, info, snoopNumber, refreshSnoops }) {
    info = JSON.parse(info.text());
    async function handleUnsubscribe() {
        await privy.client.put(userId, FIELD_NAME_PREFIX + snoopNumber, '') //empty string means deletion
        console.log('one i just deleted', await privy.client.get(userId, FIELD_NAME_PREFIX + snoopNumber))
        await fetch('/api/update-subscription', {
            method: 'POST',
        })
        refreshSnoops();

    }

    return (
        <TableRow
            key={snoopNumber}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                {info.name}
            </TableCell>
            <TableCell >{info.address}</TableCell>
            <TableCell><Button onClick={handleUnsubscribe}>Unsubscribe</Button></TableCell>
        </TableRow>
    )
}

const hasActiveSnoops = (allSnoops) => allSnoops.filter(info => info && info.text().length).length > 0

export default function UserHomePage({ userEmail }) {
    const [allSnoops, setAllSnoops] = useState([]);

    const getAllSnoops = async () => {
        const snoops = await privy.client.get(userEmail, SNOOP_FIELDS)
        setAllSnoops(snoops)
    }

    useEffect(() => {
        if (!privy.client) {
            const session = new CustomSession(async function authenticate() {
                //go fetch access token
                const response = await fetch('/api/privy/token', {
                    body: JSON.stringify(userEmail),
                    method: 'POST'
                })

                return (await response.json()).token
            });
            privy.client = new PrivyClient({
                session: session
            });
        }
        getAllSnoops()
    }, [])

    return (
        <>
            <h1>Cryptosnoop subscriptions</h1>
            {hasActiveSnoops(allSnoops) &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 550 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nickname</TableCell>
                                <TableCell >Address</TableCell>
                                <TableCell ></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allSnoops.map((info, i) => info && info.text().length > 0 && <ActiveSnoop refreshSnoops={getAllSnoops} snoopNumber={i} userId={userEmail} info={info} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            <br />
            <SnoopForm userEmail={userEmail} allSnoops={allSnoops} getAllSnoops={getAllSnoops} />
        </>
    )
}
