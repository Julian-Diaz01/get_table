import {useEffect, useState} from 'react';
import {request} from "../services/axios.ts";
import FlexibleTable from "../components/Table/FlexibleTable.tsx";
import ShowLogo from "../components/Table/ShowLogo.tsx";
import PlasticProgress from "../components/Table/PlasticProgress.tsx";
import HubLink from "../components/Table/HubLink.tsx";
import {HubStage, HubStageEnum} from "../components/Table/HubStage.tsx";
import {capitalizeFirstLetter} from "../utils/format.ts";

interface HubData {
    recoveredQuantity?: number;
    totalRecoveredQuantity?: number;
    unassignedQuantityTotal?: number;
    stage?: string;
    type?: string;
    displayName?: string;
    location?: string;
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
        {
            id: 'logo',
            label: '',
            format: (value: HubData['logo'], row: HubData) => <ShowLogo logo={value} name={row.displayName}/>
        },
        {id: 'displayName', label: 'Name'},
        {id: 'location', label: 'Location', format: (value: string) => value ? value : '-'},
        {id: 'category', label: 'Category', format: (value: string) => capitalizeFirstLetter(value)},
        {
            id: 'stage',
            label: 'Stage',
            format: (_value: string, row: HubData) => (
                <HubStage stage={row.stage as HubStageEnum | undefined}/>
            ),
        },
        {
            id: 'plasticProgress',
            label: 'Assigned vs Unassigned Plastic',
            format: (_value: HubData, row: HubData) => {
                return row ? (
                    <PlasticProgress
                        recoveredQuantity={row.recoveredQuantity}
                        unassignedQuantityTotal={row.unassignedQuantityTotal}
                    />
                ) : null;
            },
        },
        {
            id: 'assignable',
            label: 'Assignable',
            format: (value: boolean) => value ? 'YES' : 'NO'
        },
        {
            id: 'link',
            label: '',
            format: (_value: string, row: HubData) => row?.displayName != null ?
                <HubLink displayName={row.displayName}/> : null
            ,
        },
    ];
    return (
        <div>
            <h2>Hubs</h2>
            {hubs.length !== 0 ? <FlexibleTable<HubData> columns={columns} data={hubs}/> : <div>Loading...</div>}
        </div>
    );
};

export default HubsPage;
