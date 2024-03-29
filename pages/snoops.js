import { useEffect, useState, useRef } from "react"
import SnoopForm from "../components/snoopForm";
import Image from 'next/image'
import { Button, TableContainer, TableRow, TableCell, TableBody, Table, Paper, TableHead } from '@mui/material'
import { MAX_NUM_SNOOPS, FIELD_NAME_PREFIX } from '../components/helpers';
import { useSession } from "../lib/hooks";
import Layout from "../components/layout";
import { SuccessSnackBar } from "../components/successSnackbar";
const SNOOP_FIELDS = Array.apply(null, Array(MAX_NUM_SNOOPS)).map((_, i) => `${FIELD_NAME_PREFIX}${i}`)



const hasActiveSnoops = (allSnoops) => allSnoops.filter(info => info && info.text().length).length > 0

export default function UserHomePage() {
    const user = useSession({})
    const [allSnoops, setAllSnoops] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    let fetched = useRef(false);

    const getAllSnoops = async () => {
        const snoops = await user.client.get(user.email, SNOOP_FIELDS)
        setAllSnoops(snoops)
    }

    function ActiveSnoop({ info, snoopNumber }) {
        info = JSON.parse(info.text());
        async function handleUnsubscribe() {
            await user.client.put(user.email, FIELD_NAME_PREFIX + snoopNumber, '') //empty string means deletion
            await fetch(`${process.env.BASE_PATH}/api/update-subscription`, {
                method: 'POST',
            })
            await getAllSnoops();
            await fetch(`${process.env.BASE_PATH}/api/send-confirmation`, {
                method: 'POST',
                body: JSON.stringify({ isSubscribing: false, userEmail: user.email, snoopName: info.name, snoopAddress: info.address }),
            })
            setSuccessMessage(info.name);
        }
        const displayedAddress = info.address.substring(0, 7) + '...'

        return (
            <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {info.name}
                </TableCell>
                <TableCell >
                    <a href={`https://etherscan.io/address/${info.address}`}>
                        {displayedAddress} <Image width={15} height={15} src="../cryptosnoop/newwindow.svg" />
                    </a>

                </TableCell>
                <TableCell><Button onClick={handleUnsubscribe}>Unsubscribe</Button></TableCell>
            </ TableRow>
        )
    }

    useEffect(() => {
        if (!fetched.current && user) {
            fetched.current = true;
            getAllSnoops()
        }
    }, [user])

    return (user &&
        <>
            <Layout>
                <h1>Cryptosnoop subscriptions</h1>
                {hasActiveSnoops(allSnoops) ?
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nickname</TableCell>
                                    <TableCell >Address</TableCell>
                                    <TableCell ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allSnoops.map((info, i) => info && info.text().length > 0 &&
                                    <ActiveSnoop key={i} snoopNumber={i} info={info} />)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    <div>Your active subscriptions will be shown here. Click the button below to subscribe to email notifications whenever an Ethereum address of your choice has account activity!</div>
                }
                <br />
                <SnoopForm allSnoops={allSnoops} getAllSnoops={getAllSnoops} />
                <SuccessSnackBar
                    open={Boolean(successMessage)}
                    onClose={() => setSuccessMessage(null)}
                    message={`You have successfully unsubscribed from ${successMessage}.`}
                />
            </Layout>

        </>
    )
}