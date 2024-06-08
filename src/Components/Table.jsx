import React, { useState } from 'react';
import { Button, Table } from 'antd';
import '../CSS/Table.css'
const columns = [
    {
        title: 'Chemical_Name',
        dataIndex: 'chemical_name',
    },
    {
        title: 'Smiles',
        dataIndex: 'smiles',
    },
    {
        title: 'Formula',
        dataIndex: 'formula',
    },
    {
        title: 'Formula',
        dataIndex: 'formula',
    },
    {
        title: 'Molecular_Weight',
        dataIndex:'molecular_weight'
    },
    {
        title: 'MP_Kexp',
        dataIndex: 'mp_kexp'
    },
    {
        title: 'MP_Cexp',
        dataIndex: 'mp_cexp'
    }
];
const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        chemical_name: `[(benzoylamino)oxy]acetic acid`,
        smiles:'C1=CC=C(C=C1)C(=O)NOCC(=O)O',
        formula: 32,
        molecular_weight:'237.078978',
        mp_kexp: `443.2`,
        mp_cexp:'170.05'
    });
}
const CommonTable = ({ enablenext, showCheckoption}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
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
        <div style={{ border: '1px solid rgba(234, 236, 240, 1)',width:'95%' }}>
            <div className='flex justify-between items-center'
                style={{ height:'81px',padding:'20px 24px'}}
            >
                <div className='flex gap-4'>
                <span style={{fontSize:'18px',color:'rgba(16, 24, 40, 1)',fontWeight:'600',lineHeight:'28px'}}>7 Items</span>
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
            {showCheckoption ? <Table className="modal-table" rowSelection={rowSelection} columns={columns} dataSource={data} footer={() => 'Footer'} /> : <Table className="modal-table"  columns={columns} dataSource={data?.splice(0,4)} footer={() => 'Footer'} />}
           
        </div>
    );
};
export default CommonTable;