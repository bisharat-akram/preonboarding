import { Button, Table } from 'antd';
import React, { useState,useEffect } from 'react';
import {  Steps ,Form,Select} from 'antd';
import '../CSS/Modal.css'
import DraggerComponent from '../Components/Dragger';
import CommonTable from '../Components/Table';
import warn from '../assets/warn.png'
import previcon from '../assets/previousicon.png'
import nexticon from '../assets/nexticon.png'
import nextdisabledarrow from '../assets/nextdisabledarrow.png'
import { useNavigate } from 'react-router-dom';
import folder from '../assets/folder.png';
import Featuredfileicon from '../assets/Featuredfileicon.png';
import rowsselected from '../assets/rowsselected.png';
import selectedcolumnname from '../assets/selectedcolumnname.png'
import time from '../assets/time.png';
import config from "../../amplify_outputs.json";
import Icon from '@ant-design/icons/lib/components/Icon';
import { fetchAuthSession } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api';
import { useSelector } from 'react-redux';
const ModalCreate = () => {
    const navigate = useNavigate();
    const user = useSelector(st => st?.user);
    const [excelData, setExcelData] = useState([]);
    const [uploadedFile, setUploadedFile] = useState();
    const [selectedexcelData, setSelectedExcelData] = useState([]);
    const [columns, setColumns] = useState([]);
    async function addColumns(data) {
        setColumns(data);
    }
    const [step, setStep] = useState(0);
    const [disablenextstep, setDisablenextstep] = useState(true);
    const [selectedColumnName, setSelectedColumnName] = useState([]);
    const onChange = (value) => {
        console.log(value)
        setSelectedColumnName(value)
        enablenext(false);
        console.log(`selected ${value}`);
    };
    const changeuploadedfile = (file) => {
        console.log(file)
        setUploadedFile(file)
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
    const uploadexceldata=(data)=>{
        console.log(data);
        setExcelData(data);
    }
    const uploadselectedexceldata = (data) => {
        console.log(data);
        setSelectedExcelData(data);
    }
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
        setDisablenextstep(true);
    }
    async function callLambda() {
        console.log('ss', selectedexcelData, '', selectedColumnName)
        const bodydata = {}
        
        // let dummydata = Object.fromEntries(
        //     Object.entries(selectedexcelData[0]).map(([key, value]) => [key.toUpperCase(), value])
        // );
        
        const temp = selectedColumnName.map((data) => {
            let arr = {}
            console.log(data)
        
            selectedexcelData?.map((exceldataselected, ind) => {
                console.log(exceldataselected, data, selectedexcelData, exceldataselected[`${data}`])
                arr[ind] = exceldataselected[`${data}`]
            })
            console.log({ [data]: arr })
            return { [data]: arr };
        })
        const bodyexcel = temp.reduce((result, item) => {
            const [key, value] = Object.entries(item)[0];
            result[key] = value;
            return result;
        }, {});
        console.log(bodyexcel)
        // const bodyexcel = temp.map((data) => data);
        

        const options = {
            body: JSON.stringify({
                "userId": user?.sub,
                ...bodyexcel
            }),
            "method":"POST",
        };
        let restOperation = await fetch(import.meta.env.VITE_PATH, options);

        // const restOperation = post({
        //     apiName: 'myRestApi',
        //     path: ,
        //     options: {
        //         body: {
        //             "userId": user?.sub,
        //             ...bodyexcel
        //         }
        //     }
        // });
        const { body } = await restOperation.response;
        const response = await body.json();

        console.log('POST call succeeded');
        console.log(response);
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
                            <Button type='primary' className='modal-button' disabled={step > 0 && disablenextstep} onClick={gotonextstep} >Next Step<span style={
                                {
                                    width: '16px',
                                    height: '12px'
                                }
                            }><img src={nexticon} style={{ height: '100%' }}></img></span></Button> : <Button type='primary' className='modal-button' style={{ backgroundColor: 'rgba(127, 86, 217, 1)' }}  onClick={()=>callLambda()} >Create Model</Button>
                    }
                    
                </div>
            </div>
            <div className='stepper flex justify-center '>
                <Steps
                    style={{ width: '80%' }}
                    current={step}
                    items={[
                        {
                            title: 'Upload Your Data',
                            icon: (
                                <div style={{
                                    border: step === 0 ? '4px solid #0794553D' : '1px solid #0794553D',
                                    borderRadius: '50%',
                                    height: '35px',
                                    width: '35px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                  
                                    <div style={{
                                        borderRadius: '50%',
                                        background: step === 0 ? '#079455' : '#D0D5DD',
                                        height: step === 0 ? '100%':'10px',
                                        width: step === 0 ? '100%' : '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {step === 0 && (
                                            <div style={{
                                                borderRadius: '50%',
                                                background: 'white',
                                                height: '50%',
                                                width: '50%'
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: 'Select Identifier',
                            icon: (
                                <div style={{
                                    border: step === 1 ? '4px solid #0794553D' : '1px solid #0794553D',
                                    borderRadius: '50%',
                                    height: '35px',
                                    width: '35px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>

                                    <div style={{
                                        borderRadius: '50%',
                                        background: step === 1 ? '#079455' : '#D0D5DD',
                                        height: step === 1 ? '100%' : '10px',
                                        width: step === 1 ? '100%' : '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {step === 1 && (
                                            <div style={{
                                                borderRadius: '50%',
                                                background: 'white',
                                                height: '50%',
                                                width: '50%'
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: 'Select Property',
                            icon: (
                                <div style={{
                                    border: step === 2 ? '4px solid #0794553D' : '1px solid #0794553D',
                                    borderRadius: '50%',
                                    height: '35px',
                                    width: '35px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>

                                    <div style={{
                                        borderRadius: '50%',
                                        background: step === 2 ? '#079455' : '#D0D5DD',
                                        height: step === 2 ? '100%' : '10px',
                                        width: step === 2 ? '100%' : '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {step === 2 && (
                                            <div style={{
                                                borderRadius: '50%',
                                                background: 'white',
                                                height: '50%',
                                                width: '50%'
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            )
                        },
                        {
                            title: 'Review and Confirm',
                            icon: (
                                <div style={{
                                    border: step === 3 ? '4px solid #0794553D' : '1px solid #0794553D',
                                    borderRadius: '50%',
                                    height: '35px',
                                    width: '35px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>

                                    <div style={{
                                        borderRadius: '50%',
                                        background: step === 3 ? '#079455' : '#D0D5DD',
                                        height: step === 3 ? '100%' : '10px',
                                        width: step === 3 ? '100%' : '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {step === 3 && (
                                            <div style={{
                                                borderRadius: '50%',
                                                background: 'white',
                                                height: '50%',
                                                width: '50%'
                                            }}></div>
                                        )}
                                    </div>
                                </div>
                            )
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
                <DraggerComponent enablenext={enablenext} uploadexceldata={uploadexceldata} changeuploadedfile={changeuploadedfile} addColumns={addColumns}></DraggerComponent>
            </div>}
            {step === 1 && <div className='steptext'>
                <div className='flex flex-col'>
                    <p className='title'>Select Rows for Model Training</p>
                    <p className='content'>Choose the rows from your data that you want to use for model training. The selected rows should contain the SMILES strings, which represent the unique identifiers of the chemical compounds in your formulations. Your file data is displayed in the table below—select the rows that you want to include in the model training process.</p>
                </div>

            </div>}
            {step === 1 && <div className='w-full flex justify-center '><CommonTable enablenext={enablenext} showCheckoption={true} data={excelData} columns={columns} uploadselectedexceldata={uploadselectedexceldata} ></CommonTable></div>}
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
                            mode="multiple"
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={filterOption}
                            options={columns}
                        />
                    </Form.Item>
                </Form>
            </div>}
            {step === 2 && <div className='w-full flex flex-col justify-center items-center'>
                <CommonTable showCheckoption={false} columns={columns} data={selectedexcelData} ></CommonTable>
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
            {step === 3 && <div className='flex gap-4' style={{padding:'0 24px'}}>
                <div style={{ width:'25%', height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px'}}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '55px' }}>
                                <img src={Featuredfileicon} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }} > File Uploaded</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '80%' }}>{uploadedFile?.name}</p>
                    </div>
                    <div className='flex justify-center items-center' onClick={()=>setStep(0)}  style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
                <div style={{ width: '25%', height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '55px' }}>
                                <img src={rowsselected} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}> Rows Selected</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>{selectedexcelData?.length} Rows</p>
                    </div>
                    <div className='flex justify-center items-center' onClick={() => setStep(1)} style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
                <div style={{ width: '25%', height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '55px' }}>
                                <img src={selectedcolumnname} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}> Targeted Property</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '80%' }}>{selectedColumnName.join(',')}</p>
                    </div>
                    <div className='flex justify-center items-center' onClick={() => setStep(2)} style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
                <div style={{ width: '25%', height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '55px' }}>
                                <img src={time} style={{ height: '100%' }}></img>
                            </span>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>Estimated Completion Time</p>
                        <p className="text-start" style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>May 23,2024 12:02 PM</p>
                    </div>
                    <div className='flex justify-center items-center'  style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>Edit</p>
                    </div>
                </div>
            </div>}
            {step === 3 && <div className='w-full flex flex-col justify-center items-center' style={{marginTop:'30px'}}>
                <CommonTable columns={columns } showCheckoption={false}  data={selectedexcelData} ></CommonTable>
            </div>}
        </div>
    );
};
export default ModalCreate;