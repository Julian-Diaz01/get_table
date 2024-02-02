import {useEffect, useState} from 'react';
import {request} from "../services/axios.ts";
import FlexibleTable from "../components/FlexibleTable.tsx";
import ShowLogo from "../components/ShowLogo.tsx";

interface HubData {
    recoveredQuantity: number;
    totalRecoveredQuantity: number;
    type: string;
    displayName: string;
    location: string;
    logo?: {
        directLink?: string;
    };
}

const HubsPage = () => {
    const [hubs, setHubs] = useState<HubData[]>([]);

    useEffect(() => {
        const fetchHubs = async () => {
            try {
                const response = await request.get<HubData[]>('https://marketplace-demo.cleanhub.com/api/public/hubs');
                setHubs(response.data);
            } catch (error) {
                console.error('Failed to fetch hubs:', error);
            }
        };

        fetchHubs();
    }, []);

    const columns = [
        {id: 'logo', label: 'Logo', format: (value: HubData['logo']) => <ShowLogo logo={value}/>},
        {id: 'displayName', label: 'Display Name'},
        {
            id: 'recoveredQuantity',
            label: 'Recovered Quantity (Kg)',
            format: (value: number) => Math.round(value).toString()
        },
        {
            id: 'totalRecoveredQuantity',
            label: 'Total Recovered Quantity (Kg)',
            format: (value: number) => Math.round(value).toString()
        },
        {id: 'type', label: 'Type'},
        {id: 'location', label: 'Location'},
    ];

    return (
        <div>
            <h2>Hubs</h2>
            <FlexibleTable<HubData> columns={columns} data={hubs}/>
        </div>
    );
};

export default HubsPage;
