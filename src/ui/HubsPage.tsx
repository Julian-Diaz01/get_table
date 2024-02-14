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
import GroupedTables from '../components/Table/GrupedTables';
import {HubData} from "../models/HubsModels.ts";

interface GroupedData {
    [key: string]: HubData[];
}

const HubsPage = () => {
    const [hubs, setHubs] = useState<HubData[]>([]);
    const [filteredHubs, setFilteredHubs] = useState<HubData[]>([]);
    const [groupHubs, setGroupHubs] = useState<GroupedData>({});


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

        const lowerCaseFilters = {
            stage: filters.stage ? filters.stage.toLowerCase() : undefined,
            location: filters.location ? filters.location.toLowerCase() : undefined,
            name: filters.name ? filters.name.toLowerCase() : undefined,
        };

        const filteredData = hubs.filter((hub) => {
            const stageMatch = lowerCaseFilters.stage ? hub.stage?.toLowerCase().includes(lowerCaseFilters.stage) : true;
            const locationMatch = lowerCaseFilters.location ? hub.location?.toLowerCase().includes(lowerCaseFilters.location) : true;
            const nameMatch = lowerCaseFilters.name ? hub.displayName?.toLowerCase().includes(lowerCaseFilters.name) : true;

            return stageMatch && locationMatch && nameMatch;
        });

        setFilteredHubs(filteredData);
    };

    const handleGroupChange = (filters: { groupBy?: string, stage?: string; location?: string; name?: string }) => {
        const filteredData = hubs.filter((hub) => {
            const stageMatch = !filters.groupBy || !filters.stage || hub.stage?.toLowerCase().includes(filters.stage.toLowerCase());
            const locationMatch = !filters.groupBy || !filters.location || hub.location?.toLowerCase().includes(filters.location.toLowerCase());
            const nameMatch = !filters.groupBy || !filters.name || hub.displayName?.toLowerCase().includes(filters.name.toLowerCase());

            return stageMatch && locationMatch && nameMatch;
        });

        const groupData: Record<string, HubData[]> = {};

        filteredData.forEach(hub => {
            const groupKey = hub[filters.groupBy?.toLowerCase() as keyof HubData];
            if (groupKey !== undefined && typeof groupKey === 'string') {
                if (!groupData[groupKey]) {
                    groupData[groupKey] = [];
                }

                groupData[groupKey].push(hub);
            }
        });

        setGroupHubs(groupData);
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
            <FilterComponent onFilterChange={handleFilterChange} onGroupChange={handleGroupChange}/>
            {hubs.length !== 0 ?
                Object.entries(groupHubs).length !== 0 ?
                    <GroupedTables columns={columns} groups={groupHubs}/> :
                    <FlexibleTable<HubData> columns={columns} data={filteredHubs}/> :
                <div>Loading...</div>}
        </div>
    );
};

export default HubsPage;
