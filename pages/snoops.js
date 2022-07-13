import { useEffect, useState } from "react"
import SnoopForm from "../components/snoopForm";
import { Button, TableContainer, TableRow, TableCell, TableBody, Table, Paper, TableHead } from '@mui/material'
import { MAX_NUM_SNOOPS, FIELD_NAME_PREFIX } from '../components/helpers';
import { useUser } from "../lib/hooks";
import Router from "next/router";
import Layout from "../components/layout";
const SNOOP_FIELDS = Array.apply(null, Array(MAX_NUM_SNOOPS)).map((_, i) => `${FIELD_NAME_PREFIX}${i}`)

function ActiveSnoop({ userId, info, snoopNumber, refreshSnoops }) {
    info = JSON.parse(info.text());
    async function handleUnsubscribe() {
        await user.client.put(userId, FIELD_NAME_PREFIX + snoopNumber, '') //empty string means deletion

        await fetch(`${process.env.BASE_PATH}/api/update-subscription`, {
            method: 'POST',
        })
        await refreshSnoops();
    }

    return (
        <TableRow
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

export default function UserHomePage() {
    const user = useUser({ redirectTo: '/' })
    const [allSnoops, setAllSnoops] = useState([]);

    const getAllSnoops = async () => {
        const snoops = await user.client.get(user.email, SNOOP_FIELDS)
        setAllSnoops(snoops)
    }

    useEffect(() => {
        if (!user) {
            Router.replace('/')
            return;
        }
        getAllSnoops()
    }, [])

    return (user &&
        <>
            <Layout>
                <h1>Cryptosnoop subscriptions</h1>
                {hasActiveSnoops(allSnoops) ?
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
                                {allSnoops.map((info, i) => info && info.text().length > 0 &&
                                    <ActiveSnoop key={i} refreshSnoops={getAllSnoops} snoopNumber={i} userId={user.email} info={info} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    <div>Your active subscriptions will be shown here. Click the button below to subscribe to email notifications whenever an Ethereum address of your choice has account activity!</div>
                }
                <br />
                <SnoopForm userEmail={user.email} allSnoops={allSnoops} getAllSnoops={getAllSnoops} />
            </Layout>

        </>
    )
}