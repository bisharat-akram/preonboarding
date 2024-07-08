import React, { useState } from 'react';
import { Button, Table } from 'antd';
import '../CSS/Table.css'

// const data = [];
// for (let i = 0; i < 46; i++) {
//     data.push({
//         key: i,
//         chemical_name: `[(benzoylamino)oxy]acetic acid`,
//         smiles:'C1=CC=C(C=C1)C(=O)NOCC(=O)O',
//         formula: 32,
//         molecular_weight:'237.078978',
//         mp_kexp: `443.2`,
//         mp_cexp:'170.05'
//     });
// }
const CommonTable = ({ enablenext, showCheckoption, data, uploadselectedexceldata, columns }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
  console.log(data)
    const onSelectChange = (newSelectedRowKeys,selectedRows) => {
        console.log(data)
        console.log('selectedRowKeys changed: ', selectedRows);
        setSelectedRowKeys(() => {
            console.log(newSelectedRowKeys)
            return newSelectedRowKeys;
        });
        uploadselectedexceldata(selectedRows);
        if (newSelectedRowKeys.length) {
            enablenext(false)
        }
        else {
            enablenext(true)
        }
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div className="overflow-auto" style={{ border: '1px solid rgba(234, 236, 240, 1)',width:'95%' }}>
            <div className='flex justify-between items-center'
                style={{ height:'81px',padding:'20px 24px'}}
            >
                <div className='flex gap-4'>
                    <span style={{ fontSize: '18px', color: 'rgba(16, 24, 40, 1)', fontWeight: '600', lineHeight: '28px' }}>{`${data.length} Items`}</span>
                {hasSelected ?
                    <div style={{
                        width: 'fit-content', padding: '2px 10px', borderRadius: '16px', border: '1px solid rgba(233, 215, 254, 1)', background: 'rgba(249, 245, 255, 1)'}}>
                    <p
                    style={{
                        textAlign: 'start'
                    }}
                >
                                {hasSelected ? `${selectedRowKeys.length} ${selectedRowKeys.length>1?'rows' :'row'} selected` : ''}
                        </p>
                    </div> : ''}
                </div>
                <p style={{
                    color: 'rgba(105, 65, 198, 1)',fontWeight:'600',fontSize:'14px',lineHeight:'20px'}}>Replace File</p>
            </div>
            {showCheckoption ? <Table className="modal-table" rowSelection={rowSelection} columns={columns} dataSource={data} /> : <Table className="modal-table"  columns={columns} dataSource={data} />}
           
        </div>
    );
};
export default CommonTable;