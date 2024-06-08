import { Button, Table } from 'antd';
import React, { useState } from 'react';
import {  Steps ,Form,Select} from 'antd';
import '../CSS/Modal.css'
import DraggerComponent from '../Components/Dragger';
import CommonTable from '../Components/Table';
import warn from '../assets/warn.png'
import previcon from '../assets/previousicon.png'
import nexticon from '../assets/nexticon.png'
import nextdisabledarrow from '../assets/nextdisabledarrow.png'
import { useNavigate } from 'react-router-dom';
import folder from '../assets/folder.png'
import Icon from '@ant-design/icons/lib/components/Icon';
const ModalCreate = () => {
    const navigate = useNavigate();
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
            title: 'Molecular_Weight',
            dataIndex: 'molecular_weight'
        },
        {
            title: 'MP_Kexp	',
            dataIndex: 'mpkexp'
        },
        {
            title: 'MP_Cexp	',
            dataIndex: 'mpcexp'
        }
    ];
    const data = [];
    for (let i = 0; i < 4; i++) {
        data.push({
            key: i,
            chemical_name: `[(benzoylamino)oxy]acetic acid`,
            smiles: 'C1=CC=C(C=C1)C(=O)NOCC(=O)O',
            formula: 32,
            molecular_weight: '237.078978',
            mpkexp: '443.2',
            mpcexp: '170.05'
        });
        console.log(data)
    }
    const [step, setStep] = useState(0);
    const [disablenextstep, setDisablenextstep] = useState(true);
    const onChange = (value) => {
        setDisablenextstep(false);
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    async function enablenext(val) {
        console.log(val)
        setDisablenextstep(val);
    }
    async function gotonextstep() {
        if (step < 3) {
            setStep(step + 1);
        }
        setDisablenextstep(true)
    }
    async function gotoprevstep() {
        console.log(step)
        if (step > 0) {
            setStep(step - 1);
        }
    }
    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className="flex justify-between items-center modal-create">
                <Button className='button' onClick={() => { navigate('/')}}>Go to Dashboard</Button>
                <p className='page-title'>New Model Creation</p>
                <div className="flex justify-between items-center modal-create gap-4">
                    {step > 0 && step<3 && <Button className='modal-button' onClick={gotoprevstep} style={{
                        fontWeight: 600, lineHeight: '20px', fontSize: '14px', color: 'rgba(105, 65, 198, 1)'}}><span style={
                        {
                            width: '20px',
                            height:'20px'
                        }
                    }><img src={previcon}></img></span>Previous Step</Button>}
                    {
                        disablenextstep && step < 3   ? <Button type='primary' className='modal-button' style={{
                            backgroundColor: 'rgba(242, 244, 247, 1)', color: 'rgba(152, 162, 179, 1)'
                        }} >Next Step<span style={
                            {

                                width: '16px',
                                height: '12px'
                            }
                        }><img src={nextdisabledarrow} style={{ height: '100%' }}></img></span></Button> :   step < 3 ? 
                            <Button type='primary' className='modal-button' style={{ backgroundColor: 'rgba(127, 86, 217, 1)' }} disabled={step > 0 && disablenextstep} onClick={gotonextstep} >Next Step<span style={
                                {
                                    width: '16px',
                                    height: '12px'
                                }
                            }><img src={nexticon} style={{ height: '100%' }}></img></span></Button> : <Button type='primary' className='modal-button' style={{ backgroundColor: 'rgba(127, 86, 217, 1)' }}  onClick={gotonextstep} >Create Modal</Button>
                    }
                    
                </div>
            </div>
            <div className='stepper flex justify-center '>
                <Steps
                    style={{width:'50%'}}
                    // progressDot
                    current={step}
                    items={[
                        {
                            title: 'Upload Your Data',
                        },
                        {
                            title: 'Select Identifier',
                        },
                        {
                            title: 'Select Property'
                        },
                        {
                            title: 'Review and Confirm'
                        },
                    ]}
                />
            </div>
            
            {step===0 && <div className='steptext'>
                <div className='flex flex-col'>
                    <p className='title'>Upload Your Data to Get Started</p>
                    <p className='content'>Use your custom SMILES string data to create a model tailored specifically to your needs.This allows for in-depth analysis and precise results based on your unique formulations. Please note that model training may take up to 24 hours to complete.</p>
                </div>
              
            </div>}
            {step === 0 && <div className='w-full flex justify-center dragger'>
                <DraggerComponent enablenext={enablenext}></DraggerComponent>
            </div>}
            {step === 1 && <div className='steptext'>
                <div className='flex flex-col'>
                    <p className='title'>Select Rows for Model Training</p>
                    <p className='content'>Choose the rows from your data that you want to use for model training. The selected rows should contain the SMILES strings, which represent the unique identifiers of the chemical compounds in your formulations. Your file data is displayed in the table below—select the rows that you want to include in the model training process.</p>
                </div>

            </div>}
            {step === 1 && <div className='w-full flex justify-center'><CommonTable enablenext={enablenext} showCheckoption={ true}></CommonTable></div>}
            {step === 2 && <div className='thirdsteptext'>
                <div className='flex flex-col'>
                    <p className='title'>Select Your Target Property</p>
                    <p className='content'>
                        Choose the property you want to target for this model training. Each SMILES string in your data may have multiple associated properties, but you can select only one property for this model. The selected property will be the focus of the model training. Review the columns in the table below and select the property that best fits your desired outcome.
                    </p>
                </div>

            </div>}
            {step === 2 && <div className='flex w-full justify-center'>
                <div className='w-6/12 flex gap-4 items-center warning-div'>
                    <span style={{height:'28px'}}><img src={warn} style={{height:'100%'}}></img></span>
                    <p style={{
                        fontSize: '14px', lineHeight: '20px', fontWeight: '600', color: 'rgba(52, 64, 84, 1)'}}>It's important to select a column for a property, as not doing so may result in a processing error.</p>
                    </div>
                </div>
            }
            {step === 2 && <div className='w-full flex justify-center' style={{padding:'15px 0px'}}>
                <Form 
                style={{width:'25%'}} layout='vertical'>
                    <Form.Item label="Property Name"
                    >
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>}
            {step === 2 && <div className='w-full flex flex-col justify-center items-center'>
                <CommonTable showCheckoption={false} columns={columns} dataSource={data} ></CommonTable>
            </div>}
            {step === 3 && <div className='fourthsteptext'>
                <div className='flex flex-col'>
                    <p className='title'>Review and Confirm</p>
                    <p className='content'>
                        Please review your file, the selected SMILES strings, and the targeted property. Ensure all details are correct before confirming to begin model training.
                    </p>
                </div>

            </div>}
            {step === 3 && <div className='flex w-full justify-center' style={{paddingBottom:'24px'}}>
                <div className=' flex gap-4 items-center warning-div'>
                    <span style={{ height: '28px',width:'70px' }}><img src={warn} style={{ height: '100%' }}></img></span>
                    <div>
                        <p style={{fontSize:'14px',lineHeight:'20px',fontWeight:600,textAlign:'start'}}>About Estimated Completion Times</p>
                        <p style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, textAlign: 'start' }}>Estimated completion times are based on the size of your data. The average turnaround time is 24 hours, but completion times may be longer depending on your data. You will be notified via your account email once the model training is complete.</p>

                    </div>
                </div>
            </div>
            }
            {step === 3 && <div className='flex gap-4'>
                <div style={{ flexGrow: 1, height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}> File Uploaded</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
                <div style={{ flexGrow: 1, height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}> File Uploaded</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
                <div style={{ flexGrow: 1, height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}> File Uploaded</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
            </div>}
            {step === 3 && <div className='w-full flex flex-col justify-center items-center' style={{marginTop:'30px'}}>
                <CommonTable showCheckoption={false} columns={columns} dataSource={data} ></CommonTable>
            </div>}
        </div>
    );
};
export default ModalCreate;