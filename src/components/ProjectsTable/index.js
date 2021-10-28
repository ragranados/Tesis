import React, {useEffect} from "react";

import Table from 'rsuite/Table';
import {Pagination} from "rsuite";

import './index.css';

import 'rsuite/dist/rsuite.min.css';

const ProjectsTable = ({loading, projects}) => {

    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);

    const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
    };

    const data = projects.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
    });

    return (

        <div className="containerTable">
            <Table height={400}
                   data={data}
                   loading={false}
                   autoHeight={true}
                   loading={loading}>
                {<Table.Column width={150} align="center" fixed>
                    <Table.HeaderCell>Año</Table.HeaderCell>
                    <Table.Cell dataKey="anio"/>
                </Table.Column>}

                <Table.Column width={150}>
                    <Table.HeaderCell>DGA</Table.HeaderCell>
                    <Table.Cell dataKey="dga"/>
                </Table.Column>

                <Table.Column width={300} fixed="right">
                    <Table.HeaderCell>Consumo anual (metros cubicos)</Table.HeaderCell>
                    <Table.Cell dataKey="consumo_anual_m3"/>
                </Table.Column>
            </Table>

            <div style={{padding: 20}}>
                {data.length === 0 ? null : <Pagination
                    prev
                    next
                    boundaryLinks
                    maxButtons={5}
                    size="s"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={projects.length}
                    limitOptions={[10, 20]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={handleChangeLimit}
                />}
            </div>

        </div>

    )
}

export default ProjectsTable;
