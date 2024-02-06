import {useEffect, useState} from 'react';
import {request} from "../services/axios.ts";
import FlexibleTable from "../components/Table/FlexibleTable.tsx";
import ShowLogo from "../components/Table/ShowLogo.tsx";
import PlasticProgress from "../components/Table/PlasticProgress.tsx";
import HubLink from "../components/Table/HubLink.tsx";
import {HubStage, HubStageEnum} from "../components/Table/HubStage.tsx";
import {capitalizeFirstLetter} from "../utils/format.ts";
import FilterComponent from "../components/FilterComponent.tsx";
import {ShowJson} from "../components/ShowJson.tsx";

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
    const [filteredHubs, setFilteredHubs] = useState<HubData[]>([]);

    useEffect(() => {
        const fetchHubs = async () => {
            try {
                const response = await request.get<HubData[]>('https://marketplace-demo.cleanhub.com/api/public/hubs');
                setHubs(response.data);
                setFilteredHubs(response.data);
            } catch (error) {
                console.error('Failed to fetch hubs:', error);
            }
        };

        fetchHubs();
    }, []);

    const handleFilterChange = (filters: { stage?: string; location?: string; name?: string }) => {
        const filteredData = hubs.filter((hub) => {
            const stageMatch = filters.stage ? hub.stage?.toLowerCase().includes(filters.stage.toLowerCase()) : true;
            const locationMatch = filters.location ? hub.location?.toLowerCase().includes(filters.location.toLowerCase()) : true;
            const nameMatch = filters.name ? hub.displayName?.toLowerCase().includes(filters.name.toLowerCase()) : true;

            return stageMatch && locationMatch && nameMatch;
        });

        setFilteredHubs(filteredData);
    };

    const columns = [
        {
            id: 'logo',
            label: '',
            format: (value: HubData['logo'], row: HubData) => <>
                <ShowJson obj={row}/>
                <ShowLogo logo={value} name={row.displayName}/></>
        },
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
    ] as never;
    return (
        <div>
            <h2 style={{textAlign: 'left'}}>Active Hubs</h2>
            <FilterComponent onFilterChange={handleFilterChange}/>
            {hubs.length !== 0 ? <FlexibleTable<HubData> columns={columns} data={filteredHubs}/> :
                <div>Loading...</div>}
        </div>
    );
};

export default HubsPage;
